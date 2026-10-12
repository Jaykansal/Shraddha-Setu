'use client';

import { useState } from 'react';
import BrandSidebar from '@/components/layout/BrandSidebar';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import HeroSlider from '@/components/home/HeroSlider';
import SearchBookingWidget from '@/components/home/SearchBookingWidget';
import AutoScrollPoojaCarousel from '@/components/home/AutoScrollPoojaCarousel';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import Image from 'next/image';

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
          <TopBar />
          <Navbar 
            onOpenAuth={handleOpenAuth} 
            onOpenBooking={() => handleOpenBooking('grah-shanti', true)} 
          />

          {/* HERO SLIDER (2-COLUMN BALANCED LAYOUT, ROTATES EVERY 5 SECONDS) */}
          <HeroSlider onOpenModal={handleOpenBooking} />

          {/* FLOATING SEARCH & MUHURAT FILTER */}
          <SearchBookingWidget 
            onSearch={({ pooja }) => handleOpenBooking(pooja || 'grah-shanti', true)} 
          />

          {/* TRUST BADGES (6 USPs) */}
          <div className="trust-bar">
            <div className="trust-item">
              <div className="trust-icon-box">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div className="trust-info">
                <span className="trust-title">Verified Pandits</span>
                <span className="trust-sub">Experienced & Trusted</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <svg viewBox="0 0 24 24"><path d="M12 2c1.5 2.5 3 6 3 9 0 2.2-1.3 4-3 4s-3-1.8-3-4c0-3 1.5-6.5 3-9zm-4.5 9.5C6.4 9 4.5 8 3 8c.5 3 2.5 5.5 5 6.5-.5-1-1-2-1-3zm9 0c0 1-.5 2-1 3 2.5-1 4.5-3.5 5-6.5-1.5 0-3.4 1-4.5 3.5zM12 17c-2.5 0-5 1-7 3 2.5 1.5 5.5 2 7 2s4.5-.5 7-2c-2-2-4.5-3-7-3z"/></svg>
              </div>
              <div className="trust-info">
                <span className="trust-title">Authentic Rituals</span>
                <span className="trust-sub">Vedic & Traditional</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              </div>
              <div className="trust-info">
                <span className="trust-title">Pooja Samagri</span>
                <span className="trust-sub">Included / Optional</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div className="trust-info">
                <span className="trust-title">Pan India Service</span>
                <span className="trust-sub">500+ Cities</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <svg viewBox="0 0 24 24"><path d="M20 15.5c-.7 0-1.4-.1-2-.4-.6-.2-1.1-.6-1.5-1.1l-1.4 1.4c.7.7 1.5 1.2 2.4 1.5.9.3 1.8.5 2.8.5v2c-1.4 0-2.8-.3-4-.8-1.2-.5-2.3-1.3-3.2-2.2L12 15.4l-1.1 1c-.9.9-2 1.7-3.2 2.2-1.2.5-2.6.8-4 .8v-2c1 0 1.9-.2 2.8-.5.9-.3 1.7-.8 2.4-1.5l-1.4-1.4c-.4.5-.9.9-1.5 1.1-.6.3-1.3.4-2 .4v-2c.6 0 1.2-.1 1.7-.3.5-.2 1-.5 1.4-.9l1.4-1.4c.5-.5.9-1 1.1-1.7.3-.6.4-1.2.4-1.8H5.5C4.7 9 4 8.3 4 7.5S4.7 6 5.5 6H7c0-2.8 2.2-5 5-5s5 2.2 5 5h1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-1.6c0 .6.1 1.2.4 1.8.2.6.6 1.1 1.1 1.7l1.4 1.4c.4.4.9.7 1.4.9.5.2 1.1.3 1.7.3v2z"/></svg>
              </div>
              <div className="trust-info">
                <span className="trust-title">24/7 Support</span>
                <span className="trust-sub">We're Always Here</span>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box">
                <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              </div>
              <div className="trust-info">
                <span className="trust-title">Secure Payments</span>
                <span className="trust-sub">Safe & Transparent</span>
              </div>
            </div>
          </div>

          {/* POPULAR POOJA SERVICES (CONTINUOUS INFINITE MARQUEE) */}
          <AutoScrollPoojaCarousel 
            onBookPooja={(poojaId, withSamagri) => handleOpenBooking(poojaId, withSamagri)} 
          />

          {/* HOW IT WORKS & APP DOWNLOAD */}
          <section className="section-process-app">
            <div className="how-it-works-box">
              <div className="hiw-header">
                <h3>How It Works?</h3>
                <span className="info-circle">i</span>
              </div>
              <div className="steps-row">
                <div className="step-item">
                  <div className="step-icon-circle">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  </div>
                  <div className="step-title">Choose Your Pooja</div>
                  <div className="step-desc">Select ritual & Samagri preference.</div>
                </div>
                <div className="step-arrow">➔</div>

                <div className="step-item">
                  <div className="step-icon-circle">
                    <svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
                  </div>
                  <div className="step-title">Select Date & Location</div>
                  <div className="step-desc">Pick auspicious muhurat & venue.</div>
                </div>
                <div className="step-arrow">➔</div>

                <div className="step-item">
                  <div className="step-icon-circle">
                    <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  </div>
                  <div className="step-title">We Arrange Everything</div>
                  <div className="step-desc">Pandit Ji & samagri kit dispatched.</div>
                </div>
                <div className="step-arrow">➔</div>

                <div className="step-item">
                  <div className="step-icon-circle">
                    <svg viewBox="0 0 24 24"><path d="M12 2c-.5 2-3 5-3 8 0 2.76 2.24 5 5 5s5-2.24 5-5c0-3-2.5-6-3-8h-4zm-7 16h14c0 2.21-3.13 4-7 4s-7-1.79-7-4z"/></svg>
                  </div>
                  <div className="step-title">Pooja Performed</div>
                  <div className="step-desc">Sacred havan & authentic Vedic vidhi.</div>
                </div>
                <div className="step-arrow">➔</div>

                <div className="step-item">
                  <div className="step-icon-circle">
                    <svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.65-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.89 2-2V8c0-1.1-.9-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1 1.36 1-1.36 2.38 3.24L17 10.83 14.92 8H20v6z"/></svg>
                  </div>
                  <div className="step-title">Receive Blessings</div>
                  <div className="step-desc">Divine prasad & pooja memories.</div>
                </div>
              </div>
            </div>

            <div className="app-card-box" id="app">
              <div className="app-card-text">
                <h3 className="app-card-title">Take Your Devotion Everywhere</h3>
                <p className="app-card-subtitle">Download ShraddhaSetu App</p>
                <div className="store-buttons">
                  <a href="#playstore" className="store-btn">
                    <svg viewBox="0 0 24 24"><path d="M3.6 2.4l11.4 11.4-3.5 3.5L1.8 4.2C1.5 3.7 1.7 3 2.2 2.6c.4-.3 1-.3 1.4-.2zm13.1 13.1l3.5-3.5c.6-.6.6-1.6 0-2.2l-3.5-3.5-2.2 2.2 2.2 7zm-3.9-3.9L1.4 20.2c-.3.4-.3 1 .1 1.4.3.3.7.4 1.1.4.4 0 .8-.2 1.1-.4l11.4-11.4-2.2-2.2z"/></svg>
                    <div><small>GET IT ON</small><span>Google Play</span></div>
                  </a>
                  <a href="#appstore" className="store-btn">
                    <svg viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.95.99-3.09-1 .04-2.18.66-2.88 1.49-.6.7-1.13 1.83-1 2.94 1.11.08 2.24-.55 2.89-1.34z"/></svg>
                    <div><small>Download on the</small><span>App Store</span></div>
                  </a>
                </div>
              </div>
              <div className="app-card-mockup">
                <Image
                  src="/images/app_mockup.png"
                  alt="ShraddhaSetu App on Smartphone"
                  width={240}
                  height={166}
                  className="app-mockup-img"
                />
              </div>
            </div>
          </section>

          {/* MILESTONE COUNTERS */}
          <FooterStats />

          {/* COMPACT FOOTER WITH ROUTES */}
          <Footer />
        </main>
      </div>

      {/* MODALS */}
      <AuthModal 
        isOpen={authModal.isOpen} 
        initialRole={authModal.role}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
      />

      <BookingModal 
        isOpen={bookingModal.isOpen}
        initialPoojaId={bookingModal.poojaId}
        initialWithSamagri={bookingModal.withSamagri}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
      />
    </div>
  );
}
