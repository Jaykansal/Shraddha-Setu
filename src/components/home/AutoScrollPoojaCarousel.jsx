'use client';

import { useState } from 'react';
import Link from 'next/link';
import PoojaCard from './PoojaCard';
import { POOJA_SERVICES } from '@/data/poojas';

export default function AutoScrollPoojaCarousel({ onBookPooja }) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicating the array creates a mathematical infinite loop marquee!
  const infiniteCards = [...POOJA_SERVICES, ...POOJA_SERVICES];

  return (
    <section className="section-popular" id="services">
      <div className="section-header-row">
        <div className="section-header-left">
          <h2 className="section-title">Popular Pooja Services</h2>
          <span className="section-sub-desc">
            Continuous smooth loop • Switch between <strong>With Samagri</strong> & <strong>Pandit Only</strong>
          </span>
        </div>
        <Link href="/poojas" className="view-all-link">
          View All Poojas (Full Catalog) ➔
        </Link>
      </div>

      <div 
        className="infinite-marquee-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`infinite-marquee-track ${isPaused ? 'paused' : ''}`}>
          {infiniteCards.map((pooja, index) => (
            <PoojaCard 
              key={`${pooja.id}-${index}`} 
              pooja={pooja} 
              onBook={(poojaId, withSamagri) => onBookPooja(poojaId, withSamagri)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
