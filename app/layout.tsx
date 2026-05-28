import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import company from '@/app/config/company';

/* ── Police Google Fonts ────────────────────────────────────── */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

/* ── Métadonnées SEO — générées depuis company.ts ───────────── */
export const metadata: Metadata = {
  title: `${company.name} — Assistant virtuel`,
  description: `Assistant virtuel de ${company.name}. ${company.slogan}. Posez vos questions en temps réel.`,
};

/**
 * Layout racine de l'application.
 *
 * Responsabilités :
 * 1. Charge la police et les styles globaux
 * 2. Injecte les couleurs B2B depuis company.ts comme variables CSS
 *    → Pas besoin de toucher au CSS pour changer le branding client
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} h-full antialiased`}
      /**
       * Injection des couleurs du client comme CSS variables.
       * Ces variables surchargent les valeurs par défaut de globals.css.
       * Elles sont ensuite utilisées dans les composants via :
       *   style={{ backgroundColor: 'var(--color-primary)' }}
       * ou directement en tant que valeur depuis company.ts.
       */
      style={{
        '--color-primary': company.primaryColor,
        '--color-primary-light': company.primaryColorLight,
      } as React.CSSProperties}
    >
      <body className="min-h-full bg-gray-50">
        {children}
      </body>
    </html>
  );
}
