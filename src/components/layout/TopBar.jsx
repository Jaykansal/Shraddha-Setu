'use client';

import Link from 'next/link';

export default function TopBar({ onOpenAuth }) {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="muhurat-badge">🚩 Today's Auspicious Muhurat</span>
        <span className="muhurat-time">Abhijit Muhurat: 11:42 AM - 12:28 PM • Ravi Yoga Active</span>
      </div>

      <div className="top-bar-right">
        <div className="top-bar-helpline">
          <span>📞 Vedic Helpline:</span>
          <a href="tel:+911234567890">+91 12345 67890</a>
        </div>

        <div className="portal-quick-links">
          <Link href="/dashboard/devotee" className="portal-pill pill-devotee" title="Yajman Devotee Portal">
            🙏 Devotee
          </Link>
          <Link href="/dashboard/pandit" className="portal-pill pill-pandit" title="Vedic Acharya Portal">
            🕉️ Pandit Ji
          </Link>
          <Link href="/dashboard/admin" className="portal-pill pill-admin" title="Mandir Samiti Admin Console">
            🏛️ Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
