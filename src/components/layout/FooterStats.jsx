import { SITE_CONFIG } from '@/data/siteConfig';

export default function FooterStats() {
  return (
    <div className="footer-stats-bar">
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <div className="stat-text">
            <span className="stat-number">{SITE_CONFIG.devoteesCount}</span>
            <span className="stat-label">Happy Devotees</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div className="stat-text">
            <span className="stat-number">{SITE_CONFIG.panditsCount}</span>
            <span className="stat-label">Verified Pandits</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2C10.5 4.5 9 8 9 11c0 2.2 1.3 4 3 4s3-1.8 3-4c0-3-1.5-6.5-3-9zm-4.5 9.5C6.4 9 4.5 8 3 8c.5 3 2.5 5.5 5 6.5-.5-1-1-2-1-3zm9 0c0 1-.5 2-1 3 2.5-1 4.5-3.5 5-6.5-1.5 0-3.4 1-4.5 3.5zM12 17c-2.5 0-5 1-7 3 2.5 1.5 5.5 2 7 2s4.5-.5 7-2c-2-2-4.5-3-7-3z"/></svg>
          </div>
          <div className="stat-text">
            <span className="stat-number">{SITE_CONFIG.poojasCount}</span>
            <span className="stat-label">Poojas Completed</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 9h3v11h14V9h3L12 2zm0 4.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm5 12.5H7v-6h10v6z"/></svg>
          </div>
          <div className="stat-text">
            <span className="stat-number">{SITE_CONFIG.citiesCovered}</span>
            <span className="stat-label">Cities Covered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
