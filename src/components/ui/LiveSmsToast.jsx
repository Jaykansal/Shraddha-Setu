'use client';

import { useState, useEffect } from 'react';

export default function LiveSmsToast() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleSmsEvent = (e) => {
      if (e && e.detail) {
        setNotification({
          phone: e.detail.phone || '9876543210',
          otp: e.detail.otp || '108108',
          role: e.detail.role || 'CLIENT',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('shraddhasetu_live_sms', handleSmsEvent);
      return () => window.removeEventListener('shraddhasetu_live_sms', handleSmsEvent);
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  const handleAutoFill = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shraddhasetu_autofill_otp', {
        detail: { otp: notification.otp }
      }));
    }
    setNotification(null);
  };

  return (
    <aside aria-label="Live SMS Notification" className="live-sms-toast-container">
      <div className="live-sms-card">
        <div className="sms-header">
          <div className="sms-sender-info">
            <span className="sms-app-icon">💬</span>
            <span className="sms-app-name">MESSAGES • SHRADDHA-SETU</span>
            <span className="sms-time-badge">{notification.timestamp}</span>
          </div>
          <button
            type="button"
            className="sms-close-btn"
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>

        <div className="sms-body">
          <p className="sms-text">
            <strong>ShraddhaSetu Security:</strong> {notification.otp} is your live OTP to sign in to your {notification.role === 'PANDIT' ? 'Vedic Acharya' : 'Devotee'} Portal for mobile +91 {notification.phone}. Valid for 10 mins.
          </p>
        </div>

        <div className="sms-actions">
          <button
            type="button"
            className="btn-sms-autofill"
            onClick={handleAutoFill}
          >
            <span>⚡ Auto-Fill Code ({notification.otp})</span>
          </button>
          <span className="sms-live-badge">🟢 Real-Time SMS Delivered</span>
        </div>
      </div>
    </aside>
  );
}
