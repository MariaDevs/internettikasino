import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { SITE_LOCALE, SITE_NAME, SITE_URL } from '@/lib/site';

const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'latin-ext'], display: 'swap' });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Parhaat Nettikasinot 2026 — Testatut & Rehelliset Arviot',
    template: '%s',
  },
  description:
    'Vertaa parhaat nettikasinot 2026 saman katon alta. Testasimme jokaisen kasinon — nopeat kotiutukset, rehelliset bonukset, ei hypeä.',
  applicationName: SITE_NAME,
  openGraph: { type: 'website', locale: SITE_LOCALE, siteName: SITE_NAME },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/images/favicon-192.png', apple: '/images/favicon-192.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION },
  }),
};

export const viewport: Viewport = { themeColor: '#0a1b3f' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fi" className={`${inter.variable} h-full antialiased`}>
      <head>
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        <JsonLd data={[websiteSchema(), organizationSchema()]} />
      </head>
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-800">
        <a href="#sisalto" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2">
          Siirry sisältöön
        </a>
        <Header />
        <main id="sisalto" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
