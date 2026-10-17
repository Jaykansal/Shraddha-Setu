'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FastImage from '@/components/ui/FastImage';

export default function Navbar({ onOpenAuth, onOpenBooking }) {
  const router = useRouter();
  const { user, logout, isDevotee, isPandit, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPortalLink = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isPandit) return '/dashboard/pandit';
    return '/dashboard/devotee';
  };

  const getPortalName = () => {
    if (isAdmin) return 'Mandir Admin';
    if (isPandit) return 'Acharya Desk';
    return 'Devotee Portal';
  };

  return (
    <header className="navbar">
      <Link href="/" className="nav-logo">
        <FastImage
          src="/images/logo.png"
          alt="ShraddhaSetu Logo"
          width={210}
          height={52}
          priority={true}
          className="nav-logo-img"
        />
      </Link>

      <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <li className="nav-item"><Link href="/">Home</Link></li>
        <li className="nav-item nav-item-highlight">
          <button
            type="button"
            className="nav-link-btn"
            onClick={() => {
              if (user) {
                router.push('/panchang');
              } else if (onOpenAuth) {
                onOpenAuth('CLIENT', 'दैनिक पंचांग व शुभ मुहूर्त देखने के लिए कृपया लॉगिन करें।', '/panchang');
              } else {
                router.push('/portal/devotee');
              }
            }}
          >
            <span>✨</span> दैनिक पंचांग
          </button>
        </li>
        <li className="nav-item"><Link href="/poojas">Pooja Services</Link></li>
        <li className="nav-item"><Link href="/pandits">Vedic Pandits</Link></li>
        <li className="nav-item"><Link href="/samagri">Pooja Samagri</Link></li>
        <li className="nav-item"><Link href="/about">About Us</Link></li>
        <li className="nav-item"><Link href="/blog">Vedic Blog</Link></li>
        <li className="nav-item"><Link href="/contact">Contact</Link></li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <div className="nav-user-logged">
            <Link href={getPortalLink()} className={`btn-user-portal ${isPandit ? 'portal-badge-pandit' : (isAdmin ? 'portal-badge-admin' : 'portal-badge-devotee')}`}>
              <span>{isPandit ? '🕉️' : (isAdmin ? '🏛️' : '🙏')}</span>
              <span className="user-name-label">{user.name?.split(' ')[0]} ({getPortalName()})</span>
            </Link>
            <button
              type="button"
              className="btn-logout"
              onClick={() => {
                logout();
                router.push('/');
              }}
              title="Logout"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="nav-guest-actions">
            <Link
              href="/portal/pandit"
              className="btn-nav-pandit-portal"
              title="Vedic Pandit & Acharya Desk"
            >
              <span>🕉️</span> पंडित पोर्टल
            </Link>
            <Link
              href="/portal/devotee"
              className="btn-access-portal"
              title="Devotee Sign In / Register"
            >
              <span>🔐</span> यजमान लॉगिन
            </Link>
            <button
              type="button"
              className="btn-book-nav"
              onClick={() => onOpenBooking ? onOpenBooking('grah-shanti', true) : router.push('/poojas')}
            >
              Book a Pooja
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
