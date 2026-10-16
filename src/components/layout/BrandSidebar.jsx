'use client';

import FastImage from '@/components/ui/FastImage';

export default function BrandSidebar({ onOpenModal }) {
  return (
    <aside className="brand-sidebar" id="brandSidebar">
      <div className="brand-showcase-top">
        <div className="brand-emblem-box">
          <FastImage
            src="/images/brand_logo_top.png"
            alt="ShraddhaSetu Sacred Emblem"
            width={320}
            height={340}
            priority={true}
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
          title="Click to explore Pandit & Devotee Portals"
        >
          <FastImage
            src="/images/brand_app_icon.png"
            alt="ShraddhaSetu App Icon"
            width={120}
            height={120}
            className="app-icon-img"
          />
        </div>
        <span className="app-icon-label">Mobile App & Portals</span>
      </div>

      <div className="brand-showcase-bottom">
        <div className="horizontal-logo-card">
          <FastImage
            src="/images/brand_card_bottom.png"
            alt="ShraddhaSetu Horizontal Brand Card"
            width={300}
            height={110}
            className="horizontal-card-img"
          />
        </div>
      </div>
    </aside>
  );
}
