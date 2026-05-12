import type { Metadata } from "next";
import { Space_Grotesk, Inter } from 'next/font/google';
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
    default: "Pot The Black | The Technical Cue Sports Archive", // Home page title
    template: "%s | Pot The Black" // %s is replaced by the child page's title
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
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-950`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}