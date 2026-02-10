import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://madua.pt'),
  title: {
    default: "MADUA - A Reconquista da Neantropia",
    template: "%s | Madua",
  },
  description: "Resgate a força ancestral através da alimentação tradicional e filosofia de vida neantrópica",
  keywords: "madua, neantropia, alimentação ancestral, saúde masculina, nutrição, receitas saudáveis, fitness",
  authors: [{ name: "Madua" }],
  creator: "Madua",
  publisher: "Madua",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MADUA - A Reconquista da Neantropia",
    description: "Resgate a força ancestral através da alimentação tradicional e filosofia de vida neantrópica",
    url: 'https://madua.pt',
    siteName: 'Madua',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: '/logo/madua-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Madua',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "MADUA - A Reconquista da Neantropia",
    description: "Resgate a força ancestral através da alimentação tradicional e filosofia de vida neantrópica",
    creator: '@madua',
    site: '@madua',
    images: ['/logo/madua-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Adicionar código real do Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9T6QYMBSDE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9T6QYMBSDE');`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
