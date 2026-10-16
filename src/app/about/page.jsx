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
import { SITE_CONFIG } from '@/data/siteConfig';

export default function AboutPage() {
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
              <Link href="/">Home</Link> &nbsp;›&nbsp; <span>About ShraddhaSetu</span>
            </div>
            <h1 className="route-page-title">Connecting Faith with Divine Services</h1>
            <p className="route-page-subtitle">{SITE_CONFIG.motto}</p>
          </div>

          <section className="section-popular full-catalog-section about-content-section">
            <div className="about-text-card">
              <h3>Our Sacred Mission</h3>
              <p>
                In today's fast-paced world, arranging an authentic Vedic puja at home often brings uncertainty: finding a genuine Gurukul-trained Pandit who understands classical Shastras, and sourcing 100% adulteration-free samagri like Bilona A2 ghee, Bhimseni camphor, and natural herbs.
              </p>
              <p>
                <strong>ShraddhaSetu</strong> was founded in the holy city of Kashi (Varanasi) to bridge this gap. We empower devotees to invite certified Vedic Acharyas with complete transparent Dakshina and high-purity ritual kits.
              </p>

              <h3 style={{ marginTop: '24px' }}>Our 3 Pillars of Sanctity</h3>
              <div className="three-pillars-grid">
                <div className="pillar-item">
                  <span className="pillar-icon">📜</span>
                  <h4>Gurukul Certified Acharyas</h4>
                  <p>Trained in Rigveda, Shukla Yajurveda, and Samaveda from esteemed Veda Vidyapeeths.</p>
                </div>
                <div className="pillar-item">
                  <span className="pillar-icon">🪔</span>
                  <h4>100% Shuddh Vedic Samagri</h4>
                  <p>Certified pure A2 cow ghee, mountain Gangajal, and medicinal samidha wood for divine havan.</p>
                </div>
                <div className="pillar-item">
                  <span className="pillar-icon">⚖️</span>
                  <h4>Transparent Dakshina</h4>
                  <p>Fixed honorarium with clear bifurcation between "With Samagri" and "Pandit Only".</p>
                </div>
              </div>
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
