'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PanditLoginForm({ redirectUrl = '/dashboard/pandit' }) {
  const router = useRouter();
  const { login, register, sendOtp, loginWithOtp } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Login state
  const [phone, setPhone] = useState('9823456789');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Password Login state
  const [loginEmail, setLoginEmail] = useState('pandit@shraddhasetu.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Varanasi',
    gurukul: 'Sampurnanand Sanskrit University, Varanasi',
    specialization: 'Navagraha Shanti & Rudrabhishek',
    experience: 10,
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
      const res = await sendOtp(phone, 'PANDIT');
      setOtpSent(true);
      setResendTimer(30);
      setSuccessMsg(res.message || `सत्यापन कोड (OTP) +91 ${phone} पर भेजा गया। (डेमो कोड: 108108)`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shraddhasetu_live_sms', {
          detail: { phone, otp: res.demoOtp || '108108', role: 'PANDIT' }
        }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'पंडित मोबाइल नंबर सत्यापन में त्रुटि। कृपया पंजीकृत मोबाइल नंबर दर्ज करें।');
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
        otp: otp || '108108',
        role: 'PANDIT',
      });
      setSuccessMsg(res.message || 'प्रणाम आचार्य जी! पंडित पोर्टल में आपका स्वागत है।');
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
  const handlePanditPasswordLogin = async (e, customEmail = null, customPass = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmail = customEmail || loginEmail;
    const targetPass = customPass || loginPassword;

    try {
      const res = await login(targetEmail, targetPass, 'PANDIT');
      setSuccessMsg(res.message || 'Pandit login successful! Opening Acharya Desk...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Pandit authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Quick 1-Click Access
  const handleQuickPanditLogin = () => {
    setPhone('9823456789');
    setOtp('108108');
    handleVerifyOtp(null);
  };

  // 5. Register Handler
  const handlePanditRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await register({
        ...regData,
        role: 'PANDIT',
      });
      setSuccessMsg('Acharya registration submitted successfully! Opening your portal...');
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
    <div className="dedicated-portal-auth-card pandit-auth-card">
      <div className="portal-badge-banner pandit-theme-badge">
        <span className="portal-crest-icon">🕉️</span>
        <div className="badge-text">
          <h3>वैदिक पंडित व आचार्य प्रवेश द्वार</h3>
          <p>Pan-India Gurukul Certified Acharya Network</p>
        </div>
      </div>

      <div className="portal-auth-header">
        <h2>{mode === 'login' ? 'Acharya Desk Sign In' : 'Vedic Acharya Registration'}</h2>
        <p className="auth-instructions">
          {mode === 'login'
            ? 'Sign in to accept confirmed puja requests in your city, manage Muhurat timings, and view Dakshina honorariums.'
            : 'Join ShraddhaSetu as a verified Vedic Pandit. Devotees nationwide book authenticated rituals through our network.'}
        </p>
      </div>

      {/* QUICK 1-CLICK DEMO LOGIN BUTTON */}
      {mode === 'login' && (
        <div className="quick-access-box pandit-quick-box">
          <div className="quick-info">
            <strong>⚡ Quick Acharya Access (1-Click OTP Login)</strong>
            <span>One-click test access as Acharya Vidyadhar Shastri (+91 98234 56789)</span>
          </div>
          <button
            type="button"
            className="btn-quick-login-pandit"
            onClick={handleQuickPanditLogin}
            disabled={loading}
          >
            {loading ? 'Authenticating Acharya...' : 'Sign In as Acharya Vidyadhar (1-Click)'}
          </button>
        </div>
      )}

      {/* TAB SWITCHER: SIGN IN VS REGISTER */}
      <div className="portal-mode-toggle">
        <button
          type="button"
          className={`toggle-tab ${mode === 'login' ? 'active-tab saffron-active' : ''}`}
          onClick={() => { setMode('login'); setErrorMsg(''); }}
        >
          Sign In (लॉगिन)
        </button>
        <button
          type="button"
          className={`toggle-tab ${mode === 'register' ? 'active-tab saffron-active' : ''}`}
          onClick={() => { setMode('register'); setErrorMsg(''); }}
        >
          New Acharya Registration (नया पंजीकरण)
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
                <label>Registered Pandit Mobile Number (पंजीकृत मोबाइल नंबर) *</label>
                <div className="phone-input-addon">
                  <span className="country-code-pill">🇮🇳 +91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9823456789"
                    autoFocus
                  />
                </div>
                <small className="field-hint">
                  Demo Acharya Phone: <code>9823456789</code> (Acharya Vidyadhar Shastri)
                </small>
              </div>

              <button type="submit" className="btn-portal-submit pandit-submit-btn" disabled={loading}>
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

              <button type="submit" className="btn-portal-submit pandit-submit-btn" disabled={loading}>
                {loading ? 'Verifying...' : '✅ Verify & Open Acharya Desk (सत्यापित करें)'}
              </button>
            </form>
          )}
        </div>
      )}

      {mode === 'login' && loginMethod === 'password' && (
        <form onSubmit={(e) => handlePanditPasswordLogin(e)} className="dedicated-portal-form">
          <div className="portal-form-group">
            <label>Registered Email / Phone (पंडित ईमेल या फ़ोन)</label>
            <input
              type="text"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="pandit@shraddhasetu.com"
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

          <button type="submit" className="btn-portal-submit pandit-submit-btn" disabled={loading}>
            {loading ? 'Verifying Acharya Credentials...' : '🕉️ Sign In with Password'}
          </button>
        </form>
      )}

      {mode === 'register' && (
        <form onSubmit={handlePanditRegister} className="dedicated-portal-form">
          <div className="portal-form-row">
            <div className="portal-form-group">
              <label>Full Vedic Name (पूरा नाम) *</label>
              <input
                type="text"
                required
                value={regData.name}
                onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                placeholder="उदा: Pt. Radheshyam Sharma"
              />
            </div>
            <div className="portal-form-group">
              <label>Operating City (कार्यरत शहर) *</label>
              <input
                type="text"
                required
                value={regData.city}
                onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                placeholder="Varanasi, Delhi, Jaipur..."
              />
            </div>
          </div>

          <div className="portal-form-row">
            <div className="portal-form-group">
              <label>Mobile Number (फ़ोन नंबर) *</label>
              <input
                type="tel"
                required
                value={regData.phone}
                onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="portal-form-group">
              <label>Email Address (ईमेल) *</label>
              <input
                type="email"
                required
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                placeholder="panditji@email.com"
              />
            </div>
          </div>

          <div className="portal-form-group">
            <label>Password (पासवर्ड बनाएँ) *</label>
            <input
              type="password"
              required
              value={regData.password}
              onChange={(e) => setRegData({ ...regData, password: e.target.value })}
              placeholder="न्यूनतम 6 अक्षर"
            />
          </div>

          <div className="portal-form-group">
            <label>Alma Mater / Gurukul (गुरुकुल या वेद संस्थान) *</label>
            <input
              type="text"
              required
              value={regData.gurukul}
              onChange={(e) => setRegData({ ...regData, gurukul: e.target.value })}
              placeholder="Sampurnanand Sanskrit Vishwavidyalaya, Kashi Math..."
            />
          </div>

          <div className="portal-form-row">
            <div className="portal-form-group">
              <label>Specialization (विशेषज्ञता) *</label>
              <input
                type="text"
                required
                value={regData.specialization}
                onChange={(e) => setRegData({ ...regData, specialization: e.target.value })}
                placeholder="Griha Pravesh, Rudrabhishek, Vastu"
              />
            </div>
            <div className="portal-form-group">
              <label>Years of Practice (अनुभव वर्ष) *</label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={regData.experience}
                onChange={(e) => setRegData({ ...regData, experience: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-portal-submit pandit-submit-btn" disabled={loading}>
            {loading ? 'Submitting Application...' : '📜 Complete Acharya Registration'}
          </button>
        </form>
      )}

      <div className="portal-footer-links">
        <div className="switch-portal-line">
          <span>Other Portals</span>
        </div>
        <div className="switch-buttons-row">
          <Link href="/portal/devotee" className="switch-portal-btn">
            <span>🙏</span> Devotee / Yajman Portal
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
