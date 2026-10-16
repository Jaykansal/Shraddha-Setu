'use client';

import Link from 'next/link';
import FastImage from '@/components/ui/FastImage';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <div className="footer-logo-box">
            <FastImage
              src="/images/logo.png"
              alt="ShraddhaSetu Logo"
              width={220}
              height={55}
              className="footer-logo-img"
            />
          </div>
          <p className="footer-desc">
            {SITE_CONFIG.motto}
          </p>
          <div className="footer-contact-mini">
            <p><strong>Headquarters:</strong> Kashi Vishwanath Dham Road, Varanasi - 221001</p>
            <p><strong>Support:</strong> {SITE_CONFIG.supportEmail} • {SITE_CONFIG.phone}</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>3 Sacred Portals</h4>
          <ul>
            <li><Link href="/dashboard/devotee">🙏 Devotee / Yajman Portal</Link></li>
            <li><Link href="/dashboard/pandit">🕉️ Vedic Pandit &amp; Acharya Portal</Link></li>
            <li><Link href="/dashboard/admin">🏛️ Mandir Samiti Admin Console</Link></li>
            <li><Link href="/pandits">Gurukul Verification Criteria</Link></li>
            <li><Link href="/samagri">100% Shuddh Samagri Standards</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Vedic Services</h4>
          <ul>
            <li><Link href="/poojas">Griha Pravesh Pooja</Link></li>
            <li><Link href="/poojas">Maha Mrityunjaya Jaap</Link></li>
            <li><Link href="/poojas">Grah Shanti &amp; Vastu</Link></li>
            <li><Link href="/poojas">Satyanarayan Katha</Link></li>
            <li><Link href="/poojas">Lakshmi-Kuber Pujan</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Spiritual Trust</h4>
          <ul>
            <li>✓ 100% Verified Vedic Lineage</li>
            <li>✓ 100% Pure A2 Cow Ghee Hawan</li>
            <li>✓ Transparent Pandit Dakshina</li>
            <li>✓ On-time Muhurat Guarantee</li>
            <li>✓ Pan-India in 500+ Cities</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 {SITE_CONFIG.legalName} All rights reserved. Connecting Faith with Divine Services.</p>
        <div className="footer-bottom-links">
          <Link href="/about">About Platform</Link>
          <span>•</span>
          <Link href="/contact">Vedic Helpline</Link>
          <span>•</span>
          <Link href="/blog">Panchang &amp; Muhurat Blog</Link>
        </div>
      </div>
    </footer>
  );
}
