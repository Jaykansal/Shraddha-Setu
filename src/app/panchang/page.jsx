'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import BookingModal from '@/components/ui/BookingModal';
import { useAuth } from '@/context/AuthContext';
import { CITIES, getPanchangForCity } from '@/data/panchangData';

export default function PanchangPage() {
  const { user, login } = useAuth();
  const [selectedCityId, setSelectedCityId] = useState('varanasi');
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'CLIENT', reason: '', redirectUrl: '/panchang' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true });
  const [activeTab, setActiveTab] = useState('muhurat'); // 'muhurat' or 'choghadiya' or 'festivals'

  const panchang = getPanchangForCity(selectedCityId);

  const handleOpenAuth = (role = 'CLIENT', reason = '', redirectUrl = '/panchang') => {
    setAuthModal({
      isOpen: true,
      role,
      reason: reason || 'दैनिक वैदिक पंचांग व शुभ मुहूर्त देखने के लिए कृपया लॉगिन करें।',
      redirectUrl
    });
  };

  return (
    <div className="app-root main-full-layout">
      <TopBar onOpenAuth={handleOpenAuth} />
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenBooking={(p, w) => setBookingModal({ isOpen: true, poojaId: p, withSamagri: w })}
      />

      <div className="panchang-page-hero">
        <div className="panchang-hero-inner">
          <span className="vedic-pill-gold">🕉️ वैदिक काल-गणना</span>
          <h1 className="panchang-title">आज का पंचांग एवं शुभ मुहूर्त</h1>
          <p className="panchang-subtitle">
            प्रामाणिक वैदिक ज्योतिष अनुसार तिथि, नक्षत्र, चौघड़िया, राहुकाल एवं अभिजीत मुहूर्त
          </p>
          <div className="panchang-date-strip">
            <span className="calendar-glyph">📅</span>
            <strong>{panchang.formattedDate}</strong>
            <span className="dot-sep">•</span>
            <span>{panchang.samvat.paksha}</span>
            <span className="dot-sep">•</span>
            <span>विक्रम संवत {panchang.samvat.vikram.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      <main className="panchang-main-container">
        {/* CITY SELECTOR STRIP */}
        <div className="city-selector-bar">
          <span className="city-bar-label">📍 नगर (City):</span>
          <div className="city-chips-list">
            {CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`city-chip ${selectedCityId === c.id ? 'active' : ''}`}
                onClick={() => setSelectedCityId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* IF USER IS NOT LOGGED IN -> GATED SACRED EXPERIENCE */}
        {!user ? (
          <div className="panchang-locked-gate-wrapper">
            {/* BLURRED PREVIEW OF REAL PANCHANG BEHIND */}
            <div className="panchang-blurred-preview" aria-hidden="true">
              <div className="panchang-summary-grid">
                <div className="panchang-card">
                  <h4>तिथि (Tithi)</h4>
                  <p className="val-tithi">{panchang.core.tithi.name}</p>
                  <p className="val-time">{panchang.core.tithi.endTime}</p>
                </div>
                <div className="panchang-card">
                  <h4>नक्षत्र (Nakshatra)</h4>
                  <p className="val-nakshatra">{panchang.core.nakshatra.name}</p>
                  <p className="val-time">{panchang.core.nakshatra.endTime}</p>
                </div>
                <div className="panchang-card">
                  <h4>शुभ मुहूर्त (Abhijit)</h4>
                  <p className="val-shubh">{panchang.shubhMuhurat[0].time}</p>
                  <p className="val-time">सर्वश्रेष्ठ मुहूर्त</p>
                </div>
                <div className="panchang-card">
                  <h4>राहुकाल (Rahu Kaal)</h4>
                  <p className="val-ashubh">{panchang.ashubhKaal[0].time}</p>
                  <p className="val-time">कार्य वर्जित</p>
                </div>
              </div>
            </div>

            {/* HIGH-CONVERSION VEDIC LOCK CARD */}
            <div className="panchang-lock-modal-card">
              <div className="lock-icon-badge">🔒</div>
              <span className="lock-tag-shree">ॐ नमः शिवाय</span>
              <h2>सम्पूर्ण पंचांग व शुभ मुहूर्त देखने के लिए लॉगिन करें</h2>
              <p className="lock-desc">
                दैनिक अभिजीत मुहूर्त, राहुकाल, दिन व रात्रि का चौघड़िया, सूर्य-चन्द्र स्थिति एवं विशेष संकल्प मुहूर्त केवल पंजीकृत यजमानों व भक्तों के लिए उपलब्ध हैं।
              </p>

              <div className="lock-benefits-list">
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>आज का सटीक <strong>अभिजीत मुहूर्त</strong> व अमृत काल</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>दिन एवं रात्रि का <strong>8 प्रहर चौघड़िया</strong></span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>राहुकाल एवं वर्जित समय का विवरण</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>पंचांग अनुसार सीधा <strong>पंडित जी से संकल्प मुहूर्त</strong> बुक करें</span>
                </div>
              </div>

              <div className="lock-action-buttons">
                <button
                  type="button"
                  className="btn-unlock-primary"
                  onClick={() => handleOpenAuth('CLIENT', 'दैनिक पंचांग व शुभ मुहूर्त देखने के लिए कृपया लॉगिन करें')}
                >
                  <span>🔐</span> लॉगिन करें / Sign In to Unlock
                </button>
                <button
                  type="button"
                  className="btn-unlock-instant"
                  onClick={() => handleOpenAuth('CLIENT', 'दैनिक पंचांग व शुभ मुहूर्त देखने के लिए कृपया निःशुल्क पंजीकरण करें')}
                >
                  <span>✨</span> नया भक्त खाता बनाएँ (Free Registration)
                </button>
              </div>

              <p className="lock-note-small">
                100% निःशुल्क पंजीकरण • सुरक्षित वैदिक काल गणना • श्रद्धासेतु प्रामाणिकता
              </p>
            </div>
          </div>
        ) : (
          /* USER IS LOGGED IN -> UNRESTRICTED FULL VEDIC PANCHANG */
          <div className="panchang-full-dashboard">
            {/* WELCOME BAR FOR LOGGED IN USER */}
            <div className="panchang-user-welcome-banner">
              <div className="welcome-text-col">
                <span className="welcome-shlok">॥ शुभम करोति कल्याणम ॥</span>
                <h3>नमस्ते {user.name} जी, आज का सम्पूर्ण वैदिक पंचांग सक्रिय है।</h3>
                <p>नगर: <strong>{panchang.city.name}</strong> • सूर्योदय: <strong>{panchang.astronomy.sunrise}</strong> • सूर्यास्त: <strong>{panchang.astronomy.sunset}</strong></p>
              </div>
              <button
                type="button"
                className="btn-book-from-panchang"
                onClick={() => setBookingModal({ isOpen: true, poojaId: 'grah-shanti', withSamagri: true })}
              >
                <span>🪔</span> आज का शुभ संकल्प बुक करें
              </button>
            </div>

            {/* ASTRONOMICAL / SAMVAT SUMMARY CARD */}
            <div className="samvat-bar-card">
              <div className="samvat-item">
                <span className="label">संवत्सर:</span>
                <span className="val">{panchang.samvat.vikram}</span>
              </div>
              <div className="samvat-item">
                <span className="label">शक संवत:</span>
                <span className="val">{panchang.samvat.shak}</span>
              </div>
              <div className="samvat-item">
                <span className="label">मास / पक्ष:</span>
                <span className="val">{panchang.samvat.monthPurnimanta} ({panchang.samvat.paksha})</span>
              </div>
              <div className="samvat-item">
                <span className="label">ऋतु व अयन:</span>
                <span className="val">{panchang.samvat.ritu} • {panchang.samvat.ayana}</span>
              </div>
              <div className="samvat-item">
                <span className="label">सूर्य/चन्द्र राशि:</span>
                <span className="val">सूर्य {panchang.astronomy.sunSign} | चन्द्र {panchang.astronomy.moonSign}</span>
              </div>
            </div>

            {/* 5 MAIN PILLARS OF PANCHANG */}
            <div className="panchang-pillars-grid">
              <div className="pillar-card card-tithi">
                <span className="pillar-num">1. तिथि</span>
                <h3>{panchang.core.tithi.name}</h3>
                <p className="pillar-sanskrit">{panchang.core.tithi.sanskrit}</p>
                <div className="pillar-time-badge">{panchang.core.tithi.endTime}</div>
                <p className="pillar-next">{panchang.core.tithi.next}</p>
              </div>

              <div className="pillar-card card-nakshatra">
                <span className="pillar-num">2. नक्षत्र</span>
                <h3>{panchang.core.nakshatra.name}</h3>
                <p className="pillar-sanskrit">{panchang.core.nakshatra.sanskrit}</p>
                <div className="pillar-time-badge">{panchang.core.nakshatra.endTime}</div>
                <p className="pillar-next">{panchang.core.nakshatra.next}</p>
              </div>

              <div className="pillar-card card-yoga">
                <span className="pillar-num">3. योग</span>
                <h3>{panchang.core.yoga.name}</h3>
                <p className="pillar-sanskrit">{panchang.core.yoga.sanskrit}</p>
                <div className="pillar-time-badge">{panchang.core.yoga.endTime}</div>
                <p className="pillar-next">{panchang.core.yoga.next}</p>
              </div>

              <div className="pillar-card card-karana">
                <span className="pillar-num">4. करण</span>
                <h3>{panchang.core.karana.name}</h3>
                <p className="pillar-sanskrit">{panchang.core.karana.sanskrit}</p>
                <div className="pillar-time-badge">{panchang.core.karana.endTime}</div>
                <p className="pillar-next">{panchang.core.karana.next}</p>
              </div>

              <div className="pillar-card card-vaar">
                <span className="pillar-num">5. वार (दिन)</span>
                <h3>{panchang.core.vaar.hindi}</h3>
                <p className="pillar-sanskrit">{panchang.core.vaar.english}</p>
                <div className="pillar-time-badge">स्वामी: {panchang.core.vaar.rulingPlanet}</div>
                <p className="pillar-next">अधिष्ठाता देवता: शनि देव</p>
              </div>
            </div>

            {/* TAB NAVIGATION FOR MUHURAT / CHOGHADIYA / FESTIVALS */}
            <div className="panchang-subtabs-row">
              <button
                type="button"
                className={`panchang-subtab ${activeTab === 'muhurat' ? 'active' : ''}`}
                onClick={() => setActiveTab('muhurat')}
              >
                <span>✨</span> शुभ व अशुभ मुहूर्त
              </button>
              <button
                type="button"
                className={`panchang-subtab ${activeTab === 'choghadiya' ? 'active' : ''}`}
                onClick={() => setActiveTab('choghadiya')}
              >
                <span>⏱️</span> आज का चौघड़िया (Day Choghadiya)
              </button>
              <button
                type="button"
                className={`panchang-subtab ${activeTab === 'festivals' ? 'active' : ''}`}
                onClick={() => setActiveTab('festivals')}
              >
                <span>🪔</span> आगामी व्रत व त्यौहार
              </button>
            </div>

            {/* TAB 1: MUHURAT */}
            {activeTab === 'muhurat' && (
              <div className="tab-pane-muhurats">
                <div className="muhurat-two-col-grid">
                  {/* AUSPICIOUS MUHURATS */}
                  <div className="muhurat-box box-shubh">
                    <div className="box-header-shubh">
                      <span>🌟</span>
                      <h4>शुभ मुहूर्त (Auspicious Timings)</h4>
                    </div>
                    <div className="muhurat-list">
                      {panchang.shubhMuhurat.map((item, idx) => (
                        <div key={idx} className={`muhurat-item-row ${item.isBest ? 'highlight-best' : ''}`}>
                          <div className="item-name-col">
                            <strong>{item.name}</strong>
                            <p>{item.desc}</p>
                          </div>
                          <div className="item-time-col">
                            <span className="time-badge-shubh">{item.time}</span>
                            {item.isBest && <span className="best-tag">सर्वोत्तम</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* INAUSPICIOUS TIMINGS */}
                  <div className="muhurat-box box-ashubh">
                    <div className="box-header-ashubh">
                      <span>⚠️</span>
                      <h4>वर्जित काल (Inauspicious Kaal)</h4>
                    </div>
                    <div className="muhurat-list">
                      {panchang.ashubhKaal.map((item, idx) => (
                        <div key={idx} className="muhurat-item-row row-ashubh">
                          <div className="item-name-col">
                            <strong>{item.name}</strong>
                            <p>{item.warning}</p>
                          </div>
                          <div className="item-time-col">
                            <span className="time-badge-ashubh">{item.time}</span>
                            <span className="avoid-tag">त्याज्य</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CHOGHADIYA */}
            {activeTab === 'choghadiya' && (
              <div className="tab-pane-choghadiya">
                <div className="choghadiya-table-wrapper">
                  <div className="choghadiya-legend">
                    <span className="legend-chip chip-good">शुभ / अमृत / लाभ: मांगलिक कार्य हेतु श्रेष्ठ</span>
                    <span className="legend-chip chip-neutral">चर: यात्रा व सामान्य कार्य</span>
                    <span className="legend-chip chip-bad">रोग / काल / उद्वेग: वर्जित काल</span>
                  </div>

                  <table className="choghadiya-table">
                    <thead>
                      <tr>
                        <th>चौघड़िया मुहूर्त</th>
                        <th>समय अंतराल</th>
                        <th>गुणवत्ता</th>
                        <th>उपयुक्त कार्य</th>
                      </tr>
                    </thead>
                    <tbody>
                      {panchang.choghadiyaDay.map((ch, idx) => (
                        <tr key={idx} className={`tr-choghadiya type-${ch.type.toLowerCase()}`}>
                          <td className="td-name">
                            <span className="ch-type-indicator">●</span> {ch.name}
                          </td>
                          <td className="td-time">{ch.time}</td>
                          <td className="td-quality">{ch.quality}</td>
                          <td className="td-suitability">
                            {ch.type === 'GOOD' ? 'विवाह, गृह प्रवेश, व्यापार, पूजा एवं संकल्प' : (ch.type === 'NEUTRAL' ? 'यात्रा, वाहन चालन व सामान्य वार्ता' : 'शुभ कार्य न करें')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: FESTIVALS */}
            {activeTab === 'festivals' && (
              <div className="tab-pane-festivals">
                <div className="festivals-grid">
                  {panchang.upcomingFestivals.map((f, idx) => (
                    <div key={idx} className="festival-card">
                      <div className="fest-header">
                        <span className="fest-icon">🪔</span>
                        <span className="fest-tithi">{f.tithi}</span>
                      </div>
                      <h4>{f.title}</h4>
                      <p className="fest-date">📅 {f.date}</p>
                      <p className="fest-desc">{f.significance}</p>
                      <button
                        type="button"
                        className="btn-fest-book"
                        onClick={() => setBookingModal({ isOpen: true, poojaId: 'satyanarayan-katha', withSamagri: true })}
                      >
                        इस दिन की पूजा बुक करें →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer onOpenAuth={handleOpenAuth} />

      <AuthModal
        isOpen={authModal.isOpen}
        initialRole={authModal.role}
        reason={authModal.reason}
        redirectUrl={authModal.redirectUrl}
        onClose={() => setAuthModal({ isOpen: false, role: 'CLIENT', reason: '', redirectUrl: '/panchang' })}
      />

      <BookingModal
        isOpen={bookingModal.isOpen}
        defaultPoojaId={bookingModal.poojaId}
        defaultWithSamagri={bookingModal.withSamagri}
        onClose={() => setBookingModal({ isOpen: false, poojaId: 'grah-shanti', withSamagri: true })}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  );
}
