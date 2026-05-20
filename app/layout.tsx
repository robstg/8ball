import type { Metadata } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
import Script from 'next/script';
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

// THE CLEAN SHOT: Ensuring metadata doesn't conflict with technical files
export const metadata: Metadata = {
  title: {
    default: "Pot The Black | The Technical Cue Sports Archive",
    template: "%s | Pot The Black"
  },
  description: "Advanced mechanical analysis and tactical breakdowns for 8-ball and snooker players worldwide.",
  metadataBase: new URL('https://pottheblack.com'), // ADD THIS: Helps Next.js resolve sitemap paths
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-950`}>
        {/* GA4: Keeping it here but ensuring it's the ONLY thing in the body besides the wrapper */}
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

        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}