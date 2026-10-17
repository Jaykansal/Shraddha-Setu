'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import HeroSlider from '@/components/home/HeroSlider';
import SearchBookingWidget from '@/components/home/SearchBookingWidget';
import PanchangWidget from '@/components/home/PanchangWidget';
import AutoScrollPoojaCarousel from '@/components/home/AutoScrollPoojaCarousel';
import VerifiedPanditsSection from '@/components/home/VerifiedPanditsSection';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import FastImage from '@/components/ui/FastImage';

export default function HomePage() {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    role: 'CLIENT',
    reason: '',
    redirectUrl: ''
  });
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    poojaId: 'grah-shanti',
    withSamagri: true
  });

  const handleOpenAuth = (role = 'CLIENT', reason = '', redirectUrl = '') => {
    setAuthModal({ isOpen: true, role, reason, redirectUrl });
  };

  const handleOpenBooking = (poojaId = 'grah-shanti', withSamagri = true) => {
    setBookingModal({ isOpen: true, poojaId, withSamagri });
  };

  return (
    <div className="app-root main-full-layout">
      {/* 1. TOP HEADER & AUSPICIOUS SHLOKA BAR */}
      <TopBar onOpenAuth={handleOpenAuth} />

      {/* 2. MAIN VEDIC NAVBAR */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenBooking={() => handleOpenBooking('grah-shanti', true)}
      />

      {/* 3. HERO SLIDER (FULL WIDTH MAJESTIC VEDIC BANNER) */}
      <HeroSlider
        onOpenModal={handleOpenBooking}
        onOpenPortal={handleOpenAuth}
      />

      {/* 4. FLOATING MUHURAT & POOJA SEARCH */}
      <SearchBookingWidget
        onSearch={({ pooja }) => handleOpenBooking(pooja || 'grah-shanti', true)}
      />

      {/* 5. AAJ KA PANCHANG (TODAY'S PANCHANG & SHUBH MUHURAT WIDGET - GATED) */}
      <PanchangWidget onOpenAuth={handleOpenAuth} />

      {/* 6. 3 DEDICATED PORTALS SHOWCASE */}
      <section className="section-portals-showcase" id="portals">
        <div className="section-header-centered">
          <span className="section-tag-gold">🏛️ 3 Dedicated Portals</span>
          <h2 className="section-title">Designed for Every Spiritual Role</h2>
          <p className="section-sub-desc">
            ShraddhaSetu unites Devotees, Certified Gurukul Scholars, and Mandir Samiti on one transparent, authentic platform.
          </p>
        </div>

        <div className="portals-three-grid">
          {/* PORTAL 1: DEVOTEE */}
          <div className="portal-showcase-card card-devotee">
            <div className="card-badge-header">
              <span className="badge-icon">🙏</span>
              <span className="badge-role">Devotee / Yajman</span>
            </div>
            <h3>Devotee Portal</h3>
            <p>
              Book sacred pujas at home. Choose between <strong>With 100% Pure Samagri Kit</strong> or <strong>Pandit Only (DIY)</strong>.
            </p>
            <ul className="portal-feature-list">
              <li>✓ Instant Muhurat &amp; Sankalp Confirmation</li>
              <li>✓ Call / WhatsApp Assigned Pandit Ji Directly</li>
              <li>✓ Live Samagri Checklist for DIY preparation</li>
              <li>✓ Transparent fixed Dakshina — No hidden charges</li>
            </ul>
            <div className="portal-btn-row">
              <button
                type="button"
                className="btn-card-portal btn-devotee"
                onClick={() => handleOpenAuth('CLIENT')}
              >
                Access Devotee Portal →
              </button>
            </div>
          </div>

          {/* PORTAL 2: PANDIT */}
          <div className="portal-showcase-card card-pandit">
            <div className="card-badge-header">
              <span className="badge-icon">🕉️</span>
              <span className="badge-role">Vedic Scholar</span>
            </div>
            <h3>Acharya &amp; Pandit Portal</h3>
            <p>
              For certified Pandits from Kashi, Tirupati, Ujjain, and Haridwar to receive and manage local ceremonies.
            </p>
            <ul className="portal-feature-list">
              <li>✓ Accept Puja Requests in your city with 1 click</li>
              <li>✓ View Devotee address, Gotra, &amp; Muhurat time</li>
              <li>✓ Direct Dakshina payouts every Monday</li>
              <li>✓ Verified Gurukul Scholar Badge on profile</li>
            </ul>
            <div className="portal-btn-row">
              <button
                type="button"
                className="btn-card-portal btn-pandit"
                onClick={() => handleOpenAuth('PANDIT')}
              >
                Access Acharya Portal →
              </button>
            </div>
          </div>

          {/* PORTAL 3: ADMIN */}
          <div className="portal-showcase-card card-admin">
            <div className="card-badge-header">
              <span className="badge-icon">🏛️</span>
              <span className="badge-role">Mandir Samiti</span>
            </div>
            <h3>Admin &amp; Verification Desk</h3>
            <p>
              Central management for verifying Pandit Gurukul degrees, monitoring nationwide pujas, and pricing.
            </p>
            <ul className="portal-feature-list">
              <li>✓ Gurukul Certificate &amp; Police Verification desk</li>
              <li>✓ Nationwide Puja operations monitor across 500+ cities</li>
              <li>✓ Samagri quality audits (A2 Ghee &amp; Bhimseni camphor)</li>
              <li>✓ Real-time analytics &amp; Dakshina ledger</li>
            </ul>
            <div className="portal-btn-row">
              <button
                type="button"
                className="btn-card-portal btn-admin"
                onClick={() => handleOpenAuth('ADMIN')}
              >
                Access Admin Console →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUST BAR (6 USPs) */}
      <div className="trust-bar">
        <div className="trust-item">
          <div className="trust-icon-box"><span className="trust-emoji">🕉️</span></div>
          <div className="trust-info">
            <span className="trust-title">Verified Pandits</span>
            <span className="trust-sub">Gurukul &amp; Veda Certified</span>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon-box"><span className="trust-emoji">🔥</span></div>
          <div className="trust-info">
            <span className="trust-title">Authentic Rituals</span>
            <span className="trust-sub">100% Classical Shastras</span>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon-box"><span className="trust-emoji">📦</span></div>
          <div className="trust-info">
            <span className="trust-title">Pure Vedic Samagri</span>
            <span className="trust-sub">Gau Ghee &amp; Natural Herbs</span>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon-box"><span className="trust-emoji">⏰</span></div>
          <div className="trust-info">
            <span className="trust-title">Exact Muhurat</span>
            <span className="trust-sub">Panchang Calculation</span>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon-box"><span className="trust-emoji">₹</span></div>
          <div className="trust-info">
            <span className="trust-title">Fixed Dakshina</span>
            <span className="trust-sub">No Hidden Demands</span>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon-box"><span className="trust-emoji">🛡️</span></div>
          <div className="trust-info">
            <span className="trust-title">100% Guaranteed</span>
            <span className="trust-sub">Full Devotional Peace</span>
          </div>
        </div>
      </div>

      {/* 8. MASTER POOJA CATALOG CAROUSEL */}
      <AutoScrollPoojaCarousel onSelectPooja={handleOpenBooking} />

      {/* 9. VERIFIED PANDITS / ACHARYA DIRECTORY PREVIEW */}
      <VerifiedPanditsSection onSelectPandit={() => handleOpenBooking('grah-shanti', true)} />

      {/* 10. HOW IT WORKS & MOBILE ECOSYSTEM */}
      <section className="section-process-and-app">
        <div className="how-it-works-box">
          <div className="section-header-centered">
            <span className="section-tag-gold">✨ Saral Pooja Vidhi</span>
            <h2 className="section-title">How ShraddhaSetu Works</h2>
            <p className="section-sub-desc">5 Simple Steps from Sankalp to Purnaahuti</p>
          </div>

          <div className="steps-row">
            <div className="step-item">
              <div className="step-icon-circle">1</div>
              <div className="step-title">Select Pooja</div>
              <div className="step-desc">Choose from 50+ Vedic Pujas for Griha, Health &amp; Prosperity.</div>
            </div>
            <div className="step-arrow">➔</div>

            <div className="step-item">
              <div className="step-icon-circle">2</div>
              <div className="step-title">Choose Package</div>
              <div className="step-desc">Select With Pure Samagri Kit or Pandit Only (DIY).</div>
            </div>
            <div className="step-arrow">➔</div>

            <div className="step-item">
              <div className="step-icon-circle">3</div>
              <div className="step-title">Pandit Ji Assigned</div>
              <div className="step-desc">Certified Gurukul Pandit accepts &amp; calls for Gotra.</div>
            </div>
            <div className="step-arrow">➔</div>

            <div className="step-item">
              <div className="step-icon-circle">4</div>
              <div className="step-title">Puja Conducted</div>
              <div className="step-desc">Sacred havan and authentic Vedic vidhi performed.</div>
            </div>
            <div className="step-arrow">➔</div>

            <div className="step-item">
              <div className="step-icon-circle">5</div>
              <div className="step-title">Divine Blessings</div>
              <div className="step-desc">Purnaahuti, sacred prasad, and lifelong peace.</div>
            </div>
          </div>
        </div>

        {/* INTEGRATED BRAND ECOSYSTEM & MOBILE EXPERIENCE */}
        <div className="vedic-ecosystem-banner">
          <div className="ecosystem-col-info">
            <div className="ecosystem-badge-row">
              <span className="badge-tag">📲 सम्पूर्ण वैदिक सेतु</span>
              <span className="badge-tag-alt">Google Play &amp; App Store</span>
            </div>
            <h3 className="ecosystem-heading">अपने घर पर साक्षात् तीर्थ का अनुभव</h3>
            <p className="ecosystem-sub">
              श्रद्धासेतु ऍप के माध्यम से आप किसी भी समय <strong>दैनिक पंचांग, शुभ चौघड़िया, व्रत कथाएँ</strong> एवं देश के 500+ नगरों में प्रामाणिक गुरुकुल आचार्यों से पूजा अनुष्ठान बुक कर सकते हैं।
            </p>
            <div className="store-buttons">
              <a href="#playstore" className="store-btn">
                <span style={{ fontSize: '22px' }}>▶</span>
                <div><small>GET IT ON</small><span>Google Play</span></div>
              </a>
              <a href="#appstore" className="store-btn">
                <span style={{ fontSize: '22px' }}></span>
                <div><small>Download on</small><span>App Store</span></div>
              </a>
              <button
                type="button"
                className="btn-open-panchang-quick"
                onClick={() => {
                  handleOpenAuth('CLIENT', 'दैनिक पंचांग व शुभ मुहूर्त देखने के लिए कृपया लॉगिन करें।', '/panchang');
                }}
              >
                <span>📅</span> आज का पंचांग देखें →
              </button>
            </div>
          </div>

          <div className="ecosystem-col-visual">
            <div className="mockup-frame">
              <FastImage
                src="/images/app_mockup.png"
                alt="ShraddhaSetu App Mockup"
                width={280}
                height={200}
                className="mockup-img"
              />
            </div>
            <div className="app-icon-floating">
              <FastImage
                src="/images/brand_app_icon.png"
                alt="ShraddhaSetu Sacred Icon"
                width={90}
                height={90}
                className="floating-icon-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 11. STATS */}
      <FooterStats />

      {/* 12. FOOTER */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* 3-IN-1 AUTH MODAL */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialRole={authModal.role}
        reason={authModal.reason}
        redirectUrl={authModal.redirectUrl}
        onClose={() => setAuthModal({ isOpen: false, role: 'CLIENT', reason: '', redirectUrl: '' })}
      />

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        initialPoojaId={bookingModal.poojaId}
        initialWithSamagri={bookingModal.withSamagri}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  );
}
