'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal({
  isOpen,
  initialRole = 'CLIENT',
  reason = '',
  redirectUrl = '',
  onClose,
  onSuccess
}) {
  const router = useRouter();
  const { login, register, sendOtp, loginWithOtp } = useAuth();

  const [role, setRole] = useState(initialRole); // 'CLIENT', 'PANDIT', 'ADMIN'
  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP State
  const [otpPhone, setOtpPhone] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [receivedOtp, setReceivedOtp] = useState('108108');

  useEffect(() => {
    if (isOpen && initialRole) {
      setRole(initialRole);
      setErrorMsg('');
      setSuccessMsg('');
      setOtpSent(false);
      setOtpCode('');
      if (initialRole === 'ADMIN') {
        setLoginMethod('password');
      } else if (initialRole === 'PANDIT') {
        setOtpPhone('9823456789');
      } else {
        setOtpPhone('9876543210');
      }
    }
  }, [initialRole, isOpen]);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Varanasi',
    gurukul: '',
    specialization: '',
    experience: 5,
  });

  if (!isOpen) return null;

  const handleRedirect = (targetRole) => {
    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }
    if (targetRole === 'PANDIT') {
      router.push('/dashboard/pandit');
    } else if (targetRole === 'ADMIN') {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard/devotee');
    }
  };

  useEffect(() => {
    const handleAutofill = (e) => {
      if (e && e.detail && e.detail.otp) {
        setOtpCode(e.detail.otp);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('shraddhasetu_autofill_otp', handleAutofill);
      return () => window.removeEventListener('shraddhasetu_autofill_otp', handleAutofill);
    }
  }, []);

  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendOtp(otpPhone, role);
      setOtpSent(true);
      setResendTimer(30);
      const activeCode = res.demoOtp || res.otp || '108108';
      setReceivedOtp(activeCode);
      setSuccessMsg(res.message || `सत्यापन कोड (OTP) +91 ${otpPhone} के लिए तैयार है।`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shraddhasetu_live_sms', {
          detail: { phone: otpPhone, otp: activeCode, role }
        }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP भेजने में त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await loginWithOtp({
        phone: otpPhone,
        otp: otpCode || receivedOtp,
        role,
        name: formData.name,
      });
      setSuccessMsg(res.message || 'सत्यापन सफल रहा!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess(res.user);
        handleRedirect(role);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'अमान्य OTP कोड। कृपया 108108 दर्ज करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let res;
      if (isRegister) {
        res = await register({
          ...formData,
          role,
        });
      } else {
        res = await login(formData.email, formData.password, role);
      }

      setSuccessMsg(res.message || 'Authentication successful!');

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess(res.user);
        handleRedirect(role);
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-x" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* PROMPT BANNER FOR GATED FEATURES */}
        {reason && (
          <div className="auth-reason-banner">
            <span className="reason-icon">🕉️</span>
            <div className="reason-content">
              <strong>पवित्र वैदिक सुविधा (Protected Vedic Feature)</strong>
              <p>{reason}</p>
            </div>
          </div>
        )}

        {/* 3-WAY SEGMENTED ROLE SELECTOR */}
        <div className="auth-role-tabs-three">
          <button
            type="button"
            className={`auth-role-tab ${role === 'CLIENT' ? 'active-client' : ''}`}
            onClick={() => {
              setRole('CLIENT');
              setErrorMsg('');
              setOtpPhone('9876543210');
              setOtpSent(false);
            }}
          >
            <span>🙏</span> Devotee / Yajman
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'PANDIT' ? 'active-pandit' : ''}`}
            onClick={() => {
              setRole('PANDIT');
              setErrorMsg('');
              setOtpPhone('9823456789');
              setOtpSent(false);
            }}
          >
            <span>🕉️</span> Pandit Ji / Acharya
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'ADMIN' ? 'active-admin' : ''}`}
            onClick={() => {
              setRole('ADMIN');
              setErrorMsg('');
              setIsRegister(false);
              setLoginMethod('password');
            }}
          >
            <span>🏛️</span> Mandir Admin
          </button>
        </div>

        {/* ROLE CONTEXT HEADER */}
        <div className="auth-header">
          <h3>
            {role === 'CLIENT' && (isRegister ? 'Register as Devotee / Yajman' : 'Devotee Sign In')}
            {role === 'PANDIT' && (isRegister ? 'Vedic Pandit Acharya Registration' : 'Pandit Ji Sign In')}
            {role === 'ADMIN' && 'Mandir Samiti Admin Console'}
          </h3>
          <p>
            {role === 'CLIENT' && 'Book pujas, consult assigned Acharya, choose Pure Samagri Kit, and view Daily Panchang.'}
            {role === 'PANDIT' && 'Accept local puja requests, confirm muhurat, and manage your Dakshina payouts.'}
            {role === 'ADMIN' && 'Authorized personnel only: Pandit verification desk & nationwide operations monitor.'}
          </p>
        </div>

        {/* SIGN IN VS REGISTER TOGGLE (NOT FOR ADMIN) */}
        {role !== 'ADMIN' && (
          <div className="auth-mode-switch">
            <button
              type="button"
              className={`mode-btn ${!isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(false); setErrorMsg(''); }}
            >
              Sign In (लॉगिन)
            </button>
            <button
              type="button"
              className={`mode-btn ${isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(true); setErrorMsg(''); }}
            >
              Create Account (नया खाता बनाएँ)
            </button>
          </div>
        )}

        {/* SUB-METHOD: OTP VS PASSWORD (WHEN IN SIGN-IN FOR CLIENT/PANDIT) */}
        {!isRegister && role !== 'ADMIN' && (
          <div className="auth-sub-method-switcher modal-sub-switcher">
            <button
              type="button"
              className={`sub-method-btn ${loginMethod === 'otp' ? 'active-sub-method' : ''}`}
              onClick={() => { setLoginMethod('otp'); setErrorMsg(''); }}
            >
              <span>📱</span> Mobile OTP
            </button>
            <button
              type="button"
              className={`sub-method-btn ${loginMethod === 'password' ? 'active-sub-method' : ''}`}
              onClick={() => { setLoginMethod('password'); setErrorMsg(''); }}
            >
              <span>🔑</span> Password
            </button>
          </div>
        )}

        {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

        {/* OTP SIGN IN FORM */}
        {!isRegister && role !== 'ADMIN' && loginMethod === 'otp' ? (
          <div className="modal-otp-form-wrap">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="form-group">
                  <label>10-Digit Mobile Number (मोबाइल नंबर) *</label>
                  <div className="phone-input-addon">
                    <span className="country-code-pill">🇮🇳 +91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder={role === 'PANDIT' ? '9823456789' : '9876543210'}
                      autoFocus
                    />
                  </div>
                  <small className="field-hint">
                    Demo {role === 'PANDIT' ? 'Acharya' : 'Devotee'} Phone: <code>{role === 'PANDIT' ? '9823456789' : '9876543210'}</code> (OTP: <code>108108</code>)
                  </small>
                </div>

                <button type="submit" className="btn-auth-submit" disabled={loading}>
                  {loading ? 'Sending OTP...' : '📲 Get OTP on Mobile (ओटीपी प्राप्त करें)'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div className="otp-sent-banner">
                  <span>OTP sent to: <strong>+91 {otpPhone}</strong></span>
                  <button
                    type="button"
                    className="btn-change-phone"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
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
                      onClick={() => setOtpCode(receivedOtp)}
                    >
                      ⚡ Auto Fill
                    </button>
                  </div>
                  <div className="otp-telecom-notice">
                    <span>📱 Physical SIM SMS:</span>
                    <p>
                      Phone SIM par real SMS ke liye Fast2SMS/Twilio API Key Render me dalein. Turant login ke liye upar diya code <strong>{receivedOtp}</strong> dalein ya <strong>Auto Fill</strong> dabayein.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Enter 6-Digit Code (ओटीपी कोड) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
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
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-auth-submit" disabled={loading}>
                  {loading ? 'Verifying...' : '✅ Verify & Sign In (सत्यापित करें)'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* STANDARD FORM */
          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="form-group">
                <label>Full Name (पूरा नाम) *</label>
                <input
                  type="text"
                  required
                  placeholder={role === 'PANDIT' ? 'Acharya Vidyadhar Shastri' : 'Rameshwar Devotee'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address (ईमेल) *</label>
              <input
                type="email"
                required
                placeholder={role === 'PANDIT' ? 'pandit@shraddhasetu.com' : (role === 'ADMIN' ? 'admin@shraddhasetu.com' : 'devotee@shraddhasetu.com')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label>Mobile Number (मोबाइल / WhatsApp नंबर) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            )}

            <div className="form-group">
              <label>Password (पासवर्ड) *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label>City / Location (नगर / शहर) *</label>
                <input
                  type="text"
                  required
                  placeholder="Varanasi, Delhi, Mumbai, Ayodhya, Haridwar..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              {role === 'PANDIT' && (
                <>
                  <div className="form-group">
                    <label>Vedic Gurukul / Vidyapeeth (गुरुकुल / वेद विद्यालय) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Sampurnanand Sanskrit University, Kashi Math..."
                      value={formData.gurukul}
                      onChange={(e) => setFormData({ ...formData, gurukul: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Vedic Specialization (विशेषज्ञता) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Navagraha Shanti, Rudrabhishek, Griha Pravesh, Havan"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Years of Shastra Experience (अनुभव वर्ष) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={60}
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Verifying Credentials...' : (isRegister ? 'Complete Registration' : 'Sign In to Portal')}
          </button>
        </form>
      )}

        {/* DEFAULT ACCOUNTS HINT FOR VERIFICATION */}
        <div className="auth-account-hint">
          <span className="hint-label">Pre-seeded Accounts (Password: <code>password123</code>):</span>
          <div className="hint-grid">
            <span>Devotee: <code>devotee@shraddhasetu.com</code></span>
            <span>Pandit: <code>pandit@shraddhasetu.com</code></span>
            <span>Admin: <code>admin@shraddhasetu.com</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}
