'use client';

import { useState } from 'react';

export default function AuthModal({ isOpen, initialRole = 'CLIENT', onClose, onSuccess }) {
  const [role, setRole] = useState(initialRole); // 'CLIENT' or 'PANDIT'
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Varanasi',
    gurukul: '',
    specialization: 'Navagraha & Havan',
    experience: 5,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister 
        ? {
            ...formData,
            role,
            panditDetails: role === 'PANDIT' ? {
              gurukul: formData.gurukul,
              specialization: formData.specialization,
              experience: Number(formData.experience),
            } : undefined
          }
        : {
            email: formData.email,
            password: formData.password,
            requestedRole: role,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setSuccessMsg(data.message);
      setTimeout(() => {
        onSuccess?.(data.user);
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-x" onClick={onClose}>✕</button>

        {/* ROLE SELECTOR TABS */}
        <div className="auth-role-tabs">
          <button 
            type="button"
            className={`auth-role-tab ${role === 'CLIENT' ? 'active client-tab' : ''}`}
            onClick={() => { setRole('CLIENT'); setErrorMsg(''); }}
          >
            <span>🙏</span> Devotee / यजमान
          </button>
          <button 
            type="button"
            className={`auth-role-tab ${role === 'PANDIT' ? 'active pandit-tab' : ''}`}
            onClick={() => { setRole('PANDIT'); setErrorMsg(''); }}
          >
            <span>🕉️</span> Pandit Ji / आचार्य Portal
          </button>
        </div>

        <div className="auth-header">
          <h3>
            {role === 'CLIENT' ? 'Devotee / Yajman Login' : 'Vedic Pandit & Acharya Portal'}
          </h3>
          <p>
            {role === 'CLIENT' 
              ? 'Book sacred rituals, track samagri, and access divine prasad videos.'
              : 'Accept pooja bookings in your area, manage muhurats, and track Dakshina.'}
          </p>
        </div>

        {errorMsg && <div className="auth-alert error-alert">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success-alert">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                required 
                placeholder={role === 'PANDIT' ? 'Pt. Ramendra Sharma' : 'Devotee Full Name'}
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
              placeholder={role === 'PANDIT' ? 'panditji@shraddhasetu.com' : 'devotee@example.com'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Mobile / WhatsApp Number *</label>
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

          {/* EXTRA PANDIT FIELDS ON REGISTRATION */}
          {isRegister && role === 'PANDIT' && (
            <>
              <div className="form-group">
                <label>Gurukul / Veda Vidyapeeth *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sampurnanand Sanskrit Vishwavidyalaya, Kashi"
                  value={formData.gurukul}
                  onChange={(e) => setFormData({ ...formData, gurukul: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Vedic Specialization</label>
                <select 
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option value="Karmakand & Havan">Karmakand & Havan</option>
                  <option value="Navagraha & Vastu Shanti">Navagraha & Vastu Shanti</option>
                  <option value="Maha Mrityunjaya & Rudrabhishek">Maha Mrityunjaya & Rudrabhishek</option>
                  <option value="Vivah & Sanskar Vidhi">Vivah & Sanskar Vidhi</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading 
              ? 'Verifying...' 
              : isRegister 
                ? (role === 'PANDIT' ? 'Register as Certified Pandit' : 'Create Devotee Account')
                : (role === 'PANDIT' ? 'Login to Pandit Dashboard' : 'Login to Devotee Account')}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {isRegister ? (
            <p>
              Already registered?{' '}
              <button type="button" onClick={() => setIsRegister(false)}>
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to ShraddhaSetu?{' '}
              <button type="button" onClick={() => setIsRegister(true)}>
                {role === 'PANDIT' ? 'Join as Verified Pandit' : 'Create Free Account'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
