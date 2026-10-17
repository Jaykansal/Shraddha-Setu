'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PanditLoginForm({ redirectUrl = '/dashboard/pandit' }) {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
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

  const handlePanditLogin = async (e, customEmail = null, customPass = null) => {
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

  const handleQuickPanditLogin = () => {
    setLoginEmail('pandit@shraddhasetu.com');
    setLoginPassword('password123');
    handlePanditLogin(null, 'pandit@shraddhasetu.com', 'password123');
  };

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
            <strong>⚡ Quick Acharya Access</strong>
            <span>One-click test access as Acharya Vidyadhar Shastri</span>
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

      {/* TAB SWITCHER */}
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

      {mode === 'login' ? (
        <form onSubmit={(e) => handlePanditLogin(e)} className="dedicated-portal-form">
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
            {loading ? 'Verifying Acharya Credentials...' : '🕉️ Sign In to Acharya Desk'}
          </button>
        </form>
      ) : (
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
