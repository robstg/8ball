import type { Metadata } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import Script from 'next/script'; // THE COMPONENT: Essential for GA4 in Next.js
import LayoutWrapper from "@/components/layout-wrapper";
import './globals.css';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: {
    default: "Pot The Black | The Technical Cue Sports Archive",
    template: "%s | Pot The Black"
  },
  description: "Advanced mechanical analysis and tactical breakdowns for 8-ball and snooker players worldwide. No fluff, just physics.",
  openGraph: {
    title: "Pot The Black | The Technical Cue Sports Archive",
    siteName: "Pot The Black",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* THE TRACKING HANDSHAKE: Loading GA4 after the page becomes interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NF8MV8W5WJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NF8MV8W5WJ');
          `}
        </Script>
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-950`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}