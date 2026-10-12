import './globals.css';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.motto,
  keywords: ['Vedic Pooja', 'Online Pandit Booking', 'Griha Pravesh', 'Maha Mrityunjaya', 'Satyanarayan Katha', 'ShraddhaSetu', 'Pooja Samagri'],
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.motto,
    url: 'https://shraddhasetu.com',
    siteName: 'ShraddhaSetu',
    images: [
      {
        url: '/images/brand_logo_top.png',
        width: 1120,
        height: 1216,
        alt: 'ShraddhaSetu Sacred Brand Emblem',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" 
          rel="stylesheet" 
        />
        {/* Schema.org JSON-LD for rich Google snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'ShraddhaSetu',
              image: 'https://shraddhasetu.com/images/brand_logo_top.png',
              telephone: '+91 12345 67890',
              priceRange: '₹1,800 - ₹5,000',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
