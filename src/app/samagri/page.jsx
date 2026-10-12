'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import PoojaSamagriSection from '@/components/home/PoojaSamagriSection';
import BrandSidebar from '@/components/layout/BrandSidebar';

export default function SamagriPage() {
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
              <Link href="/">Home</Link> &nbsp;❯&nbsp; <span>Pooja Samagri</span>
            </div>
            <h1 className="route-page-title">100% Shuddh Vedic Pooja Samagri</h1>
            <p className="route-page-subtitle">Pure Desi Cow Ghee, Unadulterated Bhimseni Camphor, Himalayan Herbs & Gangajal sealed in auspicious kits.</p>
          </div>

          <PoojaSamagriSection onBookPooja={(poojaId) => setBookingModal({ isOpen: true, poojaId, withSamagri: true })} />

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
