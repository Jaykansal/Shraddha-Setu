'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import PanditLoginForm from '@/components/portal/PanditLoginForm';

export default function PanditDashboard() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming', 'scheduled', 'earnings', 'profile'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('');

  useEffect(() => {
    if (user && user.role === 'PANDIT') {
      loadPanditBookings(true);
      const pollInterval = setInterval(() => {
        loadPanditBookings(false);
      }, 4000);

      const handleSync = () => loadPanditBookings(false);
      window.addEventListener('shraddhasetu_data_sync', handleSync);

      return () => {
        clearInterval(pollInterval);
        window.removeEventListener('shraddhasetu_data_sync', handleSync);
      };
    }
  }, [user]);

  const loadPanditBookings = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.getBookings();
      setBookings(res.data || []);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('Could not load pandit bookings:', e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // 1. AUTH LOADING STATE
  if (authLoading) {
    return (
      <div className="portal-page pandit-portal-theme">
        <TopBar onOpenAuth={() => setAuthModalOpen(true)} />
        <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
        <main className="portal-main-container">
          <div className="portal-loading-box">
            <span className="portal-spinner">🕉️</span>
            <p>Verifying Pandit Credentials...</p>
          </div>
        </main>
        <Footer onOpenAuth={() => setAuthModalOpen(true)} />
      </div>
    );
  }

  // 2. UNAUTHENTICATED OR NON-PANDIT ACCESS GATE
  if (!user || user.role !== 'PANDIT') {
    return (
      <div className="portal-dedicated-page pandit-page-background">
        <TopBar />
        <Navbar />
        <main className="dedicated-page-container">
          <PanditLoginForm redirectUrl="/dashboard/pandit" />
        </main>
        <Footer />
      </div>
    );
  }

  // 3. AUTHENTICATED PANDIT EXPERIENCE
  const currentPandit = user;

  // Filter incoming unassigned bookings vs pandit's own scheduled bookings
  const incomingRequests = bookings.filter(b => b.status === 'CONFIRMED' && !b.assignedPanditId);
  const scheduledPujas = bookings.filter(b => b.assignedPanditId === currentPandit.id || (b.status === 'ASSIGNED' && b.assignedPanditName?.includes(currentPandit.name?.split(' ')[0])));
  const completedPujas = bookings.filter(b => b.status === 'COMPLETED' && b.assignedPanditId === currentPandit.id);

  // Calculate Dakshina
  const totalEarned = (scheduledPujas.length * 1500) + (completedPujas.length * 1800) + 42000;

  const handleAcceptPuja = async (bookingId) => {
    try {
      await api.updateBookingStatus(bookingId, 'ASSIGNED', currentPandit);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shraddhasetu_data_sync'));
      }
      alert('✓ Hari Om! You have accepted and locked this auspicious Muhurat. The devotee has been notified in real time.');
      loadPanditBookings(false);
    } catch (e) {
      alert('Could not accept puja: ' + e.message);
    }
  };

  const handleMarkCompleted = async (bookingId) => {
    try {
      await api.updateBookingStatus(bookingId, 'COMPLETED', currentPandit);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shraddhasetu_data_sync'));
      }
      alert('✓ Purnaahuti! Ritual marked as successfully completed. Dakshina credited to your ledger.');
      loadPanditBookings(false);
    } catch (e) {
      alert('Could not update status: ' + e.message);
    }
  };

  return (
    <div className="portal-page pandit-portal-theme">
      <TopBar onOpenAuth={() => setAuthModalOpen(true)} />
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className="portal-main-container">
        {/* PANDIT HEADER PROFILE BANNER */}
        <section className="portal-banner-card pandit-banner">
          <div className="banner-left">
            <div className="pandit-title-row">
              <span className="role-tag-pill pandit-pill">🕉️ Acharya Portal</span>
              <span className="live-sync-indicator-pill">
                <span className="live-dot-pulse"></span> LIVE OPERATIONS DESK {lastSyncTime ? `• ${lastSyncTime}` : ''}
              </span>
              {currentPandit.isVerified ? (
                <span className="badge-verified">✓ Gurukul Certified Scholar</span>
              ) : (
                <span className="badge-pending">⏳ Verification Pending Admin Review</span>
              )}
            </div>
            <h2>{currentPandit.name}</h2>
            <p>🏛️ {currentPandit.gurukul || 'Sampurnanand Sanskrit University, Varanasi'}</p>
            <p>📜 Specialization: <strong>{currentPandit.vedicSpecialization || 'Karmakand & Vedic Anushthan'}</strong> • {currentPandit.experienceYears || 10}+ Years Practice</p>
          </div>

          <div className="banner-right-status">
            <div className="status-toggle-box">
              <span className="status-label">Current Status:</span>
              <button
                type="button"
                className={`btn-availability ${isAvailable ? 'available' : 'unavailable'}`}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                {isAvailable ? '● Available for Muhurats' : '○ Busy / Off Duty'}
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

        {/* METRICS ROW */}
        <div className="portal-metrics-grid">
          <div className="metric-card">
            <span className="metric-icon">⭐</span>
            <div className="metric-data">
              <strong>{currentPandit.rating || 5.0} / 5.0</strong>
              <span>Devotee Rating ({currentPandit.poojasConducted || 0}+ Pujas)</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">🔔</span>
            <div className="metric-data">
              <strong>{incomingRequests.length} Requests</strong>
              <span>Available in Your Region</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">📅</span>
            <div className="metric-data">
              <strong>{scheduledPujas.length} Scheduled</strong>
              <span>Upcoming Muhurats</span>
            </div>
          </div>
          <div className="metric-card">
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
            className={`portal-tab-btn ${activeTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            🔔 Available Requests in City ({incomingRequests.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            📅 My Scheduled Ceremonies ({scheduledPujas.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            🪙 Dakshina &amp; Payouts
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            📜 Gurukul Credentials
          </button>
        </div>

        {/* TAB 1: INCOMING REQUESTS */}
        {activeTab === 'incoming' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <div>
                <h3>Unassigned Puja Requests in Your Region</h3>
                <p className="tab-desc">Review ceremony requirements, date, and Dakshina. Click "Accept &amp; Lock Muhurat" to take charge.</p>
              </div>
              <button type="button" className="btn-refresh" onClick={loadPanditBookings}>
                🔄 Refresh List
              </button>
            </div>

            {loading ? (
              <div className="tab-loading">Checking for local puja requests...</div>
            ) : incomingRequests.length === 0 ? (
              <div className="empty-tab-state">
                <span className="empty-icon">🚩</span>
                <h4>All Current Muhurats are Assigned</h4>
                <p>New booking requests from devotees in your city will appear here in real-time.</p>
              </div>
            ) : (
              <div className="incoming-requests-list">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="request-card-pandit">
                    <div className="request-top-info">
                      <div className="pooja-title-wrap">
                        <span className="badge-new-request">New Booking</span>
                        <h4>{req.poojaTitle}</h4>
                        <span className="req-booking-code">{req.bookingCode}</span>
                      </div>
                      <div className="req-dakshina-box">
                        <span className="dakshina-label">Pandit Dakshina:</span>
                        <strong className="dakshina-amount">₹{req.basePrice || 1500}</strong>
                        {req.withSamagri && <span className="samagri-provided-tag">✓ Samagri Kit Included</span>}
                      </div>
                    </div>

                    <div className="request-details-grid">
                      <div className="detail-item">
                        <span className="lbl">Devotee / Yajman:</span>
                        <strong>{req.clientName}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="lbl">Auspicious Date:</span>
                        <strong>{req.bookingDate}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="lbl">Preferred Muhurat:</span>
                        <strong>{req.timeSlot}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="lbl">Location / City:</span>
                        <strong>{req.city}</strong>
                      </div>
                    </div>

                    {req.specialNotes && (
                      <div className="req-special-notes">
                        <span>Sankalp Notes:</span> {req.specialNotes}
                      </div>
                    )}

                    <div className="request-action-row">
                      <button
                        type="button"
                        className="btn-accept-muhurat"
                        onClick={() => handleAcceptPuja(req.id)}
                      >
                        <span>✓</span> Accept &amp; Lock Muhurat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: SCHEDULED CEREMONIES */}
        {activeTab === 'scheduled' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <div>
                <h3>Your Active &amp; Scheduled Ceremonies ({scheduledPujas.length})</h3>
                <p className="tab-desc">Contact the Yajman to confirm Gotra and mark completed after Purnaahuti.</p>
              </div>
            </div>

            {scheduledPujas.length === 0 ? (
              <div className="empty-tab-state">
                <span className="empty-icon">📅</span>
                <h4>No Ceremonies Scheduled Currently</h4>
                <p>Accept booking requests from the "Available Requests" tab to view them here.</p>
              </div>
            ) : (
              <div className="scheduled-pujas-grid">
                {scheduledPujas.map((item) => (
                  <div key={item.id} className="scheduled-card">
                    <div className="sched-header">
                      <div>
                        <span className="sched-badge">Status: {item.status}</span>
                        <h4>{item.poojaTitle}</h4>
                        <span className="sched-code">{item.bookingCode}</span>
                      </div>
                      <span className="sched-amount">₹{item.basePrice || 1500} Dakshina</span>
                    </div>

                    <div className="sched-meta">
                      <p><strong>Yajman:</strong> {item.clientName} ({item.clientPhone})</p>
                      <p><strong>Muhurat:</strong> {item.bookingDate} • {item.timeSlot}</p>
                      <p><strong>City:</strong> {item.city}</p>
                    </div>

                    <div className="sched-actions-row">
                      <a href={`tel:${item.clientPhone}`} className="btn-call-yajman">
                        📞 Call Yajman
                      </a>
                      <a
                        href={`https://wa.me/${item.clientPhone?.replace(/[^0-9]/g, '')}?text=Hari%20Om%20${encodeURIComponent(item.clientName)}%20Ji,%20I%20am%20Pt.%20${encodeURIComponent(currentPandit.name)}%20for%20your%20${encodeURIComponent(item.poojaTitle)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-whatsapp-yajman"
                      >
                        💬 WhatsApp
                      </a>
                      <button
                        type="button"
                        className="btn-purnaahuti"
                        onClick={() => handleMarkCompleted(item.id)}
                      >
                        🕉️ Mark Completed (Purnaahuti)
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
            <h3>Dakshina Account &amp; Weekly Payout Ledger</h3>
            <p className="tab-desc">Direct bank transfers are processed every Monday with 0% platform commission deductions.</p>

            <div className="earnings-summary-cards">
              <div className="earn-card">
                <span>Available for Transfer</span>
                <strong>₹{((scheduledPujas.length * 1500) + (completedPujas.length * 1800)).toLocaleString('en-IN')}</strong>
                <small>Next cycle: Monday 10:00 AM</small>
              </div>
              <div className="earn-card">
                <span>Lifetime Dakshina</span>
                <strong>₹{totalEarned.toLocaleString('en-IN')}</strong>
                <small>100% Direct Yajman Dakshina</small>
              </div>
              <div className="earn-card">
                <span>Direct Bank Account</span>
                <strong>HDFC Bank **** 4812</strong>
                <small>IFSC: HDFC0001242 (Verified)</small>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <section className="portal-tab-content">
            <h3>Acharya Gurukul Credentials &amp; Shastra Degrees</h3>
            <p className="tab-desc">Your Gurukul certification is publicly visible to devotees during booking.</p>

            <div className="profile-credentials-box">
              <div className="cred-row">
                <span className="cred-label">Vedic Name:</span>
                <strong>{currentPandit.name}</strong>
              </div>
              <div className="cred-row">
                <span className="cred-label">Registered Phone:</span>
                <strong>{currentPandit.phone}</strong>
              </div>
              <div className="cred-row">
                <span className="cred-label">Email:</span>
                <strong>{currentPandit.email}</strong>
              </div>
              <div className="cred-row">
                <span className="cred-label">Alma Mater / Gurukul:</span>
                <strong>{currentPandit.gurukul || 'Sampurnanand Sanskrit University, Varanasi'}</strong>
              </div>
              <div className="cred-row">
                <span className="cred-label">Vedic Disciplines:</span>
                <strong>{currentPandit.vedicSpecialization || 'Navagraha Shanti, Rudrabhishek & Griha Pravesh'}</strong>
              </div>
              <div className="cred-row">
                <span className="cred-label">Shastra Experience:</span>
                <strong>{currentPandit.experienceYears || 18} Years Classical Practice</strong>
              </div>
              <div className="cred-row">
                <span className="cred-label">Languages Known:</span>
                <strong>Hindi, Sanskrit, Bhojpuri</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
