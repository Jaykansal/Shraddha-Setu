'use client';

import { useState } from 'react';
import Link from 'next/link';
import BrandSidebar from '@/components/layout/BrandSidebar';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import HeroSlider from '@/components/home/HeroSlider';
import SearchBookingWidget from '@/components/home/SearchBookingWidget';
import AutoScrollPoojaCarousel from '@/components/home/AutoScrollPoojaCarousel';
import VerifiedPanditsSection from '@/components/home/VerifiedPanditsSection';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import FastImage from '@/components/ui/FastImage';

export default function HomePage() {
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'CLIENT' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true });

  const handleOpenAuth = (role = 'CLIENT') => {
    setAuthModal({ isOpen: true, role });
  };

  const handleOpenBooking = (poojaId = 'grah-shanti', withSamagri = true) => {
    setBookingModal({ isOpen: true, poojaId, withSamagri });
  };

  return (
    <div className="app-root compact-home-view">
      <div className="showcase-layout">
        {/* LEFT BRAND SIDEBAR */}
        <BrandSidebar onOpenModal={handleOpenAuth} />

        {/* RIGHT MAIN WEBSITE */}
        <main className="main-website-wrapper">
          <TopBar onOpenAuth={handleOpenAuth} />
          <Navbar
            onOpenAuth={handleOpenAuth}
            onOpenBooking={() => handleOpenBooking('grah-shanti', true)}
          />

          {/* HERO SLIDER (ZERO DELAY IMAGE + 3-PORTAL LAUNCHERS) */}
          <HeroSlider
            onOpenModal={handleOpenBooking}
            onOpenPortal={handleOpenAuth}
          />

          {/* FLOATING SEARCH & MUHURAT FILTER */}
          <SearchBookingWidget
            onSearch={({ pooja }) => handleOpenBooking(pooja || 'grah-shanti', true)}
          />

          {/* 3-PORTAL EXPLANATION SECTION (ABOUT WEBSITE & HOW EACH PORTAL WORKS) */}
          <section className="section-portals-showcase" id="portals">
            <div className="section-header-centered">
              <span className="section-tag-gold">🏛️ 3 Dedicated Portals</span>
              <h2 className="section-title">Designed for Every Spiritual Role</h2>
              <p className="section-sub-desc">
                ShraddhaSetu unites Devotees, Certified Gurukul Scholars, and Mandir Samiti on one transparent platform.
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
                    Open Devotee Portal →
                  </button>
                  <Link href="/dashboard/devotee" className="portal-direct-link">
                    Direct Demo Link
                  </Link>
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
                    Open Pandit Portal →
                  </button>
                  <Link href="/dashboard/pandit" className="portal-direct-link">
                    Direct Demo Link
                  </Link>
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
                    Open Admin Console →
                  </button>
                  <Link href="/dashboard/admin" className="portal-direct-link">
                    Direct Demo Link
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* TRUST BADGES (6 USPs) */}
          <div className="trust-bar">
            <div className="trust-item">
              <div className="trust-icon-box">
                <span className="trust-emoji">🕉️</span>
              </div>
              <div className="trust-info">
                <span className="trust-title">Verified Pandits</span>
                <span className="trust-sub">Gurukul &amp; Veda Certified</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <span className="trust-emoji">🔥</span>
              </div>
              <div className="trust-info">
                <span className="trust-title">Authentic Rituals</span>
                <span className="trust-sub">100% Classical Shastras</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <span className="trust-emoji">📦</span>
              </div>
              <div className="trust-info">
                <span className="trust-title">Pooja Samagri</span>
                <span className="trust-sub">Included or DIY Option</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <span className="trust-emoji">📍</span>
              </div>
              <div className="trust-info">
                <span className="trust-title">Pan India Service</span>
                <span className="trust-sub">500+ Cities Covered</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <span className="trust-emoji">📞</span>
              </div>
              <div className="trust-info">
                <span className="trust-title">24/7 Vedic Support</span>
                <span className="trust-sub">Always Here for Gotra &amp; Muhurat</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <span className="trust-emoji">🪙</span>
              </div>
              <div className="trust-info">
                <span className="trust-title">Transparent Dakshina</span>
                <span className="trust-sub">No Hidden Demands</span>
              </div>
            </div>
          </div>

          {/* POPULAR POOJA SERVICES (FAST IMAGE CAROUSEL) */}
          <AutoScrollPoojaCarousel
            onBookPooja={(poojaId, withSamagri) => handleOpenBooking(poojaId, withSamagri)}
          />

          {/* VERIFIED GURUKUL PANDITS SECTION */}
          <VerifiedPanditsSection
            onOpenPanditPortal={() => handleOpenAuth('PANDIT')}
          />

          {/* HOW IT WORKS */}
          <section className="section-process-app">
            <div className="how-it-works-box">
              <div className="hiw-header">
                <h3>How to Book a Pandit Ji on ShraddhaSetu</h3>
                <span className="info-circle">i</span>
              </div>
              <div className="steps-row">
                <div className="step-item">
                  <div className="step-icon-circle">1</div>
                  <div className="step-title">Choose Ritual</div>
                  <div className="step-desc">Pick ceremony &amp; select "With Samagri" or "Pandit Only".</div>
                </div>
                <div className="step-arrow">➔</div>

                <div className="step-item">
                  <div className="step-icon-circle">2</div>
                  <div className="step-title">Pick Muhurat</div>
                  <div className="step-desc">Select auspicious date, time slot, and your city.</div>
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

            {/* APP PROMO CARD */}
            <div className="app-card-box" id="app">
              <div className="app-card-text">
                <h3 className="app-card-title">Take Your Devotion Everywhere</h3>
                <p className="app-card-subtitle">Download the ShraddhaSetu App for Devotees &amp; Pandits</p>
                <div className="store-buttons">
                  <a href="#playstore" className="store-btn">
                    <span style={{ fontSize: '20px' }}>▶</span>
                    <div><small>GET IT ON</small><span>Google Play</span></div>
                  </a>
                  <a href="#appstore" className="store-btn">
                    <span style={{ fontSize: '20px' }}></span>
                    <div><small>Download on</small><span>App Store</span></div>
                  </a>
                </div>
              </div>
              <div className="app-card-mockup">
                <FastImage
                  src="/images/app_mockup.png"
                  alt="ShraddhaSetu App on Smartphone"
                  width={220}
                  height={150}
                  className="app-mockup-img"
                />
              </div>
            </div>
          </section>

          {/* STATS */}
          <FooterStats />

          {/* FOOTER */}
          <Footer />
        </main>
      </div>

      {/* 3-IN-1 AUTH MODAL */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialRole={authModal.role}
        onClose={() => setAuthModal({ isOpen: false, role: 'CLIENT' })}
      />

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        initialPoojaId={bookingModal.poojaId}
        initialWithSamagri={bookingModal.withSamagri}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
      />
    </div>
  );
}
