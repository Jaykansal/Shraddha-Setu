'use client';

import { useState } from 'react';
import { FAQS } from '@/data/faqs';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function FaqContactSection() {
  const [openFaq, setOpenFaq] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <section className="faq-contact-section" id="contact">
      <div className="faq-contact-container">
        <div className="faq-contact-grid">
          {/* Left: FAQs */}
          <div className="faq-column">
            <div className="section-pill-tag">FREQUENTLY ASKED QUESTIONS</div>
            <h2 className="section-title-left">Got Questions? We Have Answers</h2>
            <p className="faq-lead-text">
              Learn more about how our Pandit booking, Samagri kits, and sacred ceremonies work.
            </p>

            <div className="faqs-accordion">
              {FAQS.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`faq-item ${openFaq === idx ? 'open' : ''}`}
                >
                  <button 
                    type="button" 
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-caret">{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer-content">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Inquiries */}
          <div className="contact-column">
            <div className="contact-card">
              <h3>Speak with a Vedic Coordinator</h3>
              <p>Need guidance on Shubh Muhurat or custom ritual requirements?</p>

              {contactSubmitted ? (
                <div className="contact-success">
                  <span>🕉️</span>
                  <h4>Thank You!</h4>
                  <p>Our Acharya will call you shortly on your number.</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} 
                  className="quick-contact-form"
                >
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" required placeholder="e.g. Anand Varma" />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number (with WhatsApp)</label>
                    <input type="tel" required placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label>Pooja Inquiry / Custom Requirement</label>
                    <textarea rows="3" placeholder="Tell us which pooja or muhurat you need advice on..."></textarea>
                  </div>
                  <button type="submit" className="btn-contact-submit">
                    Request Free Consultation
                  </button>
                </form>
              )}

              <div className="direct-support-box">
                <div>
                  <small>Direct Helplines</small>
                  <strong>{SITE_CONFIG.phone}</strong>
                </div>
                <div>
                  <small>Email Support</small>
                  <strong>{SITE_CONFIG.supportEmail}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
