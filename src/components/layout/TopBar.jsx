'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function TopBar() {
  const { user } = useAuth();
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="muhurat-badge live-pulse-badge">
          <span className="live-dot-pulse"></span>
          LIVE VEDIC CLOCK: {liveTime || '11:42:08 AM'}
        </span>
        <span className="muhurat-time">Abhijit Muhurat: 11:42 AM - 12:28 PM • Ravi Yoga Active</span>
      </div>

      <div className="top-bar-right">
        <div className="top-bar-helpline">
          <span>📞 Vedic Helpline:</span>
          <a href="tel:+911234567890">+91 12345 67890</a>
        </div>

        <div className="portal-quick-links">
          <Link
            href={user?.role === 'CLIENT' ? '/dashboard/devotee' : '/portal/devotee'}
            className="portal-pill pill-devotee"
            title="Yajman Devotee Portal"
          >
            🙏 Devotee Portal
          </Link>
          <Link
            href={user?.role === 'PANDIT' ? '/dashboard/pandit' : '/portal/pandit'}
            className="portal-pill pill-pandit"
            title="Vedic Acharya Portal"
          >
            🕉️ Pandit Portal
          </Link>
          <Link
            href={user?.role === 'ADMIN' ? '/dashboard/admin' : '/portal/admin'}
            className="portal-pill pill-admin"
            title="Mandir Samiti Admin Console"
          >
            🏛️ Admin Console
          </Link>
        </div>
      </div>
    </div>
  );
}
