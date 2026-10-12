'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PoojaCard({ pooja, onBook }) {
  // Local state for With vs Without Samagri on the card itself!
  const [withSamagri, setWithSamagri] = useState(true);

  const displayPrice = withSamagri ? pooja.priceWithSamagri : pooja.priceWithoutSamagri;

  return (
    <div className="pooja-card">
      <div className="card-img-box">
        <Image
          src={pooja.image}
          alt={pooja.title}
          width={220}
          height={145}
          className="pooja-card-img"
        />
      </div>

      <h4 className="card-title">{pooja.title}</h4>
      <p className="card-subtitle">{pooja.subtitle}</p>

      {/* WITH VS WITHOUT SAMAGRI TOGGLE PILL ON CARD */}
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
        <span className="price-tag">From ₹{displayPrice?.toLocaleString('en-IN')}</span>
        <span className="price-type-sub">{withSamagri ? '(With Kit)' : '(Without Kit)'}</span>
      </div>

      <button 
        type="button" 
        className="btn-card-book" 
        onClick={() => onBook(pooja.id, withSamagri)}
      >
        Book Now
      </button>
    </div>
  );
}
