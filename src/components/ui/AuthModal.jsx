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
  const { login, register } = useAuth();

  const [role, setRole] = useState(initialRole); // 'CLIENT', 'PANDIT', 'ADMIN'
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && initialRole) {
      setRole(initialRole);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [initialRole, isOpen]);

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
            onClick={() => { setRole('CLIENT'); setErrorMsg(''); }}
          >
            <span>🙏</span> Devotee / Yajman
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'PANDIT' ? 'active-pandit' : ''}`}
            onClick={() => { setRole('PANDIT'); setErrorMsg(''); }}
          >
            <span>🕉️</span> Pandit Ji / Acharya
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'ADMIN' ? 'active-admin' : ''}`}
            onClick={() => { setRole('ADMIN'); setErrorMsg(''); setIsRegister(false); }}
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

        {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

        {/* REAL AUTHENTICATION FORM */}
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
