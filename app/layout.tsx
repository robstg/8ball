import type { Metadata } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
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

// THE FIX: Prepending logic for a global audience.
// This template handles the "prepended word" automatically for sub-pages.
export const metadata: Metadata = {
  title: {
    default: "Pot The Black | The Technical Cue Sports Site",
    template: "%s | Pot The Black" 
  },
  description: "Advanced mechanical analysis, physics-based drills, and tactical breakdowns for 8-ball, 9-ball, and snooker players worldwide. No fluff, just the math behind the game.",
  keywords: ["Pool tips", "Snooker rules", "8-ball tactics", "9-ball drills", "Cue sports mechanics"],
  openGraph: {
    title: "Pot The Black | The Technical Cue Sports Site",
    description: "Master the baize with physics-based drills and veteran technical advice.",
    url: 'https://pottheblack.com',
    siteName: 'Pot The Black',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pot The Black | The Technical Cue Sports Site",
    description: "Master the baize with physics-based drills and veteran technical advice.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}