'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import AboutSection from '@/components/home/AboutSection';
import BrandSidebar from '@/components/layout/BrandSidebar';

export default function AboutPage() {
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'CLIENT' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true });

  return (
    <div className="app-root">
      <div className="showcase-layout">
        <BrandSidebar onOpenModal={(role) => setAuthModal({ isOpen: true, role })} />
        <main className="main-website-wrapper">
          <TopBar />
          <Navbar 
            onOpenAuth={(role) => setAuthModal({ isOpen: true, role })} 
            onOpenBooking={() => setBookingModal({ isOpen: true, poojaId: 'grah-shanti', withSamagri: true })} 
          />

          <div className="route-header-banner">
            <div className="route-breadcrumb">
              <Link href="/">Home</Link> &nbsp;❯&nbsp; <span>About Us</span>
            </div>
            <h1 className="route-page-title">About ShraddhaSetu</h1>
            <p className="route-page-subtitle">Preserving Vedic Purity, Authenticity, and Traditional Shastriya Vidhi</p>
          </div>

          <AboutSection />

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
