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

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'CLIENT' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              <Link href="/">Home</Link> &nbsp;›&nbsp; <span>Contact Us</span>
            </div>
            <h1 className="route-page-title">Vedic Helpline &amp; Inquiries</h1>
            <p className="route-page-subtitle">
              Our Vedic Acharya coordinators are here 24/7 to answer questions regarding Muhurats, Gotra Sankalp, and Samagri kits.
            </p>
          </div>

          <section className="section-popular full-catalog-section contact-section">
            <div className="contact-grid-layout">
              <div className="contact-info-card">
                <h3>Get in Touch</h3>
                <p>Feel free to call or WhatsApp our Acharya desk for any puja queries.</p>

                <div className="contact-touch-item">
                  <span className="touch-icon">📞</span>
                  <div>
                    <strong>24/7 Vedic Helpline</strong>
                    <p><a href="tel:+911234567890">{SITE_CONFIG.phone}</a></p>
                  </div>
                </div>

                <div className="contact-touch-item">
                  <span className="touch-icon">✉️</span>
                  <div>
                    <strong>Email Support</strong>
                    <p><a href={`mailto:${SITE_CONFIG.supportEmail}`}>{SITE_CONFIG.supportEmail}</a></p>
                  </div>
                </div>

                <div className="contact-touch-item">
                  <span className="touch-icon">📍</span>
                  <div>
                    <strong>Kashi Vishwanath Office</strong>
                    <p>Dharmashala Marg, Near Dashashwamedh Ghat, Varanasi, Uttar Pradesh - 221001</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-card">
                {submitted ? (
                  <div className="contact-success-msg">
                    <span style={{ fontSize: '36px' }}>🙏</span>
                    <h4>Dhanyawad! Your Inquiry Has Been Received.</h4>
                    <p>Our Vedic Acharya coordinator will call you within 2 hours to assist with your puja requirements.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <h3>Send a Direct Inquiry</h3>
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input type="text" required placeholder="e.g. Rameshwar Sharma" />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number (WhatsApp) *</label>
                      <input type="tel" required placeholder="+91 98765 43210" />
                    </div>
                    <div className="form-group">
                      <label>City &amp; Preferred Ceremony</label>
                      <input type="text" placeholder="e.g. Griha Pravesh in Delhi NCR" />
                    </div>
                    <div className="form-group">
                      <label>Your Query / Sankalp Requirement</label>
                      <textarea rows={4} placeholder="Please ask any question regarding Muhurat dates, Samagri kit, or Pandit availability..." required />
                    </div>
                    <button type="submit" className="btn-hero-primary" style={{ width: '100%' }}>
                      Submit Inquiry to Acharya Desk →
                    </button>
                  </form>
                )}
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
