'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar({ onOpenAuth, onOpenBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <Link href="/" className="nav-logo">
        <Image
          src="/images/logo.png"
          alt="ShraddhaSetu Logo"
          width={240}
          height={60}
          priority
          className="nav-logo-img"
        />
      </Link>

      <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <li className="nav-item"><Link href="/">Home</Link></li>
        <li className="nav-item"><Link href="/about">About Us</Link></li>
        <li className="nav-item"><Link href="/poojas">Poojas <span className="nav-dropdown-icon">▼</span></Link></li>
        <li className="nav-item"><Link href="/samagri">Pooja Samagri</Link></li>
        <li className="nav-item"><Link href="/pandits">Pandits</Link></li>
        <li className="nav-item"><Link href="/blog">Blog</Link></li>
        <li className="nav-item"><Link href="/contact">Contact Us</Link></li>
      </ul>

      <div className="nav-actions">
        <div className="country-selector">
          <span>🇮🇳</span>
          <span>India</span>
          <span style={{ fontSize: '8px' }}>▼</span>
        </div>

        {/* DEVOTEE LOGIN */}
        <button 
          type="button" 
          className="btn-login-devotee" 
          onClick={() => onOpenAuth('CLIENT')}
        >
          Devotee Login
        </button>

        {/* PANDIT PORTAL */}
        <button 
          type="button" 
          className="btn-login-pandit" 
          onClick={() => onOpenAuth('PANDIT')}
        >
          <span>🕉️</span> Pandit Portal
        </button>

        {/* BOOK A POOJA */}
        <button 
          type="button" 
          className="btn-book-nav" 
          onClick={() => onOpenBooking()}
        >
          Book a Pooja
        </button>
      </div>
    </header>
  );
}
