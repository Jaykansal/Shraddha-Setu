'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import FooterStats from '@/components/layout/FooterStats';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import BrandSidebar from '@/components/layout/BrandSidebar';
import { BLOG_POSTS } from '@/data/blogs';

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'CLIENT' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true });

  const tags = ['ALL', 'Griha Pravesh', 'Muhurat', 'Lord Shiva', 'Lakshmi Puja', 'Samagri'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedTag === 'ALL') return true;
    return post.tags.includes(selectedTag) || post.category.includes(selectedTag);
  });

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
              <Link href="/">Home</Link> &nbsp;❯&nbsp; <span>Spiritual Blog & Vedic Wisdom</span>
            </div>
            <h1 className="route-page-title">ShraddhaSetu Spiritual Blog</h1>
            <p className="route-page-subtitle">Authentic articles on Panchang, Shubh Muhurats, Purana Kathas, and Vedic Ritual Significance</p>

            <div className="catalog-filters-bar">
              <div className="catalog-category-pills">
                {tags.map((t) => (
                  <button 
                    key={t} 
                    type="button" 
                    className={'category-pill-btn ' + (selectedTag === t ? 'active' : '')}
                    onClick={() => setSelectedTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="section-popular blog-posts-section">
            <div className="blog-posts-grid">
              {filteredPosts.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-image-box">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={240}
                      className="blog-img"
                    />
                    <span className="blog-card-category">{post.category}</span>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>✍️ {post.author}</span>
                      <span>•</span>
                      <span>📅 {post.date}</span>
                      <span>•</span>
                      <span>⏳ {post.readTime}</span>
                    </div>
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <div className="blog-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="blog-tag-badge">#{tag}</span>
                        ))}
                      </div>
                      <button 
                        type="button" 
                        className="btn-read-article" 
                        onClick={() => setBookingModal({ isOpen: true, poojaId: 'grah-shanti', withSamagri: true })}
                      >
                        Book Related Pooja ➔
                      </button>
                    </div>
                  </div>
                </article>
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
