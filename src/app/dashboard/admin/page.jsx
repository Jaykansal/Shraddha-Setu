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
import { POOJA_SERVICES } from '@/data/poojas';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('verification'); // 'verification', 'all_bookings', 'catalog'
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [bkgRes, panditRes, statsRes] = await Promise.all([
        api.getBookings(),
        api.getPandits(),
        api.getStats(),
      ]);
      setBookings(bkgRes.data || []);
      setPandits(panditRes.data || []);
      setStats(statsRes.data || null);
    } catch (e) {
      console.warn('Admin load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPandit = async (panditId, verifyStatus) => {
    await api.verifyPandit(panditId, verifyStatus);
    alert(`✓ Pandit verification status updated to: ${verifyStatus ? 'VERIFIED' : 'PENDING'}`);
    loadAdminData();
  };

  // 1. AUTH LOADING STATE
  if (authLoading) {
    return (
      <div className="portal-page admin-portal-theme">
        <TopBar onOpenAuth={() => setAuthModalOpen(true)} />
        <Navbar onOpenAuth={() => setAuthModalOpen(true)} onOpenBooking={() => {}} />
        <main className="portal-main-container">
          <div className="portal-loading-box">
            <span className="portal-spinner">🏛️</span>
            <p>Verifying Administrative Credentials...</p>
          </div>
        </main>
        <Footer onOpenAuth={() => setAuthModalOpen(true)} />
      </div>
    );
  }

  // 2. UNAUTHENTICATED OR NON-ADMIN ACCESS GATE
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="portal-page admin-portal-theme">
        <TopBar onOpenAuth={() => setAuthModalOpen(true)} />
        <Navbar onOpenAuth={() => setAuthModalOpen(true)} onOpenBooking={() => {}} />

        <main className="portal-main-container">
          <div className="portal-lock-wrapper">
            <div className="portal-auth-card">
              <div className="auth-icon-circle">🏛️</div>
              <h2>Mandir Samiti Admin Console</h2>
              <p className="auth-card-subtitle">
                {user
                  ? `You are currently signed in as "${user.name}" (${user.role}). This console requires verified Administrator clearance.`
                  : 'Please sign in with your administrative credentials to manage pan-India Vedic operations, verify pandit certifications, and govern Muhurat assignments.'}
              </p>

              <div className="auth-card-actions">
                <button
                  type="button"
                  className="btn-portal-primary-auth"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <span>🔐</span> {user ? 'Switch to Admin Account' : 'Sign In as Administrator'}
                </button>
                <Link href="/" className="btn-portal-back-home">
                  ← Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer onOpenAuth={() => setAuthModalOpen(true)} />

        <AuthModal
          isOpen={authModalOpen}
          initialRole="ADMIN"
          redirectUrl="/dashboard/admin"
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  const pendingPandits = pandits.filter(p => !p.isVerified);
  const verifiedPandits = pandits.filter(p => p.isVerified);

  return (
    <div className="portal-page admin-portal-theme">
      <TopBar onOpenAuth={() => setAuthModalOpen(true)} />
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} onOpenBooking={() => {}} />

      <main className="portal-main-container">
        {/* ADMIN HEADER BANNER */}
        <section className="portal-banner-card admin-banner">
          <div className="banner-left">
            <span className="role-tag-pill admin-tag">🏛️ Mandir Samiti Admin Console</span>
            <h2>{user?.name || 'ShraddhaSetu Central Administration'}</h2>
            <p>Pan-India Vedic operations desk: Gurukul credential verification, Muhurat assignment, and ceremony governance.</p>
          </div>
          <div className="banner-right-actions">
            <button type="button" className="btn-portal-action" onClick={loadAdminData}>
              🔄 Sync Real-Time Data
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

        {/* ADMIN METRICS */}
        <div className="portal-metrics-grid">
          <div className="metric-card metric-admin">
            <span className="metric-icon">🕉️</span>
            <div className="metric-data">
              <strong>{pandits.length} Pandits</strong>
              <span>({pendingPandits.length} Awaiting Verification)</span>
            </div>
          </div>
          <div className="metric-card metric-admin">
            <span className="metric-icon">📜</span>
            <div className="metric-data">
              <strong>{bookings.length + 10450}</strong>
              <span>Nationwide Pujas Registered</span>
            </div>
          </div>
          <div className="metric-card metric-admin">
            <span className="metric-icon">📦</span>
            <div className="metric-data">
              <strong>100% Pure</strong>
              <span>Vedic Samagri Quality Rating</span>
            </div>
          </div>
          <div className="metric-card metric-admin">
            <span className="metric-icon">📍</span>
            <div className="metric-data">
              <strong>500+ Cities</strong>
              <span>Pan-India Coverage</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="portal-tabs-nav">
          <button
            type="button"
            className={`portal-tab-btn tab-admin ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            🛡️ Pandit Verification Queue ({pendingPandits.length} Pending)
          </button>
          <button
            type="button"
            className={`portal-tab-btn tab-admin ${activeTab === 'all_bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('all_bookings')}
          >
            📋 All Nationwide Bookings ({bookings.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn tab-admin ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            🪔 Pooja Catalog &amp; Pricing
          </button>
        </div>

        {/* TAB 1: PANDIT VERIFICATION */}
        {activeTab === 'verification' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <div>
                <h3>Gurukul Degree &amp; Lineage Verification Desk</h3>
                <p className="tab-desc">Review Gurukul Vidyapeeth credentials, oral test reports, and Karmakand experience before granting certified status.</p>
              </div>
            </div>

            <div className="admin-pandit-table-box">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pandit Name</th>
                    <th>Gurukul / Vidyapeeth</th>
                    <th>Specialization</th>
                    <th>City / Exp</th>
                    <th>Verification Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pandits.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                        <div style={{ fontSize: '11px', color: '#666' }}>{p.phone} • {p.email}</div>
                      </td>
                      <td>{p.gurukul || 'Sampurnanand Sanskrit Vishwavidyalaya'}</td>
                      <td>{p.vedicSpecialization || 'Karmakand & Havan'}</td>
                      <td>{p.city} ({p.experienceYears || 10} yrs)</td>
                      <td>
                        {p.isVerified ? (
                          <span className="status-pill pill-assigned">✓ Certified</span>
                        ) : (
                          <span className="status-pill pill-pending">⏳ Pending Review</span>
                        )}
                      </td>
                      <td>
                        {p.isVerified ? (
                          <button
                            type="button"
                            className="btn-admin-action btn-revoke"
                            onClick={() => handleVerifyPandit(p.id, false)}
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-admin-action btn-verify"
                            onClick={() => handleVerifyPandit(p.id, true)}
                          >
                            Approve &amp; Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: ALL BOOKINGS */}
        {activeTab === 'all_bookings' && (
          <section className="portal-tab-content">
            <div className="tab-header-flex">
              <h3>Nationwide Puja Operations Monitor</h3>
              <button type="button" className="btn-refresh-sm" onClick={loadAdminData}>
                🔄 Refresh
              </button>
            </div>

            <div className="admin-pandit-table-box">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code / Date</th>
                    <th>Puja Ritual</th>
                    <th>Devotee Details</th>
                    <th>City</th>
                    <th>Samagri Option</th>
                    <th>Assigned Pandit</th>
                    <th>Dakshina</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <span className="bkg-code-badge">{b.bookingCode}</span>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{b.bookingDate}</div>
                      </td>
                      <td>
                        <strong>{b.poojaTitle}</strong>
                        <div style={{ fontSize: '11px', color: '#888' }}>{b.occasion}</div>
                      </td>
                      <td>
                        <strong>{b.clientName}</strong>
                        <div style={{ fontSize: '11px', color: '#666' }}>{b.clientPhone}</div>
                      </td>
                      <td>{b.city}</td>
                      <td>
                        <span className={b.withSamagri ? 'highlight-with-samagri' : 'highlight-pandit-only'}>
                          {b.withSamagri ? 'With Full Kit' : 'Pandit Only'}
                        </span>
                      </td>
                      <td>{b.assignedPanditName || <em style={{ color: '#E88B00' }}>Unassigned</em>}</td>
                      <td><strong>₹{b.totalAmount?.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <span className={`status-pill pill-${b.status?.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: POOJA CATALOG */}
        {activeTab === 'catalog' && (
          <section className="portal-tab-content">
            <h3>Master Pooja Services &amp; Samagri Price Management</h3>
            <p className="tab-desc">Prices are regulated according to Vedic Vidwat Parishad standards.</p>

            <div className="catalog-admin-grid">
              {POOJA_SERVICES.map((p) => (
                <div key={p.id} className="catalog-admin-card">
                  <div className="cat-top">
                    <h4>{p.title}</h4>
                    <span className="cat-badge">{p.category}</span>
                  </div>
                  <p>{p.description}</p>
                  <div className="cat-pricing-box">
                    <div>
                      <span>Pandit Only Dakshina:</span>
                      <strong>₹{p.priceWithoutSamagri?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span>100% Pure Samagri Kit:</span>
                      <strong>₹{p.samagriCost?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '6px' }}>
                      <span>Total with Samagri:</span>
                      <strong style={{ color: '#801318' }}>₹{p.priceWithSamagri?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer onOpenAuth={() => setAuthModalOpen(true)} />

      <AuthModal
        isOpen={authModalOpen}
        initialRole="ADMIN"
        redirectUrl="/dashboard/admin"
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
