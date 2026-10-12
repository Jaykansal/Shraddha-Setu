import { VERIFIED_PANDITS } from '@/data/pandits';

export default function VerifiedPanditsSection({ onOpenPanditPortal }) {
  return (
    <section className="pandits-section" id="pandits">
      <div className="pandits-container">
        <div className="section-header-center">
          <div className="section-pill-tag">OUR ACHARYAS & SCHOLARS</div>
          <h2 className="section-title">Verified & Gurukul-Trained Pandits</h2>
          <div className="section-divider">
            <span>❖</span><span>🪷</span><span>❖</span>
          </div>
          <p className="section-subtitle">
            Experienced Sanskrit scholars, Jyotish Acharyas, and Vedic priests with over a decade of ritual dedication.
          </p>
        </div>

        <div className="pandits-grid">
          {VERIFIED_PANDITS.map((p) => (
            <div key={p.id} className="pandit-profile-card">
              <div className="pandit-card-top">
                <div className="pandit-avatar">
                  <span>🕉️</span>
                </div>
                <div>
                  <div className="pandit-name-row">
                    <h4>{p.name}</h4>
                    {p.verified && <span className="verified-check" title="Verified Acharya">✓ Verified</span>}
                  </div>
                  <span className="pandit-title">{p.title}</span>
                </div>
              </div>

              <div className="pandit-card-body">
                <div className="pandit-stat-row">
                  <span>🎓 Gurukul:</span>
                  <strong>{p.gurukul}</strong>
                </div>
                <div className="pandit-stat-row">
                  <span>⏳ Experience:</span>
                  <strong>{p.experience} ({p.poojasCompleted}+ Poojas)</strong>
                </div>
                <div className="pandit-stat-row">
                  <span>📍 Service Cities:</span>
                  <strong>{p.city}</strong>
                </div>
                <div className="pandit-stat-row">
                  <span>🗣️ Languages:</span>
                  <strong>{p.languages.join(', ')}</strong>
                </div>
              </div>

              <div className="pandit-card-footer">
                <span className="pandit-rating">★ {p.rating} / 5.0 Rating</span>
                <span className="expert-tag">{p.specialization.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* PANDIT RECRUITMENT BANNER */}
        <div className="pandit-join-banner">
          <div>
            <h3>Are You a Qualified Vedic Pandit / Acharya?</h3>
            <p>Join ShraddhaSetu to serve devotees with dignity, flexible schedules, and guaranteed fair Dakshina.</p>
          </div>
          <button 
            type="button" 
            className="btn-pandit-register"
            onClick={onOpenPanditPortal}
          >
            Register on Pandit Portal
          </button>
        </div>
      </div>
    </section>
  );
}
