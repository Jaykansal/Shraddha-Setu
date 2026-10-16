'use client';

import { VERIFIED_PANDITS } from '@/data/pandits';

export default function VerifiedPanditsSection({ onOpenPanditPortal }) {
  return (
    <section className="section-pandits" id="pandits">
      <div className="section-header-row">
        <div className="section-header-left">
          <h2 className="section-title">Gurukul Certified Vedic Scholars &amp; Acharyas</h2>
          <span className="section-sub-desc">
            500+ Verified Pandits from Kashi, Mathura, Haridwar, Ujjain and Tirupati trained in Rig, Sama, and Yajur Veda.
          </span>
        </div>
        <button
          type="button"
          className="btn-join-pandit"
          onClick={onOpenPanditPortal}
        >
          <span>🕉️</span> Join as Vedic Pandit
        </button>
      </div>

      <div className="pandits-grid">
        {VERIFIED_PANDITS.map((p) => (
          <div key={p.id} className="pandit-card">
            <div className="pandit-card-top">
              <div className="pandit-avatar-box">
                <span className="pandit-avatar-emoji">🕉️</span>
                <span className="pandit-verified-badge" title="Gurukul Certified">✓</span>
              </div>
              <div className="pandit-meta">
                <h4 className="pandit-name">{p.name}</h4>
                <span className="pandit-title">{p.title}</span>
                <div className="pandit-rating">
                  <span>★ {p.rating}</span>
                  <small>({p.poojasCompleted} Pujas Conducted)</small>
                </div>
              </div>
            </div>

            <div className="pandit-details">
              <div className="detail-item">
                <strong>Gurukul:</strong>
                <span>{p.gurukul}</span>
              </div>
              <div className="detail-item">
                <strong>Specialization:</strong>
                <span>{p.specialization}</span>
              </div>
              <div className="detail-item">
                <strong>Experience &amp; City:</strong>
                <span>{p.experience} • {p.city}</span>
              </div>
              <div className="detail-item">
                <strong>Languages:</strong>
                <span>{p.languages.join(', ')}</span>
              </div>
            </div>

            <div className="pandit-card-footer">
              <span className="status-indicator available">● Available for Muhurat</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
