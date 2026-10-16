'use client';

import { useState } from 'react';
import FastImage from '@/components/ui/FastImage';

export default function PoojaCard({ pooja, onBook }) {
  const [withSamagri, setWithSamagri] = useState(true);
  const displayPrice = withSamagri ? pooja.priceWithSamagri : pooja.priceWithoutSamagri;

  return (
    <div className="pooja-card">
      <div className="card-img-box">
        <FastImage
          src={pooja.image}
          alt={pooja.title}
          width={320}
          height={180}
          className="pooja-card-img"
        />
        {pooja.badge && (
          <span className="card-category-badge">{pooja.badge}</span>
        )}
      </div>

      <h4 className="card-title">{pooja.title}</h4>
      <p className="card-subtitle">{pooja.subtitle}</p>

      {/* WITH VS WITHOUT SAMAGRI LIVE TOGGLE */}
      <div className="card-samagri-toggle">
        <button
          type="button"
          className={`toggle-pill-btn ${withSamagri ? 'active' : ''}`}
          onClick={() => setWithSamagri(true)}
          title="Includes all sacred ghee, havan wood, gangajal & herbs"
        >
          With Samagri
        </button>
        <button
          type="button"
          className={`toggle-pill-btn ${!withSamagri ? 'active' : ''}`}
          onClick={() => setWithSamagri(false)}
          title="Pandit ji only dakshina; samagri arranged by devotee"
        >
          Pandit Only
        </button>
      </div>

      <div className="card-price-row">
        <span className="price-tag">₹{displayPrice?.toLocaleString('en-IN')}</span>
        <span className="price-type-sub">{withSamagri ? '(With Full Kit)' : '(Pandit Dakshina)'}</span>
      </div>

      <button
        type="button"
        className="btn-card-book"
        onClick={() => onBook(pooja.id, withSamagri)}
      >
        Book This Pooja →
      </button>
    </div>
  );
}
