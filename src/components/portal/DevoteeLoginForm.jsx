'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DevoteeLoginForm({ redirectUrl = '/dashboard/devotee' }) {
  const router = useRouter();
  const { login, register, sendOtp, loginWithOtp } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Login state
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [devoteeName, setDevoteeName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [receivedOtp, setReceivedOtp] = useState('108108');

  // Password Login state
  const [loginEmail, setLoginEmail] = useState('devotee@shraddhasetu.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Varanasi',
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    const handleAutofill = (e) => {
      if (e && e.detail && e.detail.otp) {
        setOtp(e.detail.otp);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('shraddhasetu_autofill_otp', handleAutofill);
      return () => window.removeEventListener('shraddhasetu_autofill_otp', handleAutofill);
    }
  }, []);

  // 1. Send OTP Handler
  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await sendOtp(phone, 'CLIENT');
      setOtpSent(true);
      setResendTimer(30);
      const activeCode = res.demoOtp || res.otp || '108108';
      setReceivedOtp(activeCode);
      setSuccessMsg(res.message || `सत्यापन कोड (OTP) +91 ${phone} के लिए तैयार है।`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shraddhasetu_live_sms', {
          detail: { phone, otp: activeCode, role: 'CLIENT' }
        }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP भेजने में त्रुटि हुई। कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Login Handler
  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await loginWithOtp({
        phone,
        otp: otp || receivedOtp,
        role: 'CLIENT',
        name: devoteeName,
      });
      setSuccessMsg(res.message || 'नमस्ते! यजमान पोर्टल में आपका स्वागत है।');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'अमान्य OTP कोड। कृपया 108108 दर्ज करें।');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login Handler
  const handleDevoteePasswordLogin = async (e, customEmail = null, customPass = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmail = customEmail || loginEmail;
    const targetPass = customPass || loginPassword;

    try {
      const res = await login(targetEmail, targetPass, 'CLIENT');
      setSuccessMsg(res.message || 'Namaste! Welcome back to ShraddhaSetu.');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Quick 1-Click Access
  const handleQuickDevoteeLogin = () => {
    setPhone('9876543210');
    setOtp('108108');
    handleVerifyOtp(null);
  };

  // 5. Register Handler
  const handleDevoteeRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await register({
        ...regData,
        role: 'CLIENT',
      });
      setSuccessMsg('Devotee account created successfully! Opening your portal...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check form fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dedicated-portal-auth-card devotee-auth-card">
      <div className="portal-badge-banner devotee-theme-badge">
        <span className="portal-crest-icon">🙏</span>
        <div className="badge-text">
          <h3>यजमान / भक्त प्रवेश द्वार</h3>
          <p>Book Authentic Pujas, Consult Pandits &amp; Order Pure Samagri</p>
        </div>
      </div>

      <div className="portal-auth-header">
        <h2>{mode === 'login' ? 'Devotee Sign In' : 'Create Devotee Account'}</h2>
        <p className="auth-instructions">
          {mode === 'login'
            ? 'Sign in to access your booked pujas, view certified Pandit details, download Sankalp receipts, and check Muhurats.'
            : 'Register for free to book Vedic pujas at your home, temple, or online with 100% verified Vedic Acharyas.'}
        </p>
      </div>

      {/* QUICK 1-CLICK DEMO LOGIN BUTTON */}
      {mode === 'login' && (
        <div className="quick-access-box devotee-quick-box">
          <div className="quick-info">
            <strong>⚡ Quick Devotee Access (1-Click OTP Login)</strong>
            <span>Direct instant access as Rameshwar Devotee (+91 98765 43210)</span>
          </div>
          <button
            type="button"
            className="btn-quick-login-devotee"
            onClick={handleQuickDevoteeLogin}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In as Rameshwar Devotee (1-Click)'}
          </button>
        </div>
      )}

      {/* MODE TOGGLE: SIGN IN VS CREATE ACCOUNT */}
      <div className="portal-mode-toggle">
        <button
          type="button"
          className={`toggle-tab ${mode === 'login' ? 'active-tab maroon-active' : ''}`}
          onClick={() => { setMode('login'); setErrorMsg(''); }}
        >
          Sign In (लॉगिन)
        </button>
        <button
          type="button"
          className={`toggle-tab ${mode === 'register' ? 'active-tab maroon-active' : ''}`}
          onClick={() => { setMode('register'); setErrorMsg(''); }}
        >
          Create New Account (नया खाता)
        </button>
      </div>

      {/* LOGIN METHOD SWITCHER: MOBILE OTP VS PASSWORD */}
      {mode === 'login' && (
        <div className="auth-sub-method-switcher">
          <button
            type="button"
            className={`sub-method-btn ${loginMethod === 'otp' ? 'active-sub-method' : ''}`}
            onClick={() => { setLoginMethod('otp'); setErrorMsg(''); }}
          >
            <span>📱</span> Mobile OTP Login (ओटीपी लॉगिन)
          </button>
          <button
            type="button"
            className={`sub-method-btn ${loginMethod === 'password' ? 'active-sub-method' : ''}`}
            onClick={() => { setLoginMethod('password'); setErrorMsg(''); }}
          >
            <span>🔑</span> Email &amp; Password
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="portal-alert portal-alert-error">
          <span>⚠️</span> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="portal-alert portal-alert-success">
          <span>✓</span> {successMsg}
        </div>
      )}

      {/* --- FORM SECTION --- */}
      {mode === 'login' && loginMethod === 'otp' && (
        <div className="otp-login-container">
          {!otpSent ? (
            /* STEP 1: ENTER PHONE NUMBER */
            <form onSubmit={handleSendOtp} className="dedicated-portal-form">
              <div className="portal-form-group">
                <label>10-Digit Mobile Number (मोबाइल नंबर) *</label>
                <div className="phone-input-addon">
                  <span className="country-code-pill">🇮🇳 +91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    autoFocus
                  />
                </div>
                <small className="field-hint">
                  A 6-digit Vedic verification code (OTP) will be sent. Demo number: <code>9876543210</code>
                </small>
              </div>

              <button type="submit" className="btn-portal-submit devotee-submit-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : '📲 Get OTP on Mobile (ओटीपी प्राप्त करें)'}
              </button>
            </form>
          ) : (
            /* STEP 2: ENTER OTP CODE */
            <form onSubmit={handleVerifyOtp} className="dedicated-portal-form">
              <div className="otp-sent-banner">
                <span>OTP sent to: <strong>+91 {phone}</strong></span>
                <button
                  type="button"
                  className="btn-change-phone"
                  onClick={() => { setOtpSent(false); setOtp(''); }}
                >
                  Edit / बदलें
                </button>
              </div>

              <div className="otp-instant-callout">
                <div className="otp-code-highlight">
                  <div className="otp-code-meta">
                    <span className="otp-badge-tag">🔒 LIVE OTP CODE</span>
                    <strong className="otp-number-display">{receivedOtp}</strong>
                  </div>
                  <button
                    type="button"
                    className="btn-quick-fill-otp"
                    onClick={() => setOtp(receivedOtp)}
                  >
                    ⚡ 1-Click Auto Fill
                  </button>
                </div>
                <div className="otp-telecom-notice">
                  <span>📱 Phone SIM SMS Notice:</span>
                  <p>
                    Physical phone SIM par real SMS aane ke liye telecom gateway (Fast2SMS / Twilio API Key) Render me add karein. Turant login ke liye upar diya gaya code <strong>{receivedOtp}</strong> enter karein ya <strong>Auto Fill</strong> dabayein!
                  </p>
                </div>
              </div>

              <div className="portal-form-group">
                <label>Enter 6-Digit Verification Code (ओटीपी कोड) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="108108"
                  className="otp-digits-input"
                  autoFocus
                />
                <div className="otp-helper-row">
                  <span className="demo-code-pill">Demo OTP: <strong>108108</strong></span>
                  {resendTimer > 0 ? (
                    <span className="resend-countdown">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      className="btn-resend-link"
                      onClick={handleSendOtp}
                      disabled={loading}
                    >
                      Resend OTP (पुनः भेजें)
                    </button>
                  )}
                </div>
              </div>

              <div className="portal-form-group">
                <label>Your Name (वैकल्पिक / Optional for new users)</label>
                <input
                  type="text"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  placeholder="उदा: Rameshwar Sharma"
                />
              </div>

              <button type="submit" className="btn-portal-submit devotee-submit-btn" disabled={loading}>
                {loading ? 'Verifying...' : '✅ Verify & Enter Yajman Portal (सत्यापित करें)'}
              </button>
            </form>
          )}
        </div>
      )}

      {mode === 'login' && loginMethod === 'password' && (
        <form onSubmit={(e) => handleDevoteePasswordLogin(e)} className="dedicated-portal-form">
          <div className="portal-form-group">
            <label>Registered Email or Phone (ईमेल या फ़ोन नंबर)</label>
            <input
              type="text"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="devotee@shraddhasetu.com"
            />
          </div>

          <div className="portal-form-group">
            <label>Password (पासवर्ड)</label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-portal-submit devotee-submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : '🙏 Sign In with Password'}
          </button>
        </form>
      )}

      {mode === 'register' && (
        <form onSubmit={handleDevoteeRegister} className="dedicated-portal-form">
          <div className="portal-form-group">
            <label>Full Name (पूरा नाम) *</label>
            <input
              type="text"
              required
              value={regData.name}
              onChange={(e) => setRegData({ ...regData, name: e.target.value })}
              placeholder="उदा: Rameshwar Sharma"
            />
          </div>

          <div className="portal-form-row">
            <div className="portal-form-group">
              <label>Phone Number (फ़ोन नंबर) *</label>
              <input
                type="tel"
                required
                value={regData.phone}
                onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="portal-form-group">
              <label>Operating City (शहर / नगर) *</label>
              <input
                type="text"
                required
                value={regData.city}
                onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                placeholder="Varanasi, Delhi, Bengaluru..."
              />
            </div>
          </div>

          <div className="portal-form-group">
            <label>Email Address (ईमेल) *</label>
            <input
              type="email"
              required
              value={regData.email}
              onChange={(e) => setRegData({ ...regData, email: e.target.value })}
              placeholder="name@email.com"
            />
          </div>

          <div className="portal-form-group">
            <label>Create Password (पासवर्ड बनाएँ) *</label>
            <input
              type="password"
              required
              value={regData.password}
              onChange={(e) => setRegData({ ...regData, password: e.target.value })}
              placeholder="न्यूनतम 6 अक्षर"
            />
          </div>

          <button type="submit" className="btn-portal-submit devotee-submit-btn" disabled={loading}>
            {loading ? 'Creating Devotee Account...' : '✨ Create Free Devotee Account'}
          </button>
        </form>
      )}

      <div className="portal-footer-links">
        <div className="switch-portal-line">
          <span>Other Portals</span>
        </div>
        <div className="switch-buttons-row">
          <Link href="/portal/pandit" className="switch-portal-btn">
            <span>🕉️</span> Pandit / Acharya Portal
          </Link>
          <Link href="/portal/admin" className="switch-portal-btn">
            <span>🏛️</span> Mandir Admin Console
          </Link>
        </div>
        <div className="back-home-wrap">
          <Link href="/" className="portal-back-home-link">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
