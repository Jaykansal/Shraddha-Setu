'use client';

import { useState, useEffect } from 'react';
import FastImage from '@/components/ui/FastImage';
import { SITE_CONFIG } from '@/data/siteConfig';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero_illustration.png',
    tag: 'VARANASI GHATS & SUNRISE AARTI',
    title: 'Divine Temple Ghats & Sacred Ganga Aarti',
    desc: 'Invite authentic Vedic blessings to your doorstep with certified Acharyas from Kashi & Haridwar.'
  },
  {
    id: 2,
    image: '/images/pooja_grah_shanti.png',
    tag: 'DIVINE LORD GANESHA & NAVAGRAHA',
    title: 'Vighnaharta Mangal Murti & Grah Shanti',
    desc: 'Harmonize cosmic vibrations and dissolve domestic obstacles with classical Vedic Vidhi.'
  },
  {
    id: 3,
    image: '/images/pooja_mrityunjaya.png',
    tag: 'LORD SHIVA & SACRED KALASH',
    title: 'Maha Mrityunjaya & Sacred Bilva Abhishekam',
    desc: 'Potent Vedic Jaap and Havan dedicated to Mahadev for radiant health, peace, and protection.'
  },
  {
    id: 4,
    image: '/images/pooja_lakshmi.png',
    tag: 'MAHALAKSHMI & KUBER ABUNDANCE',
    title: 'Goddess Lakshmi Pujan & Golden Prosperity',
    desc: 'Invoke spiritual abundance, commercial stability, and joyous fortune for home and business.'
  }
];

export default function HeroSlider({ onOpenModal, onOpenPortal }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="hero-container" id="home">
      <div className="hero-wrapper">
        <div className="hero-content">
          <div className="hero-tagline">
            <span>✨</span> FAITH &nbsp;|&nbsp; VEDIC TRADITION &nbsp;|&nbsp; DEVOTION <span>✨</span>
          </div>

          <h1 className="hero-title">
            <span className="title-part-shraddha">Shraddha</span>
            <span className="title-part-setu">Setu</span>
          </h1>

          <div className="title-subline">
            Book Certified Gurukul Pandits for <br />
            <span className="highlight">Sacred Pujas & Havans at Home</span>
          </div>

          <p className="hero-description">
            {SITE_CONFIG.motto} Choose between <strong>"With 100% Pure Samagri Kit"</strong> or <strong>"Pandit Only"</strong> across 500+ Indian cities.
          </p>

          {/* Quick Dual Choice Highlight Pills */}
          <div className="hero-choice-pills">
            <div className="choice-pill-item">
              <span className="pill-icon">📦</span>
              <div>
                <strong>With Pure Samagri Kit</strong>
                <small>A2 Ghee, Camphor, Gangajal & 32 Herbs</small>
              </div>
            </div>
            <div className="choice-pill-item">
              <span className="pill-icon">🕉️</span>
              <div>
                <strong>Pandit Only (DIY Samagri)</strong>
                <small>Dakshina only + Free exact checklist</small>
              </div>
            </div>
          </div>

          <div className="hero-buttons">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => onOpenModal?.('grah-shanti', true)}
            >
              <span>🕉️</span> Call / Book a Pandit
            </button>
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => onOpenPortal?.('CLIENT')}
            >
              <span>🔐</span> Access 3 Portals
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-slider-box">
            <div className="hero-slide-item active">
              <FastImage
                src={slide.image}
                alt={slide.title}
                width={640}
                height={380}
                priority={true}
                className="hero-img"
              />
              <div className="hero-slide-caption">
                <span className="caption-tag">{slide.tag}</span>
                <p>{slide.title}</p>
                <small>{slide.desc}</small>
              </div>
            </div>

            <div className="hero-slider-dots">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
