'use client';

import Image from 'next/image';

export default function BrandSidebar({ onOpenModal }) {
  return (
    <aside className="brand-sidebar" id="brandSidebar">
      <div className="brand-showcase-top">
        <div className="brand-emblem-box">
          <Image
            src="/images/brand_logo_top.png"
            alt="ShraddhaSetu Sacred Emblem"
            width={556}
            height={586}
            priority
            className="brand-emblem-img"
          />
        </div>
      </div>

      <div className="brand-showcase-middle">
        <div 
          className="app-icon-squircle" 
          onClick={() => onOpenModal?.('PANDIT')}
          role="button"
          tabIndex={0}
          title="Click to explore ShraddhaSetu Mobile App & Portals"
        >
          <Image
            src="/images/brand_app_icon.png"
            alt="ShraddhaSetu Mobile App Icon"
            width={416}
            height={404}
            className="app-icon-img"
          />
        </div>
        <span className="app-icon-label">Mobile App Icon</span>
      </div>

      <div className="brand-showcase-bottom">
        <div className="horizontal-logo-card">
          <Image
            src="/images/brand_card_bottom.png"
            alt="ShraddhaSetu Horizontal Brand Card"
            width={536}
            height={198}
            className="horizontal-card-img"
          />
        </div>
      </div>
    </aside>
  );
}
