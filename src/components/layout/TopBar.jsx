'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function TopBar({ onOpenAuth }) {
  const router = useRouter();
  const { user } = useAuth();

  const handlePortalClick = (targetRole, path) => {
    if (user && user.role === targetRole) {
      router.push(path);
    } else {
      const roleName = targetRole === 'PANDIT' ? 'Vedic Pandit' : (targetRole === 'ADMIN' ? 'Mandir Admin' : 'Devotee');
      if (onOpenAuth) {
        onOpenAuth(targetRole, `Please sign in to access the ${roleName} portal.`, path);
      } else {
        router.push(path);
      }
    }
  };

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
          <button
            type="button"
            className="portal-pill pill-devotee"
            onClick={() => handlePortalClick('CLIENT', '/dashboard/devotee')}
            title="Yajman Devotee Portal"
          >
            🙏 Devotee
          </button>
          <button
            type="button"
            className="portal-pill pill-pandit"
            onClick={() => handlePortalClick('PANDIT', '/dashboard/pandit')}
            title="Vedic Acharya Portal"
          >
            🕉️ Pandit Ji
          </button>
          <button
            type="button"
            className="portal-pill pill-admin"
            onClick={() => handlePortalClick('ADMIN', '/dashboard/admin')}
            title="Mandir Samiti Admin Console"
          >
            🏛️ Admin
          </button>
        </div>
      </div>
    </div>
  );
}
