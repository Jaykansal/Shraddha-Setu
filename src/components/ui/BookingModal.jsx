'use client';

import { useState } from 'react';
import { POOJA_SERVICES } from '@/data/poojas';

export default function BookingModal({ isOpen, initialPoojaId, initialWithSamagri = true, onClose }) {
  const selectedPooja = POOJA_SERVICES.find(p => p.id === initialPoojaId || p.title === initialPoojaId) 
    || POOJA_SERVICES[0];

  const [poojaId, setPoojaId] = useState(selectedPooja.id);
  const [withSamagri, setWithSamagri] = useState(initialWithSamagri);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [date, setDate] = useState('2026-10-18');
  const [timeSlot, setTimeSlot] = useState('Morning Auspicious Muhurat (09:00 AM)');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen) return null;

  const currentPooja = POOJA_SERVICES.find(p => p.id === poojaId) || selectedPooja;
  const basePrice = currentPooja.priceWithoutSamagri || 1500;
  const samagriCost = currentPooja.samagriCost || 600;
  const totalAmount = withSamagri ? (basePrice + samagriCost) : basePrice;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          clientPhone: phone,
          poojaId: currentPooja.id,
          withSamagri,
          bookingDate: date,
          city,
          occasion: 'Devotional Puja'
        }),
      });

      const data = await res.json();
      setConfirmedBooking(data.booking || {
        clientName: name,
        poojaTitle: currentPooja.title,
        withSamagri,
        totalAmount,
        bookingDate: date,
        city
      });
    } catch (err) {
      console.error(err);
      setConfirmedBooking({
        clientName: name,
        poojaTitle: currentPooja.title,
        withSamagri,
        totalAmount,
        bookingDate: date,
        city
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="booking-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-x" onClick={onClose}>✕</button>

        {confirmedBooking ? (
          <div className="booking-success-view">
            <span className="success-icon-badge">🕉️</span>
            <h3>Sankalp Confirmed!</h3>
            <p className="success-sub">
              Auspicious blessings! Your pooja request has been registered with ShraddhaSetu.
            </p>
            <div className="booking-summary-box">
              <div className="summary-row">
                <span>Pooja:</span>
                <strong>{confirmedBooking.poojaTitle}</strong>
              </div>
              <div className="summary-row">
                <span>Samagri Package:</span>
                <strong className={confirmedBooking.withSamagri ? 'tag-with-samagri' : 'tag-without-samagri'}>
                  {confirmedBooking.withSamagri ? 'With Pure Vedic Samagri Kit' : 'Pandit Only (Without Samagri)'}
                </strong>
              </div>
              <div className="summary-row">
                <span>Devotee:</span>
                <span>{confirmedBooking.clientName}</span>
              </div>
              <div className="summary-row">
                <span>Date & City:</span>
                <span>{confirmedBooking.bookingDate} • {confirmedBooking.city}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Dakshina:</span>
                <strong className="price-highlight">₹{confirmedBooking.totalAmount?.toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#777', marginTop: '12px' }}>
              Our Vedic Acharya coordinator will call on {phone} within 2 hours to confirm Gotra, Nakshatra, and Muhurat timing.
            </p>
            <button type="button" className="btn-modal-close" onClick={onClose}>
              Done & Close
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h3>Book Vedic Pooja Ceremony</h3>
              <p>Certified Gurukul Pandits • Complete Vedic Rituals • Live Sankalp</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form">
              {/* Select Pooja */}
              <div className="form-group">
                <label>Selected Pooja Service</label>
                <select value={poojaId} onChange={(e) => setPoojaId(e.target.value)}>
                  {POOJA_SERVICES.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.duration})</option>
                  ))}
                </select>
              </div>

              {/* CRITICAL FEATURE: WITH SAMAGRI VS WITHOUT SAMAGRI TOGGLE */}
              <div className="samagri-selection-container">
                <label className="samagri-label-title">Pooja Samagri Option (सामग्री विकल्प):</label>
                <div className="samagri-options-grid">
                  {/* Option A: With Samagri */}
                  <label className={`samagri-option-card ${withSamagri ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="samagriOption" 
                      checked={withSamagri === true} 
                      onChange={() => setWithSamagri(true)} 
                    />
                    <div className="option-info">
                      <div className="option-top">
                        <strong>With Complete Vedic Samagri</strong>
                        <span className="badge-recommend">Recommended</span>
                      </div>
                      <p>100% pure A2 Ghee, fresh Havan wood, Gangajal, herbs & prasad included.</p>
                      <div className="option-price">₹{currentPooja.priceWithSamagri?.toLocaleString('en-IN')}</div>
                    </div>
                  </label>

                  {/* Option B: Without Samagri */}
                  <label className={`samagri-option-card ${!withSamagri ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="samagriOption" 
                      checked={withSamagri === false} 
                      onChange={() => setWithSamagri(false)} 
                    />
                    <div className="option-info">
                      <div className="option-top">
                        <strong>Without Samagri (Pandit Ji Only)</strong>
                      </div>
                      <p>Only Vedic Pandit arrives. Samagri checklist will be shared with you to arrange.</p>
                      <div className="option-price">₹{currentPooja.priceWithoutSamagri?.toLocaleString('en-IN')}</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Devotee Details */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Devotee Name (यजमान का नाम) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Rameshwar Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp / Mobile No *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Pooja Date (तारीख) *</label>
                  <input 
                    type="date" 
                    required 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>City & State (शहर) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Varanasi, Delhi NCR"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              {/* Pricing breakdown pill */}
              <div className="price-breakdown-bar">
                <span>Pandit Dakshina: ₹{basePrice}</span>
                <span>•</span>
                <span>Samagri Kit: {withSamagri ? `₹${samagriCost}` : '₹0 (Arranged by you)'}</span>
                <span>•</span>
                <strong>Total: ₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>

              <button type="submit" className="btn-confirm-booking" disabled={loading}>
                {loading ? 'Confirming...' : `Confirm Booking (₹${totalAmount.toLocaleString('en-IN')})`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
