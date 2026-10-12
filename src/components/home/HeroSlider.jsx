'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SITE_CONFIG } from '@/data/siteConfig';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero_illustration.png',
    tag: 'VARANASI GHATS & SUNRISE AARTI',
    title: 'Divine Temple Ghats & Sacred Ganga Aarti',
  },
  {
    id: 2,
    image: '/images/pooja_grah_shanti.png',
    tag: 'DIVINE LORD GANESHA',
    title: 'Vighnaharta Mangal Murti Blessings',
  },
  {
    id: 3,
    image: '/images/pooja_mrityunjaya.png',
    tag: 'LORD SHIVA & SACRED KALASH',
    title: 'Maha Mrityunjaya & Sacred Bilva Abhishekam',
  },
  {
    id: 4,
    image: '/images/pooja_lakshmi.png',
    tag: 'MAHALAKSHMI & ABUNDANCE',
    title: 'Goddess Lakshmi on Lotus & Golden Blessings',
  },
  {
    id: 5,
    image: '/images/pooja_navagraha.png',
    tag: 'VEDIC HAVAN & AGNI',
    title: 'Sacred Agni Flames & 100% Shuddh Havan',
  }
];

export default function HeroSlider({ onOpenModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-change hero image every 5 seconds (5000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-container" id="home">
      <div className="hero-wrapper">
        <div className="hero-content">
          <div className="hero-tagline">
            <span>✦</span> FAITH &nbsp;|&nbsp; TRADITION &nbsp;|&nbsp; DEVOTION <span>✦</span>
          </div>
          <h1 className="hero-title">
            <span className="title-part-shraddha">Shraddha</span>
            <span className="title-part-setu">Setu</span>
          </h1>
          <div className="title-subline">
            Connecting Faith with <br />
            <span className="highlight">Divine Services</span>
          </div>
          <p className="hero-description">
            {SITE_CONFIG.motto}
          </p>
          <div className="hero-buttons">
            <button 
              type="button" 
              className="btn-hero-primary" 
              onClick={() => onOpenModal?.('grah-shanti', true)}
            >
              <svg style={{ width: '15px', height: '15px', fill: '#FFF' }} viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              Book a Pooja
            </button>
            <a href="/poojas" className="btn-hero-secondary">
              <svg style={{ width: '15px', height: '15px', fill: '#801318' }} viewBox="0 0 24 24">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
              </svg>
              Explore All Poojas
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-slider-box">
            {HERO_SLIDES.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`hero-slide-item ${index === currentSlide ? 'active' : ''}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={1200}
                  height={675}
                  priority={index === 0}
                  className="hero-img"
                />
                <div className="hero-slide-caption">
                  <span className="caption-tag">{slide.tag}</span>
                  <p>{slide.title}</p>
                </div>
              </div>
            ))}

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
