import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-logo-wrapper">
              <Image 
                src="/images/brand_logo_top.png"
                alt="ShraddhaSetu Sacred Emblem"
                width={480}
                height={510}
                className="about-emblem-img"
              />
            </div>
            <div className="about-badge-card">
              <span className="badge-vedic-icon">🕉️</span>
              <div>
                <strong>100% Vedic Gurukul Certified</strong>
                <p>Authentic Sanskrit Mantras & Proper Vidhi Vidhan</p>
              </div>
            </div>
          </div>

          <div className="about-content">
            <div className="section-pill-tag">ABOUT SHRADDHASETU</div>
            <h2 className="about-heading">
              Connecting Faith with <span className="highlight">Divine Services</span> Across India
            </h2>
            <p className="about-text-lead">
              Founded on the sacred banks of Varanasi and the ancient spiritual wisdom of Sanatan Dharma, 
              <strong> ShraddhaSetu</strong> serves as a holy bridge connecting devoted families with 
              authentic, experienced Vedic Pandits and pure pooja samagri.
            </p>
            <p className="about-text">
              In today's fast-paced world, finding reliable Gurukul-trained Pandits who follow complete 
              Shastriya Vidhi and arranging pure, unadulterated havan samagri has become challenging. 
              From <em>Sankalp to Samapan</em>, our mission is to preserve sacred rituals with absolute 
              purity, punctuality, and spiritual devotion.
            </p>

            <div className="about-pillars-grid">
              <div className="pillar-item">
                <span className="pillar-icon">📜</span>
                <div>
                  <h4>Vedic Lineage</h4>
                  <p>Pandits vetted from prestigious Gurukuls across Kashi, Ujjain, and Tirupati.</p>
                </div>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon">🧈</span>
                <div>
                  <h4>100% Pure Samagri</h4>
                  <p>Certified Bilona Desi Ghee, original Gangajal, and authentic Ayurvedic herbs.</p>
                </div>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon">📍</span>
                <div>
                  <h4>Pan India Coverage</h4>
                  <p>Dedicated Pandit network serving over 500+ cities and overseas online e-Puja.</p>
                </div>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon">🤝</span>
                <div>
                  <h4>Transparent Dakshina</h4>
                  <p>Clear, fixed pricing with zero hidden charges or last-minute surprises.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
