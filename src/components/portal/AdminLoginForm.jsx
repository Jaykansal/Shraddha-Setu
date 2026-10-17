'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginForm({ redirectUrl = '/dashboard/admin' }) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@shraddhasetu.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAdminLogin = async (e, customEmail = null, customPass = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    try {
      const res = await login(targetEmail, targetPass, 'ADMIN');
      setSuccessMsg(res.message || 'Admin authentication successful! Redirecting...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Administrative authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('admin@shraddhasetu.com');
    setPassword('password123');
    handleAdminLogin(null, 'admin@shraddhasetu.com', 'password123');
  };

  return (
    <div className="dedicated-portal-auth-card admin-auth-card">
      <div className="portal-badge-banner admin-theme-badge">
        <span className="portal-crest-icon">🏛️</span>
        <div className="badge-text">
          <h3>श्री श्रद्धासेतु मंदिर समिति</h3>
          <p>Pan-India Central Operations &amp; Pandit Verification Desk</p>
        </div>
      </div>

      <div className="portal-auth-header">
        <h2>Admin Console Sign In</h2>
        <p className="auth-instructions">
          Authorized personnel only. Manage Gurukul certifications, nationwide Puja assignments, and Dakshina governance.
        </p>
      </div>

      {/* QUICK 1-CLICK DEMO LOGIN BUTTON */}
      <div className="quick-access-box admin-quick-box">
        <div className="quick-info">
          <strong>⚡ Quick Administrator Access</strong>
          <span>One-click test access with central admin credentials</span>
        </div>
        <button
          type="button"
          className="btn-quick-login-admin"
          onClick={handleQuickAdminLogin}
          disabled={loading}
        >
          {loading ? 'Authenticating Admin...' : 'Sign In as Master Admin (1-Click)'}
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

      <form onSubmit={(e) => handleAdminLogin(e)} className="dedicated-portal-form">
        <div className="portal-form-group">
          <label>Admin Registered Email (प्रशासक ईमेल)</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@shraddhasetu.com"
          />
        </div>

        <div className="portal-form-group">
          <label>Security Password (सुरक्षा पासवर्ड)</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-portal-submit admin-submit-btn" disabled={loading}>
          {loading ? 'Verifying Admin Clearance...' : '🔐 Sign In to Admin Console'}
        </button>
      </form>

      <div className="portal-footer-links">
        <div className="switch-portal-line">
          <span>Not an Administrator?</span>
        </div>
        <div className="switch-buttons-row">
          <Link href="/portal/pandit" className="switch-portal-btn">
            <span>🕉️</span> Pandit / Acharya Portal
          </Link>
          <Link href="/portal/devotee" className="switch-portal-btn">
            <span>🙏</span> Devotee / Yajman Portal
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
