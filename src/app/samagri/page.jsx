'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import BrandSidebar from '@/components/layout/BrandSidebar';
import { SAMAGRI_STANDARDS } from '@/data/samagriList';

export default function SamagriPage() {
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'CLIENT' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true });

  return (
    <div className="app-root">
      <div className="showcase-layout">
        <BrandSidebar onOpenModal={(role) => setAuthModal({ isOpen: true, role })} />
        <main className="main-website-wrapper">
          <TopBar onOpenAuth={(role) => setAuthModal({ isOpen: true, role })} />
          <Navbar
            onOpenAuth={(role) => setAuthModal({ isOpen: true, role })}
            onOpenBooking={() => setBookingModal({ isOpen: true, poojaId: 'grah-shanti', withSamagri: true })}
          />

          <div className="route-header-banner">
            <div className="route-breadcrumb">
              <Link href="/">Home</Link> &nbsp;›&nbsp; <span>Pooja Samagri</span>
            </div>
            <h1 className="route-page-title">{SAMAGRI_STANDARDS.title}</h1>
            <p className="route-page-subtitle">{SAMAGRI_STANDARDS.subtitle}</p>
          </div>

          <section className="section-popular full-catalog-section">
            <div className="samagri-feature-cards-grid">
              {SAMAGRI_STANDARDS.features.map((feat, i) => (
                <div key={i} className="samagri-quality-card">
                  <span className="samagri-feat-icon">{feat.icon}</span>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                </div>
              ))}
            </div>

            <div className="samagri-cta-box">
              <h3>Get 100% Shuddh Samagri Delivered to Your Home</h3>
              <p>Opt for "With Samagri" while booking any puja, and our team dispatches the sanctified kit right to your doorstep.</p>
              <button
                type="button"
                className="btn-hero-primary"
                style={{ margin: '16px auto 0' }}
                onClick={() => setBookingModal({ isOpen: true, poojaId: 'grah-shanti', withSamagri: true })}
              >
                Book Pooja with Samagri Kit →
              </button>
            </div>
          </section>

          <FooterStats />
          <Footer />
        </main>
      </div>

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
