'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal({ isOpen, initialRole = 'CLIENT', onClose, onSuccess }) {
  const router = useRouter();
  const { login, register } = useAuth();

  const [role, setRole] = useState(initialRole); // 'CLIENT', 'PANDIT', 'ADMIN'
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Varanasi',
    gurukul: 'Sampurnanand Sanskrit University, Varanasi',
    specialization: 'Navagraha Shanti, Rudrabhishek & Griha Pravesh',
    experience: 12,
  });

  if (!isOpen) return null;

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

        // Redirect directly to corresponding dedicated portal!
        if (role === 'PANDIT') {
          router.push('/dashboard/pandit');
        } else if (role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/devotee');
        }
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Quick Demo Login for instant testing without typing
  const handleQuickDemo = async (targetRole) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setRole(targetRole);

    let email = 'devotee@shraddhasetu.com';
    if (targetRole === 'PANDIT') email = 'pandit@shraddhasetu.com';
    if (targetRole === 'ADMIN') email = 'admin@shraddhasetu.com';

    try {
      const res = await login(email, 'shree108', targetRole);
      setSuccessMsg(`Welcome to ${targetRole} Portal! Redirecting...`);
      setTimeout(() => {
        onClose();
        if (targetRole === 'PANDIT') router.push('/dashboard/pandit');
        else if (targetRole === 'ADMIN') router.push('/dashboard/admin');
        else router.push('/dashboard/devotee');
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
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

        {/* 3-WAY PORTAL TABS */}
        <div className="auth-role-tabs-three">
          <button
            type="button"
            className={`auth-role-tab ${role === 'CLIENT' ? 'active-client' : ''}`}
            onClick={() => { setRole('CLIENT'); setErrorMsg(''); setIsRegister(false); }}
          >
            <span>🙏</span> Devotee / Yajman
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'PANDIT' ? 'active-pandit' : ''}`}
            onClick={() => { setRole('PANDIT'); setErrorMsg(''); setIsRegister(false); }}
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

        {/* HEADER */}
        <div className="auth-header">
          <h3>
            {role === 'CLIENT' && 'Devotee / Yajman Portal'}
            {role === 'PANDIT' && 'Vedic Pandit & Acharya Portal'}
            {role === 'ADMIN' && 'Mandir Samiti & Platform Admin'}
          </h3>
          <p>
            {role === 'CLIENT' && 'Book pujas at home, choose with/without samagri, track assigned pandit & live muhurat.'}
            {role === 'PANDIT' && 'Accept local puja requests, schedule Vedic muhurats, and manage Dakshina payouts.'}
            {role === 'ADMIN' && 'Approve verified Gurukul pandits, manage nationwide ceremonies, and monitor platform activity.'}
          </p>
        </div>

        {/* QUICK DEMO BUTTONS */}
        <div className="quick-demo-banner">
          <span className="demo-label">⚡ Quick 1-Click Access:</span>
          <div className="demo-btns-row">
            <button
              type="button"
              className="demo-btn demo-btn-devotee"
              onClick={() => handleQuickDemo('CLIENT')}
              disabled={loading}
            >
              Demo Devotee
            </button>
            <button
              type="button"
              className="demo-btn demo-btn-pandit"
              onClick={() => handleQuickDemo('PANDIT')}
              disabled={loading}
            >
              Demo Pandit Ji
            </button>
            <button
              type="button"
              className="demo-btn demo-btn-admin"
              onClick={() => handleQuickDemo('ADMIN')}
              disabled={loading}
            >
              Demo Admin
            </button>
          </div>
        </div>

        {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                placeholder={role === 'PANDIT' ? 'Pt. Acharya Ramendra Sharma' : 'Rameshwar Devotee'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
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
              <label>WhatsApp / Mobile Number *</label>
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
            <label>Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Operating City / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Varanasi, Delhi NCR, Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          )}

          {/* PANDIT SPECIAL FIELDS ON REGISTRATION */}
          {isRegister && role === 'PANDIT' && (
            <>
              <div className="form-group">
                <label>Gurukul / Veda Vidyapeeth Lineage *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sampurnanand Sanskrit University, Varanasi"
                  value={formData.gurukul}
                  onChange={(e) => setFormData({ ...formData, gurukul: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Vedic Specialization & Shastra</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option value="Navagraha Shanti, Rudrabhishek & Griha Pravesh">Navagraha Shanti, Rudrabhishek & Griha Pravesh</option>
                  <option value="Karmakand, Havan & Vedic Anushthan">Karmakand, Havan & Vedic Anushthan</option>
                  <option value="Maha Mrityunjaya Jaap & Vastu Shanti">Maha Mrityunjaya Jaap & Vastu Shanti</option>
                  <option value="Satyanarayan Katha & Chandi Path">Satyanarayan Katha & Chandi Path</option>
                  <option value="Vivah Sanskar & Ayush Havan">Vivah Sanskar & Ayush Havan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience (Years of Karmakand Practice)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`btn-auth-submit btn-portal-${role.toLowerCase()}`}
            disabled={loading}
          >
            {loading ? 'Verifying Sacred Access...' : (
              isRegister
                ? (role === 'PANDIT' ? 'Register as Certified Pandit' : 'Create Devotee Account')
                : `Login to ${role === 'CLIENT' ? 'Devotee' : (role === 'PANDIT' ? 'Pandit' : 'Admin')} Portal`
            )}
          </button>
        </form>

        {role !== 'ADMIN' && (
          <div className="auth-footer-toggle">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setIsRegister(false)}>
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to ShraddhaSetu?{' '}
                <button type="button" onClick={() => setIsRegister(true)}>
                  {role === 'PANDIT' ? 'Join as Vedic Pandit' : 'Create Free Account'}
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
