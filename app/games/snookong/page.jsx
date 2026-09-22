import SnookongGame from './SnookongGame';

export const metadata = {
  title: 'Snookong — Free Online Snooker Arcade Game | Pot The Black',
  description:
    'Break, pot reds and colours in order, and clear the table before you run out of lives. A free browser snooker arcade game — no download, works on mobile.',
  alternates: {
    canonical: 'https://pottheblack.com/games/snookong'
  },
  openGraph: {
    title: 'Snookong — Free Online Snooker Arcade Game',
    description:
      'Break, pot reds and colours in order, and clear the table before you run out of lives.',
    url: 'https://pottheblack.com/games/snookong',
    type: 'website',
    siteName: 'Pot The Black'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snookong — Free Online Snooker Arcade Game',
    description:
      'Break, pot reds and colours in order, and clear the table before you run out of lives.'
  }
};

// Locks pinch-zoom and respects device notches/home-indicator bars,
// same treatment NYT gives Wordle's standalone page.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0a0a'
};

export default function Page() {
  return <SnookongGame />;
}
