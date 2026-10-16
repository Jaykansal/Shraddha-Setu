'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import PoojaCard from '@/components/home/PoojaCard';
import BrandSidebar from '@/components/layout/BrandSidebar';
import { POOJA_SERVICES } from '@/data/poojas';

export default function PoojasPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'CLIENT' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true });

  const categories = ['ALL', 'HAVAN', 'VASTU', 'DOSHA SHANTI', 'HEALTH', 'WEALTH'];

  const filteredPoojas = POOJA_SERVICES.filter((p) => {
    const matchesFilter = filter === 'ALL'
      || (p.category && p.category.toUpperCase().includes(filter))
      || (p.badge && p.badge.toUpperCase().includes(filter))
      || (p.title.toUpperCase().includes(filter));
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      || p.description.toLowerCase().includes(search.toLowerCase())
      || p.deity.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              <Link href="/">Home</Link> &nbsp;›&nbsp; <span>Vedic Poojas Catalog</span>
            </div>
            <h1 className="route-page-title">Explore Sacred Poojas &amp; Havans</h1>
            <p className="route-page-subtitle">
              Authentic Vedic Vidhi performed by Gurukul scholars. Complete transparency with or without samagri kits.
            </p>

            <div className="catalog-filters-bar">
              <div className="catalog-search-box">
                <input
                  type="text"
                  placeholder="Search puja by name, deity or remedy..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="catalog-search-input"
                />
              </div>
              <div className="catalog-category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={'category-pill-btn ' + (filter === cat ? 'active' : '')}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="section-popular full-catalog-section">
            <div className="cards-grid full-grid">
              {filteredPoojas.map((pooja) => (
                <PoojaCard
                  key={pooja.id}
                  pooja={pooja}
                  onBook={(poojaId, withSamagri) => setBookingModal({ isOpen: true, poojaId, withSamagri })}
                />
              ))}
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
