'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import BookingModal from '@/components/ui/BookingModal';
import AuthModal from '@/components/ui/AuthModal';
import { getPanchangForCity } from '@/data/panchangData';

export default function DevoteeDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'book_new', 'samagri_checklist', 'profile'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings(user?.id ? { clientId: user.id } : {});
      setBookings(res.data || []);
    } catch (e) {
      console.warn('Could not load bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = (booking) => {
    alert(`📜 Devotional Sankalp Patrika & Muhurat Receipt\n\nBooking Code: ${booking.bookingCode}\nPooja: ${booking.poojaTitle}\nPackage: ${booking.withSamagri ? 'With 100% Pure Samagri Kit' : 'Pandit Only'}\nDate: ${booking.bookingDate}\nMuhurat: ${booking.timeSlot}\nDakshina: ₹${booking.totalAmount}\nStatus: ${booking.status}\n\nBlessings from ShraddhaSetu.`);
  };

  return (
    <div className="portal-page devotee-portal-theme">
      <TopBar onOpenAuth={() => setAuthModalOpen(true)} />
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="portal-main-container">
        {/* DEVOTEE WELCOME BANNER */}
        <section className="portal-banner-card devotee-banner">
          <div className="banner-left">
            <span className="role-tag-pill">🙏 Devotee / Yajman Portal</span>
            <h2>Namaste, {user?.name || 'Rameshwar Ji'}!</h2>
            <p>Track your sacred rituals, consult your assigned Vedic Pandit, and prepare your Sankalp details.</p>
          </div>
          <div className="banner-right-actions">
            <button
              type="button"
              className="btn-portal-action"
              onClick={() => setBookingModalOpen(true)}
            >
              <span>🕉️</span> Book a New Pooja
            </button>
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
            <span className="metric-icon">🔥</span>
            <div className="metric-data">
              <strong>{bookings.length}</strong>
              <span>Total Pujas Booked</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">🚩</span>
            <div className="metric-data">
              <strong>{bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'ASSIGNED').length}</strong>
              <span>Active Muhurats</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">📦</span>
            <div className="metric-data">
              <strong>{bookings.filter(b => b.withSamagri).length}</strong>
              <span>With Samagri Kits</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">📍</span>
            <div className="metric-data">
              <strong>{user?.city || 'Varanasi'}</strong>
              <span>Registered City</span>
            </div>
          </div>
        </div>

        {/* PORTAL NAVIGATION TABS */}
        <div className="portal-tabs-nav">
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            📋 My Sacred Bookings ({bookings.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === 'panchang' ? 'active' : ''}`}
            onClick={() => setActiveTab('panchang')}
          >
            📅 आज का पंचांग व शुभ मुहूर्त
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === 'samagri_checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('samagri_checklist')}
          >
            🌿 DIY Samagri Checklist (Pandit Only)
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            🪔 Sankalp &amp; Gotra Profile
          </button>
        </div>

        {/* TAB 1: MY SACRED BOOKINGS */}
        {activeTab === 'bookings' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <h3>Your Scheduled Pujas &amp; Ceremonies</h3>
              <button
                type="button"
                className="btn-refresh-sm"
                onClick={loadBookings}
                disabled={loading}
              >
                🔄 Refresh Status
              </button>
            </div>

            {loading ? (
              <div className="portal-loading-box">Loading your sacred bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="portal-empty-box">
                <span style={{ fontSize: '40px' }}>🕉️</span>
                <h4>No Pujas Booked Yet</h4>
                <p>Invite divine grace into your home by booking a verified Vedic Pandit.</p>
                <button
                  type="button"
                  className="btn-portal-action"
                  style={{ marginTop: '12px' }}
                  onClick={() => setBookingModalOpen(true)}
                >
                  Book Your First Pooja
                </button>
              </div>
            ) : (
              <div className="bookings-cards-list">
                {bookings.map((b) => (
                  <div key={b.id} className="devotee-booking-card">
                    <div className="booking-card-top">
                      <div className="bkg-title-group">
                        <span className="bkg-code-badge">{b.bookingCode || 'SS-108'}</span>
                        <h4 className="bkg-pooja-title">{b.poojaTitle}</h4>
                        <span className="bkg-occasion-sub">{b.occasion || 'Devotional Puja'}</span>
                      </div>
                      <div className="bkg-status-box">
                        <span className={`status-pill pill-${b.status?.toLowerCase()}`}>
                          {b.status === 'ASSIGNED' ? '✓ Pandit Assigned' : (b.status === 'CONFIRMED' ? '⏳ Pandit Matching' : b.status)}
                        </span>
                        <strong className="bkg-amount">₹{b.totalAmount?.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className="booking-meta-grid">
                      <div className="meta-item">
                        <strong>📅 Muhurat Date:</strong>
                        <span>{b.bookingDate}</span>
                      </div>
                      <div className="meta-item">
                        <strong>⏰ Time Slot:</strong>
                        <span>{b.timeSlot || 'Morning Muhurat (09:00 AM)'}</span>
                      </div>
                      <div className="meta-item">
                        <strong>📍 Location:</strong>
                        <span>{b.city}</span>
                      </div>
                      <div className="meta-item">
                        <strong>📦 Package Selected:</strong>
                        <span className={b.withSamagri ? 'highlight-with-samagri' : 'highlight-pandit-only'}>
                          {b.withSamagri ? 'With 100% Pure Vedic Samagri Kit' : 'Pandit Only (DIY Samagri)'}
                        </span>
                      </div>
                    </div>

                    {/* ASSIGNED PANDIT SECTION */}
                    <div className="assigned-pandit-bar">
                      <div className="pandit-info-mini">
                        <span className="acharya-icon">🕉️</span>
                        <div>
                          <strong>{b.assignedPanditName ? `Assigned Pandit: ${b.assignedPanditName}` : 'Assigning Certified Gurukul Pandit...'}</strong>
                          <p>{b.assignedPanditPhone ? `Contact: ${b.assignedPanditPhone} (Call for Gotra confirmation)` : 'Our Acharya coordinator will match an available Pandit in your city.'}</p>
                        </div>
                      </div>

                      {b.assignedPanditPhone && (
                        <div className="pandit-contact-actions">
                          <a href={`tel:${b.assignedPanditPhone}`} className="btn-call-pandit">
                            📞 Call Pandit Ji
                          </a>
                          <a href={`https://wa.me/${b.assignedPanditPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn-wa-pandit">
                            💬 WhatsApp
                          </a>
                        </div>
                      )}
                    </div>

                    {b.specialNotes && (
                      <div className="special-notes-box">
                        <strong>Sankalp Notes:</strong> {b.specialNotes}
                      </div>
                    )}

                    <div className="booking-card-footer">
                      <button
                        type="button"
                        className="btn-print-receipt"
                        onClick={() => handlePrintReceipt(b)}
                      >
                        📜 Download Sankalp Patrika
                      </button>
                      <button
                        type="button"
                        className="btn-book-again"
                        onClick={() => setBookingModalOpen(true)}
                      >
                        Book Another Ritual
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: DAILY PANCHANG & MUHURAT */}
        {activeTab === 'panchang' && (() => {
          const panchang = getPanchangForCity(user?.city?.toLowerCase()?.includes('delhi') ? 'delhi' : (user?.city?.toLowerCase()?.includes('mumbai') ? 'mumbai' : 'varanasi'));
          return (
            <section className="portal-tab-content devotee-panchang-pane">
              <div className="tab-header-flex">
                <div>
                  <span className="badge-diy">🕉️ दैनिक वैदिक पंचांग</span>
                  <h3>{panchang.formattedDate}</h3>
                  <p className="tab-desc">नगर: <strong>{panchang.city.name}</strong> • विक्रम संवत {panchang.samvat.vikram.split(' ')[0]} • {panchang.samvat.paksha}</p>
                </div>
                <Link href="/panchang" className="btn-portal-action">
                  सम्पूर्ण पंचांग पृष्ठ खोलें →
                </Link>
              </div>

              {/* 4 QUICK PILLARS */}
              <div className="portal-panchang-grid-4">
                <div className="pillar-tile">
                  <span className="lbl">तिथि:</span>
                  <strong>{panchang.core.tithi.name}</strong>
                  <small>{panchang.core.tithi.endTime}</small>
                </div>
                <div className="pillar-tile">
                  <span className="lbl">नक्षत्र:</span>
                  <strong>{panchang.core.nakshatra.name}</strong>
                  <small>{panchang.core.nakshatra.endTime}</small>
                </div>
                <div className="pillar-tile">
                  <span className="lbl">योग व करण:</span>
                  <strong>{panchang.core.yoga.name}</strong>
                  <small>{panchang.core.karana.name}</small>
                </div>
                <div className="pillar-tile">
                  <span className="lbl">सूर्योदय / सूर्यास्त:</span>
                  <strong>{panchang.astronomy.sunrise} / {panchang.astronomy.sunset}</strong>
                  <small>{panchang.astronomy.sunSign}</small>
                </div>
              </div>

              {/* TIMINGS COMPARISON */}
              <div className="portal-muhurats-row">
                <div className="muhurat-mini-box box-shubh">
                  <h4>✨ आज के श्रेष्ठ शुभ मुहूर्त</h4>
                  <div className="muhurat-mini-list">
                    {panchang.shubhMuhurat.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="mini-item">
                        <span>{item.name}:</span>
                        <strong>{item.time}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="muhurat-mini-box box-ashubh">
                  <h4>⚠️ वर्जित काल (अशुभ समय)</h4>
                  <div className="muhurat-mini-list">
                    {panchang.ashubhKaal.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="mini-item">
                        <span>{item.name}:</span>
                        <strong className="text-danger">{item.time}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* TAB 2: DIY SAMAGRI CHECKLIST */}
        {activeTab === 'samagri_checklist' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <h3>Vedic Samagri Checklist for "Pandit Only" Bookings</h3>
              <span className="badge-diy">DIY Arrangement Guide</span>
            </div>
            <p className="tab-desc">
              If you opted for <strong>"Pandit Only"</strong>, please keep these authentic items ready at your home before Pandit Ji arrives:
            </p>

            <div className="checklist-grid">
              <div className="checklist-category-card">
                <h4>🪔 Essential Abhishek &amp; Hawan Items</h4>
                <ul>
                  <li>Pure Desi Cow Ghee (Bilona A2) - 500g</li>
                  <li>Original Gangajal &amp; Fresh Gulab Jal</li>
                  <li>Dry Mango Wood Samidha Sticks (1 kg)</li>
                  <li>Havan Kund (Copper or Iron)</li>
                  <li>Pure Bhimseni Camphor (Karpoor) - 50g</li>
                  <li>Dhoop Cones &amp; Agarbatte</li>
                </ul>
              </div>

              <div className="checklist-category-card">
                <h4>🌾 Puja Thali &amp; Tilak Samagri</h4>
                <ul>
                  <li>Roli (Kumkum), Haldi, and Chandan Paste</li>
                  <li>Akshat (Unbroken washed rice grains)</li>
                  <li>Pooja Supari (11 pieces) &amp; Clove/Cardamom</li>
                  <li>Janeu pairs (2 sets)</li>
                  <li>Kalava / Sacred Red Mauli Thread</li>
                  <li>Yellow or Red Cotton Chowki Cloth</li>
                </ul>
              </div>

              <div className="checklist-category-card">
                <h4>🥥 Fresh Offerings &amp; Prasad</h4>
                <ul>
                  <li>Fresh Pan Leaves (Paan Ke Patte - 7 pcs)</li>
                  <li>Mango Leaves (Aam Ke Patte for Kalash)</li>
                  <li>Water Coconut with Jata (Nariyal)</li>
                  <li>Seasonal Fruits (5 varieties including Banana)</li>
                  <li>Panchamrit (Milk, Curd, Ghee, Honey, Sugar)</li>
                  <li>Kheer / Halwa / Sweets for Bhog</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: DEVOTEE GOTRA & PROFILE */}
        {activeTab === 'profile' && (
          <section className="portal-tab-content">
            <h3>Devotee &amp; Family Sankalp Profile</h3>
            <p className="tab-desc">This information is chanted by Pandit Ji during the opening Vedic Sankalp.</p>

            <div className="profile-details-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Primary Devotee Name</label>
                  <input type="text" readOnly value={user?.name || 'Rameshwar Devotee'} />
                </div>
                <div className="form-group">
                  <label>Family Gotra</label>
                  <input type="text" defaultValue="Kashyapa Gotra" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Janma Nakshatra</label>
                  <input type="text" defaultValue="Rohini Nakshatra" />
                </div>
                <div className="form-group">
                  <label>Operating City / Address</label>
                  <input type="text" defaultValue={user?.city || 'Varanasi, UP'} />
                </div>
              </div>

              <div className="form-group">
                <label>Family Members for Live Sankalp</label>
                <textarea rows={3} defaultValue="1. Rameshwar Sharma (Yajman)&#10;2. Sunita Sharma (Dharampatni)&#10;3. Aryan Sharma (Putra)" />
              </div>

              <button
                type="button"
                className="btn-portal-action"
                onClick={() => alert('✓ Gotra and family Sankalp details updated for upcoming rituals!')}
              >
                Save Sankalp Details
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <BookingModal
        isOpen={bookingModalOpen}
        initialPoojaId="grah-shanti"
        initialWithSamagri={true}
        onClose={() => {
          setBookingModalOpen(false);
          loadBookings();
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialRole="CLIENT"
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
