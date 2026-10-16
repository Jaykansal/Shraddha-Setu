'use client';

import { useState } from 'react';
import { POOJA_SERVICES } from '@/data/poojas';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function SearchBookingWidget({ onSearch }) {
  const [pooja, setPooja] = useState('');
  const [occasion, setOccasion] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-10-22');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ pooja, occasion, location, date });
  };

  return (
    <div className="search-widget-wrapper">
      <form className="search-widget-card" onSubmit={handleSubmit}>
        {/* 1. Select Pooja */}
        <div className="search-field">
          <div className="field-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2C10.5 4.5 9 8 9 11c0 2.2 1.3 4 3 4s3-1.8 3-4c0-3-1.5-6.5-3-9zm-4.5 9.5C6.4 9 4.5 8 3 8c.5 3 2.5 5.5 5 6.5-.5-1-1-2-1-3zm9 0c0 1-.5 2-1 3 2.5-1 4.5-3.5 5-6.5-1.5 0-3.4 1-4.5 3.5zM12 17c-2.5 0-5 1-7 3 2.5 1.5 5.5 2 7 2s4.5-.5 7-2c-2-2-4.5-3-7-3z"/></svg>
          </div>
          <div className="field-text">
            <span className="field-label">Select Pooja</span>
            <div className="field-value">
              <select value={pooja} onChange={(e) => setPooja(e.target.value)}>
                <option value="">Choose Pooja</option>
                {POOJA_SERVICES.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Select Occasion */}
        <div className="search-field">
          <div className="field-icon">
            <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
          </div>
          <div className="field-text">
            <span className="field-label">Select Occasion</span>
            <div className="field-value">
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                {SITE_CONFIG.occasions.map((occ, idx) => (
                  <option key={idx} value={occ.value}>{occ.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3. Location */}
        <div className="search-field">
          <div className="field-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <div className="field-text">
            <span className="field-label">Your Location</span>
            <div className="field-value">
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                {SITE_CONFIG.locations.map((loc, idx) => (
                  <option key={idx} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Preferred Date */}
        <div className="search-field">
          <div className="field-icon">
            <svg viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
          </div>
          <div className="field-text">
            <span className="field-label">Preferred Date</span>
            <div className="field-value">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-find-pooja">
          <span>🔍</span> Find Pandit Ji
        </button>
      </form>
    </div>
  );
}
