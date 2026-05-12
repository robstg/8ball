import type { Metadata } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Header } from "@/components/header";
import LayoutWrapper from "@/components/layout-wrapper"; // We'll move the pathname logic here
import './globals.css';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body'
});

// THE FIX: High-authority global metadata
export const metadata: Metadata = {
  title: {
    default: "Pot The Black | The Technical Cue Sports Archive",
    template: "%s | Pot The Black"
  },
  description: "Advanced mechanical analysis, physics-based drills, and tactical breakdowns for 8-ball, 9-ball, and snooker players worldwide. Master the baize with veteran technical advice.",
  keywords: ["Pool tips", "Snooker rules", "8-ball tactics", "9-ball drills", "Cue sports mechanics", "Billiards physics"],
  openGraph: {
    title: "Pot The Black | The Technical Cue Sports Archive",
    description: "Master the baize with physics-based drills and veteran technical advice.",
    url: 'https://pottheblack.com',
    siteName: 'Pot The Black',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pot The Black | The Technical Cue Sports Platform",
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
        {/* We use a Client Wrapper to handle the 'isStudio' logic without killing our SEO */}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}