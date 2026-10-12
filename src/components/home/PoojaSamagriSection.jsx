import { SAMAGRI_STANDARDS } from '@/data/samagriList';

export default function PoojaSamagriSection({ onBookPooja }) {
  return (
    <section className="samagri-section" id="samagri">
      <div className="samagri-container">
        <div className="section-header-center">
          <div className="section-pill-tag">POOJA SAMAGRI QUALITY</div>
          <h2 className="section-title">100% Shuddh Vedic Pooja Samagri Kit</h2>
          <div className="section-divider">
            <span>❖</span><span>🪷</span><span>❖</span>
          </div>
          <p className="section-subtitle">
            We provide pre-packaged, vacuum-sealed, and laboratory-tested sacred items for maximum spiritual purity.
          </p>
        </div>

        <div className="samagri-features-grid">
          {SAMAGRI_STANDARDS.features.map((item, idx) => (
            <div key={idx} className="samagri-feature-card">
              <div className="samagri-icon-circle">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="samagri-cta-banner">
          <div className="samagri-cta-text">
            <h3>Need Only Pure Samagri Box for Your Pooja?</h3>
            <p>Order customized Havan & Pujan kits delivered directly to your doorstep before the muhurat.</p>
          </div>
          <button 
            type="button" 
            className="btn-samagri-order"
            onClick={() => onBookPooja('Pooja Samagri Kit', true)}
          >
            Order Samagri Kit
          </button>
        </div>
      </div>
    </section>
  );
}
