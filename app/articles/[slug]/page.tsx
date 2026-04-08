// ... (imports remain the same)

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-16 group">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Pot The Black Masterclass"}
              width={2000} // Set for high-res wide layout
              height={1000}
              className="h-auto w-full object-cover"
            />
          </div>
          {value.caption && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-6 italic text-center uppercase">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    // Balanced H2 - Impactful but not overwhelming
    h2: ({ children }: any) => (
      <h2 className="text-3xl md:text-5xl font-black italic uppercase mt-20 mb-8 text-white tracking-tighter leading-[0.9]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg md:text-xl font-bold uppercase mt-12 mb-6 text-green-500 tracking-[0.3em]">
        {children}
      </h3>
    ),
    // Normal text - Increased for readability on wide screens
    normal: ({ children }: any) => (
      <p className="mb-8 text-gray-400 leading-relaxed text-xl font-light">
        {children}
      </p>
    ),
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title,
    body,
    mainImage,
    "publishedAt": _createdAt
  }`, { slug });

  if (!post) return <div className="bg-black text-white p-20">Article not found</div>;

  return (
    // 1. Widened to 6xl (1152px) for a much fuller screen feel
    <article className="max-w-6xl mx-auto pt-40 pb-32 px-6 md:px-12 lg:px-20 bg-[#0a0a0a] text-white min-h-screen">
      
      {/* Article Meta */}
      <div className="flex items-center gap-4 mb-10">
        <span className="bg-green-500 text-[10px] font-black uppercase px-3 py-1 text-black tracking-widest">Masterclass</span>
        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          {new Date(post.publishedAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* 2. Headline - Reduced from 9xl to 7xl to stop it from "compressing" the layout */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase mb-20 leading-[0.85] tracking-tighter max-w-4xl">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="mb-24">
          <Image 
            src={urlFor(post.mainImage).url()} 
            alt={post.title} 
            width={2000} 
            height={1125} 
            className="rounded-[2.5rem] border border-white/5 shadow-2xl"
            priority
          />
        </div>
      )}

      {/* 3. The Body - Setting max-w-none to let it fill the 6xl container */}
      <div className="prose prose-invert max-w-none prose-lg md:prose-xl">
        <PortableText value={post.body} components={ptComponents} />
      </div>

      <div className="mt-40 pt-10 border-t border-white/5 flex justify-between items-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 hover:text-green-500 transition-colors">
          ← Back to Articles
        </Link>
        <span className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">Pot The Black © 2026</span>
      </div>
    </article>
  );
}