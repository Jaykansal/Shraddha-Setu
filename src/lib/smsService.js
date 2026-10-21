/**
 * ShraddhaSetu Telecom SMS Gateway Dispatcher
 * Supports:
 * 1. Fast2SMS (India instant OTP route - no DLT required for testing/quick SMS)
 * 2. 2Factor.in (India dedicated OTP SMS API)
 * 3. Twilio (Global telecom SMS)
 *
 * If no SMS API key is configured in process.env, it logs and falls back to
 * on-screen simulation and instant auto-fill code.
 */

export async function dispatchRealSms(phoneNumber, otpCode) {
  const cleanPhone = String(phoneNumber).replace(/\D/g, '').slice(-10);

  // 1. FAST2SMS (India's most popular instant OTP gateway)
  // Environment variable: FAST2SMS_API_KEY
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;
  if (fast2SmsKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2SmsKey.trim(),
          'Content-Type': 'application/json',
          'cache-control': 'no-cache',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: String(otpCode),
          numbers: cleanPhone,
        }),
      });
      const data = await response.json();
      console.log('[SMS Gateway] Fast2SMS dispatch response:', data);
      if (data && (data.return === true || data.status_code === 200)) {
        return { success: true, provider: 'Fast2SMS', data };
      }
    } catch (err) {
      console.error('[SMS Gateway] Fast2SMS error:', err);
    }
  }

  // 2. 2FACTOR.IN (Popular Indian OTP provider)
  // Environment variable: TWO_FACTOR_API_KEY
  const twoFactorKey = process.env.TWO_FACTOR_API_KEY;
  if (twoFactorKey) {
    try {
      const url = `https://2factor.in/API/V1/${encodeURIComponent(twoFactorKey)}/SMS/${cleanPhone}/${encodeURIComponent(otpCode)}/OTP1`;
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();
      console.log('[SMS Gateway] 2Factor dispatch response:', data);
      if (data && data.Status === 'Success') {
        return { success: true, provider: '2Factor', data };
      }
    } catch (err) {
      console.error('[SMS Gateway] 2Factor error:', err);
    }
  }

  // 3. TWILIO (Global Telecom)
  // Environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
  if (twilioSid && twilioAuth && twilioNumber) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', `+91${cleanPhone}`);
      params.append('From', twilioNumber);
      params.append('Body', `[ShraddhaSetu] Aapka surakshit login OTP ${otpCode} hai. Ye 10 minute ke liye maanya hai.`);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      const data = await response.json();
      console.log('[SMS Gateway] Twilio response:', data);
      if (data && !data.error_code) {
        return { success: true, provider: 'Twilio', data };
      }
    } catch (err) {
      console.error('[SMS Gateway] Twilio error:', err);
    }
  }

  // Fallback: No external gateway configured yet
  return {
    success: false,
    provider: 'Simulator',
    message: 'No SMS Gateway API Key configured. Please configure FAST2SMS_API_KEY or TWILIO credentials in Render Environment for physical phone SMS delivery.',
  };
}
