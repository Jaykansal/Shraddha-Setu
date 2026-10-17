'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DevoteeLoginForm({ redirectUrl = '/dashboard/devotee' }) {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
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

  const handleDevoteeLogin = async (e, customEmail = null, customPass = null) => {
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

  const handleQuickDevoteeLogin = () => {
    setLoginEmail('devotee@shraddhasetu.com');
    setLoginPassword('password123');
    handleDevoteeLogin(null, 'devotee@shraddhasetu.com', 'password123');
  };

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
            <strong>⚡ Quick Devotee Access</strong>
            <span>One-click test access as Rameshwar Devotee</span>
          </div>
          <button
            type="button"
            className="btn-quick-login-devotee"
            onClick={handleQuickDevoteeLogin}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In as Rameshwar Devotee (1-Click)'}
          </button>
        </div>
      )}

      {/* TAB SWITCHER */}
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
        <form onSubmit={(e) => handleDevoteeLogin(e)} className="dedicated-portal-form">
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
            {loading ? 'Signing In...' : '🙏 Sign In to Yajman Portal'}
          </button>
        </form>
      ) : (
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
