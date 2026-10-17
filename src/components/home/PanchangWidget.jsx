'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPanchangForCity } from '@/data/panchangData';

export default function PanchangWidget({ onOpenAuth }) {
  const router = useRouter();
  const { user } = useAuth();
  const panchang = getPanchangForCity('varanasi');

  const handlePanchangClick = () => {
    if (user) {
      router.push('/panchang');
    } else {
      onOpenAuth('CLIENT', 'दैनिक वैदिक पंचांग व शुभ मुहूर्त देखने के लिए कृपया लॉगिन करें।', '/panchang');
    }
  };

  return (
    <section className="section-panchang-widget">
      <div className="panchang-widget-card">
        <div className="panchang-widget-left">
          <div className="widget-badge-row">
            <span className="vedic-pill-maroon">🕉️ आज का वैदिक पंचांग</span>
            <span className="location-pill">📍 काशी (Varanasi)</span>
          </div>
          <h3 className="widget-title">{panchang.formattedDate}</h3>
          <p className="widget-samvat">
            विक्रम संवत {panchang.samvat.vikram.split(' ')[0]} • {panchang.samvat.monthPurnimanta} • {panchang.samvat.paksha}
          </p>

          <div className="widget-quick-metrics">
            <div className="metric-box">
              <span className="metric-lbl">तिथि:</span>
              <span className="metric-val">{panchang.core.tithi.name}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">नक्षत्र:</span>
              <span className="metric-val">{panchang.core.nakshatra.name}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">वार:</span>
              <span className="metric-val">{panchang.core.vaar.hindi}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">सूर्योदय:</span>
              <span className="metric-val">{panchang.astronomy.sunrise}</span>
            </div>
          </div>
        </div>

        <div className="panchang-widget-right">
          <div className="widget-lock-box">
            <div className="muhurat-preview-row">
              <div className="preview-item item-shubh">
                <span className="icon">✨</span>
                <div>
                  <span className="label">अभिजीत मुहूर्त</span>
                  <span className="time">{panchang.shubhMuhurat[0].time}</span>
                </div>
              </div>
              <div className="preview-item item-ashubh">
                <span className="icon">⚠️</span>
                <div>
                  <span className="label">राहुकाल (वर्जित)</span>
                  <span className="time">{panchang.ashubhKaal[0].time}</span>
                </div>
              </div>
            </div>

            <div className="widget-cta-container">
              <button
                type="button"
                className="btn-panchang-unlock-cta"
                onClick={handlePanchangClick}
              >
                {user ? (
                  <>
                    <span>📅</span> सम्पूर्ण पंचांग व चौघड़िया तालिका देखें →
                  </>
                ) : (
                  <>
                    <span>🔐</span> पंचांग व चौघड़िया देखने हेतु लॉगिन करें
                  </>
                )}
              </button>
              {!user && (
                <span className="hint-lock-text">
                  * 1-क्लिक में लॉगिन करके सम्पूर्ण पंचांग तुरंत देखें
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
