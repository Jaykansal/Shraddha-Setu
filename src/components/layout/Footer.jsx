import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="ShraddhaSetu"
                width={200}
                height={50}
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-desc">
              India's trusted spiritual platform connecting devotees with authentic Gurukul-trained Vedic Pandits and 100% pure pooja samagri.
            </p>
            <div className="footer-contact-info">
              <div>📞 {SITE_CONFIG.phone}</div>
              <div>✉️ {SITE_CONFIG.supportEmail}</div>
              <div>📍 Varanasi • New Delhi • Mumbai • Bengaluru</div>
            </div>
          </div>

          {/* Col 2: Popular Poojas */}
          <div className="footer-col">
            <h4>Popular Poojas</h4>
            <ul>
              <li><Link href="/poojas">Grah Shanti Pooja</Link></li>
              <li><Link href="/poojas">Maha Mrityunjaya Jaap</Link></li>
              <li><Link href="/poojas">Lakshmi Kuber Pooja</Link></li>
              <li><Link href="/poojas">Satyanarayan Katha</Link></li>
              <li><Link href="/poojas">Navagraha Shanti Havan</Link></li>
              <li><Link href="/poojas">Griha Pravesh & Vastu</Link></li>
            </ul>
          </div>

          {/* Col 3: Samagri & Services */}
          <div className="footer-col">
            <h4>Divine Services</h4>
            <ul>
              <li><Link href="/samagri">100% Pure Desi Ghee Kit</Link></li>
              <li><Link href="/samagri">Gangajal & Sacred Herbs</Link></li>
              <li><Link href="/pandits">Certified Acharya Network</Link></li>
              <li><Link href="/pandits">Pandit Registration Portal</Link></li>
              <li><Link href="/samagri">Custom Samagri Builder</Link></li>
              <li><Link href="/contact">Muhurat Consultation</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick Links & Sanskriti */}
          <div className="footer-col">
            <h4>Trust & Knowledge</h4>
            <ul>
              <li><Link href="/about">About ShraddhaSetu</Link></li>
              <li><Link href="/blog">Spiritual Blog & Panchang</Link></li>
              <li><Link href="/contact">Contact & Help Center</Link></li>
              <li><Link href="/about">Vedic Lineage & Mission</Link></li>
              <li><Link href="/poojas">All Poojas Catalog</Link></li>
            </ul>
            <div className="footer-trust-badge">
              <span>🕉️ Shubh Sankalp • Shuddh Samagri</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.legalName}. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/about">About Us</Link>
            <span>•</span>
            <Link href="/poojas">Poojas</Link>
            <span>•</span>
            <Link href="/samagri">Samagri</Link>
            <span>•</span>
            <Link href="/blog">Blog</Link>
            <span>•</span>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
