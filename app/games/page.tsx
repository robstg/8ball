import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Online Cue Sports Games | Pot The Black",
  description:
    "Free browser games for pool and snooker fans — no download, works on mobile. Break, pot, and see how high a score you can run up.",
  alternates: {
    canonical: "https://pottheblack.com/games",
  },
};

interface GameCard {
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  icon: string;
}

// Static for now since there's only one title — once you're publishing games
// more often than you deploy code, this is the natural point to move it to
// a Sanity "game" document type and fetch it the same way /tools does.
const games: GameCard[] = [
  {
    title: "Snookong",
    slug: "snookong",
    shortDescription:
      "Break, pot reds and colours in order, and clear the table before you run out of lives. See how high a break you can string together.",
    category: "Arcade",
    icon: "🎱",
  },
];

function CollectionJsonLd({ games }: { games: GameCard[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cue Sports Games",
    description: "Free browser games for pool and snooker fans.",
    url: "https://pottheblack.com/games",
    hasPart: games.map((g) => ({
      "@type": "Game",
      name: g.title,
      url: `https://pottheblack.com/games/${g.slug}`,
      genre: g.category,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function GamesHubPage() {
  return (
    <div className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 text-slate-900 min-h-screen bg-white">
      <CollectionJsonLd games={games} />

      <span className="bg-emerald-500 text-[10px] font-black uppercase px-3 py-1 text-white tracking-widest">
        Games
      </span>

      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black italic uppercase mt-8 mb-6 leading-[0.9] tracking-tighter text-slate-900">
        Cue Sports Games
      </h1>

      <p className="text-slate-600 text-xl font-light leading-relaxed max-w-2xl mb-20">
        Free browser games for pool and snooker fans — no download, works on
        mobile. Break, pot, and see how high a score you can run up.
      </p>

      {games.length === 0 ? (
        <p className="text-slate-400">No games published yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group block rounded-[2rem] border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-200 transition-all p-10"
            >
              <div className="flex items-start gap-5">
                {game.icon && (
                  <span className="text-4xl leading-none">{game.icon}</span>
                )}
                <div>
                  {game.category && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                      {game.category}
                    </span>
                  )}
                  <h2 className="font-heading text-2xl font-black italic uppercase mt-2 mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">
                    {game.title}
                  </h2>
                  {game.shortDescription && (
                    <p className="text-slate-600 font-light leading-relaxed">
                      {game.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-24 pt-10 border-t border-slate-100">
        <Link
          href="/"
          className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-emerald-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
