'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';

export default function PanditDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming', 'scheduled', 'earnings', 'profile'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    loadPanditBookings();
  }, [user]);

  const loadPanditBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings();
      setBookings(res.data || []);
    } catch (e) {
      console.warn('Could not load pandit bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  const currentPandit = user || {
    id: 'usr_pandit_demo',
    name: 'Acharya Vidyadhar Shastri',
    phone: '+91 98234 56789',
    gurukul: 'Sampurnanand Sanskrit University, Varanasi',
    vedicSpecialization: 'Navagraha Shanti, Rudrabhishek & Griha Pravesh',
    experienceYears: 18,
    rating: 4.95,
    poojasConducted: 1420,
    city: 'Varanasi',
    isVerified: true,
  };

  // Filter incoming unassigned bookings vs pandit's own scheduled bookings
  const incomingRequests = bookings.filter(b => b.status === 'CONFIRMED' && !b.assignedPanditId);
  const scheduledPujas = bookings.filter(b => b.assignedPanditId === currentPandit.id || (b.status === 'ASSIGNED' && b.assignedPanditName?.includes(currentPandit.name?.split(' ')[0])));
  const completedPujas = bookings.filter(b => b.status === 'COMPLETED' && b.assignedPanditId === currentPandit.id);

  // Calculate Dakshina
  const totalEarned = (scheduledPujas.length * 1500) + (completedPujas.length * 1800) + 42000;

  const handleAcceptPuja = async (bookingId) => {
    try {
      await api.updateBookingStatus(bookingId, 'ASSIGNED', currentPandit);
      alert('✓ Hari Om! You have accepted and locked this auspicious Muhurat. The devotee has been notified.');
      loadPanditBookings();
    } catch (e) {
      alert('Could not accept puja: ' + e.message);
    }
  };

  const handleMarkCompleted = async (bookingId) => {
    try {
      await api.updateBookingStatus(bookingId, 'COMPLETED', currentPandit);
      alert('✓ Purnaahuti! Ritual marked as successfully completed. Dakshina credited to your ledger.');
      loadPanditBookings();
    } catch (e) {
      alert('Could not update status: ' + e.message);
    }
  };

  return (
    <div className="portal-page pandit-portal-theme">
      <TopBar onOpenAuth={() => setAuthModalOpen(true)} />
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} onOpenBooking={() => {}} />

      <main className="portal-main-container">
        {/* ACHARYA VEDIC HEADER BANNER */}
        <section className="portal-banner-card pandit-banner">
          <div className="banner-left">
            <div className="acharya-title-flex">
              <span className="role-tag-pill saffron-tag">🕉️ Acharya Portal</span>
              <span className="gurukul-verified-badge">✓ Gurukul Certified Scholar</span>
            </div>
            <h2>{currentPandit.name}</h2>
            <p className="acharya-credentials">
              🏛️ <strong>{currentPandit.gurukul || 'Sampurnanand Sanskrit Vishwavidyalaya, Kashi'}</strong>
              <br />
              📜 Specialization: <strong>{currentPandit.vedicSpecialization || 'Karmakand & Havan'}</strong> • {currentPandit.experienceYears || 18}+ Years Practice
            </p>
          </div>

          <div className="banner-right-actions">
            <div className="availability-toggle-box">
              <span className="avail-label">Current Status:</span>
              <button
                type="button"
                className={`btn-avail-toggle ${isAvailable ? 'status-online' : 'status-offline'}`}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                {isAvailable ? '● Available for Muhurats' : '○ Busy in Temple Duty'}
              </button>
            </div>
            <button
              type="button"
              className="btn-portal-outline"
              onClick={() => { logout(); router.push('/'); }}
            >
              Sign Out
            </button>
          </div>
        </section>

        {/* PANDIT METRICS */}
        <div className="portal-metrics-grid">
          <div className="metric-card metric-saffron">
            <span className="metric-icon">⭐</span>
            <div className="metric-data">
              <strong>{currentPandit.rating || 4.95} / 5.0</strong>
              <span>Devotee Rating ({currentPandit.poojasConducted || 1420}+ Pujas)</span>
            </div>
          </div>
          <div className="metric-card metric-saffron">
            <span className="metric-icon">🔔</span>
            <div className="metric-data">
              <strong>{incomingRequests.length} Requests</strong>
              <span>Available in Your Region</span>
            </div>
          </div>
          <div className="metric-card metric-saffron">
            <span className="metric-icon">📅</span>
            <div className="metric-data">
              <strong>{scheduledPujas.length} Scheduled</strong>
              <span>Upcoming Muhurats</span>
            </div>
          </div>
          <div className="metric-card metric-saffron">
            <span className="metric-icon">💰</span>
            <div className="metric-data">
              <strong>₹{totalEarned.toLocaleString('en-IN')}</strong>
              <span>Total Dakshina Received</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="portal-tabs-nav">
          <button
            type="button"
            className={`portal-tab-btn tab-saffron ${activeTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            🔔 Available Requests in City ({incomingRequests.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn tab-saffron ${activeTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            📅 My Scheduled Ceremonies ({scheduledPujas.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn tab-saffron ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            🪙 Dakshina &amp; Payouts
          </button>
          <button
            type="button"
            className={`portal-tab-btn tab-saffron ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            📜 Gurukul Credentials
          </button>
        </div>

        {/* TAB 1: INCOMING REQUESTS TO ACCEPT */}
        {activeTab === 'incoming' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <div>
                <h3>Unassigned Puja Requests in Your Region</h3>
                <p className="tab-desc">Review ceremony requirements, date, and Dakshina. Click "Accept &amp; Lock Muhurat" to take charge.</p>
              </div>
              <button type="button" className="btn-refresh-sm" onClick={loadPanditBookings}>
                🔄 Refresh List
              </button>
            </div>

            {loading ? (
              <div className="portal-loading-box">Checking sacred requests...</div>
            ) : incomingRequests.length === 0 ? (
              <div className="portal-empty-box">
                <span style={{ fontSize: '40px' }}>🚩</span>
                <h4>All Current Muhurats are Assigned</h4>
                <p>New booking requests from devotees in your city will appear here in real-time.</p>
              </div>
            ) : (
              <div className="bookings-cards-list">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="pandit-booking-card request-card">
                    <div className="bkg-top-row">
                      <div>
                        <span className="bkg-code-badge">{req.bookingCode}</span>
                        <h4 className="bkg-pooja-title">{req.poojaTitle}</h4>
                        <span className="bkg-occasion-sub">{req.occasion || 'Devotional Puja'}</span>
                      </div>
                      <div className="bkg-price-highlight">
                        <span className="dakshina-label">Base Dakshina</span>
                        <strong className="dakshina-val">₹{req.basePrice?.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className="booking-meta-grid">
                      <div className="meta-item">
                        <strong>📅 Muhurat Date:</strong>
                        <span>{req.bookingDate}</span>
                      </div>
                      <div className="meta-item">
                        <strong>⏰ Time Slot:</strong>
                        <span>{req.timeSlot}</span>
                      </div>
                      <div className="meta-item">
                        <strong>📍 Devotee Location:</strong>
                        <span>{req.city}</span>
                      </div>
                      <div className="meta-item">
                        <strong>📦 Samagri Status:</strong>
                        <span className={req.withSamagri ? 'highlight-with-samagri' : 'highlight-pandit-only'}>
                          {req.withSamagri ? 'With Pure Samagri Kit (Delivered by ShraddhaSetu)' : 'Devotee Arranging Samagri (Pandit Dakshina Only)'}
                        </span>
                      </div>
                    </div>

                    <div className="client-contact-card">
                      <div className="client-info">
                        <strong>Devotee (Yajman): {req.clientName}</strong>
                        <span>Phone: {req.clientPhone}</span>
                      </div>
                      {req.specialNotes && (
                        <p className="client-notes"><strong>Sankalp Note:</strong> {req.specialNotes}</p>
                      )}
                    </div>

                    <div className="pandit-action-footer">
                      <button
                        type="button"
                        className="btn-accept-puja"
                        onClick={() => handleAcceptPuja(req.id)}
                      >
                        ✓ Accept &amp; Lock Muhurat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: MY SCHEDULED PUJAS */}
        {activeTab === 'scheduled' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <div>
                <h3>My Scheduled Pujas &amp; Anushthans</h3>
                <p className="tab-desc">Pujas assigned to you. Call devotee prior to ceremony for Gotra confirmation.</p>
              </div>
            </div>

            {scheduledPujas.length === 0 ? (
              <div className="portal-empty-box">
                <span style={{ fontSize: '40px' }}>🕉️</span>
                <h4>No Scheduled Pujas</h4>
                <p>Accept an incoming request from the first tab to lock your calendar.</p>
              </div>
            ) : (
              <div className="bookings-cards-list">
                {scheduledPujas.map((item) => (
                  <div key={item.id} className="pandit-booking-card scheduled-card">
                    <div className="bkg-top-row">
                      <div>
                        <span className="status-pill pill-assigned">Confirmed with You</span>
                        <h4 className="bkg-pooja-title">{item.poojaTitle}</h4>
                        <span className="bkg-occasion-sub">{item.occasion} • Code: {item.bookingCode}</span>
                      </div>
                      <div className="bkg-price-highlight">
                        <span className="dakshina-label">Your Dakshina</span>
                        <strong className="dakshina-val">₹{item.basePrice?.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className="booking-meta-grid">
                      <div className="meta-item">
                        <strong>📅 Muhurat Date:</strong>
                        <span>{item.bookingDate}</span>
                      </div>
                      <div className="meta-item">
                        <strong>⏰ Time Slot:</strong>
                        <span>{item.timeSlot}</span>
                      </div>
                      <div className="meta-item">
                        <strong>📍 Address &amp; City:</strong>
                        <span>{item.city}</span>
                      </div>
                      <div className="meta-item">
                        <strong>📦 Samagri Handling:</strong>
                        <span>{item.withSamagri ? 'Platform Dispatching Kit' : 'Devotee Preparing via Checklist'}</span>
                      </div>
                    </div>

                    <div className="client-contact-card">
                      <div className="client-info">
                        <strong>Yajman: {item.clientName}</strong>
                        <span>Phone: {item.clientPhone}</span>
                      </div>
                      <div className="pandit-contact-actions">
                        <a href={`tel:${item.clientPhone}`} className="btn-call-pandit">
                          📞 Call Yajman
                        </a>
                        <a href={`https://wa.me/${item.clientPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn-wa-pandit">
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="pandit-action-footer">
                      <button
                        type="button"
                        className="btn-mark-completed"
                        onClick={() => handleMarkCompleted(item.id)}
                      >
                        🔥 Mark Ritual as Completed (Purnaahuti)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: DAKSHINA & EARNINGS */}
        {activeTab === 'earnings' && (
          <section className="portal-tab-content">
            <h3>Dakshina &amp; Payout Summary</h3>
            <p className="tab-desc">Direct bank transfers are processed every Monday following completed rituals.</p>

            <div className="earnings-summary-grid">
              <div className="earning-stat-box">
                <span>Lifetime Dakshina</span>
                <strong>₹{totalEarned.toLocaleString('en-IN')}</strong>
                <small>100% Direct Dakshina Honorarium</small>
              </div>
              <div className="earning-stat-box">
                <span>Next Weekly Payout</span>
                <strong style={{ color: '#10B981' }}>₹{(scheduledPujas.length * 1500).toLocaleString('en-IN')}</strong>
                <small>To Bank: State Bank of India (***4128)</small>
              </div>
              <div className="earning-stat-box">
                <span>Completed Anushthans</span>
                <strong>{currentPandit.poojasConducted || 1420} Ceremonies</strong>
                <small>Verified by Devotee Reviews</small>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: GURUKUL CREDENTIALS */}
        {activeTab === 'profile' && (
          <section className="portal-tab-content">
            <h3>Vedic Lineage &amp; Certified Credentials</h3>
            <p className="tab-desc">Credentials verified by the ShraddhaSetu Vidwat Parishad.</p>

            <div className="profile-details-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Acharya Full Name</label>
                  <input type="text" readOnly value={currentPandit.name} />
                </div>
                <div className="form-group">
                  <label>Veda Vidyapeeth / Gurukul</label>
                  <input type="text" readOnly value={currentPandit.gurukul || 'Sampurnanand Sanskrit University, Varanasi'} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Shastra Specialization</label>
                  <input type="text" readOnly value={currentPandit.vedicSpecialization || 'Navagraha Shanti & Griha Pravesh'} />
                </div>
                <div className="form-group">
                  <label>Veda Shakha</label>
                  <input type="text" readOnly value="Shukla Yajurveda (Madhyandina Shakha)" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Years of Practice</label>
                  <input type="text" readOnly value={`${currentPandit.experienceYears || 18} Years`} />
                </div>
                <div className="form-group">
                  <label>Verification Status</label>
                  <input type="text" readOnly value="✓ Verified by Acharya Parishad" style={{ color: '#059669', fontWeight: 'bold' }} />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        initialRole="PANDIT"
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
