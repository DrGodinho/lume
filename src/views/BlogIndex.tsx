import { ArrowRight, BookOpen, CalendarDays, Sparkles } from 'lucide-react';
import { blogCategories, type BlogPostSummary } from '@/lib/blog';

type BlogIndexProps = {
  posts: BlogPostSummary[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function BlogIndex({ posts }: BlogIndexProps) {
  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const otherPosts = featuredPost ? posts.filter((post) => post.id !== featuredPost.id) : posts;
  const recentPosts = [...otherPosts].sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-[#04080f] text-white">
      <section className="relative overflow-hidden px-4 pt-32 pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,162,39,0.20),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(26,58,92,0.45),transparent_35%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(201,162,39,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(201,162,39,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#04080f]/30 via-[#04080f]/85 to-[#04080f]" />
        </div>

        <div className="container-lume relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#c9a227]">
              <Sparkles className="h-4 w-4" />
              Curadoria LUME
            </div>

            <h1 className="mt-7 max-w-4xl font-montserrat text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
              Insulfilm com critério: conforto, proteção e elegância para cada vidro
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
              Guias técnicos e recomendações refinadas para escolher a película ideal, controlar o calor,
              preservar móveis e valorizar casas, apartamentos e empresas no Rio de Janeiro.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {blogCategories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <main className="container-lume px-4 pb-24">
        {featuredPost ? (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <a
              href={`/blog/${featuredPost.slug}/`}
              className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-[#c9a227]/20 bg-[#09121d] shadow-2xl shadow-black/30"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${featuredPost.coverImageUrl || '/hero-bg.webp'})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/72 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <div className="mb-4 inline-flex rounded-full bg-[#c9a227] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#04080f]">
                  Destaque
                </div>
                <h2 className="font-montserrat text-3xl font-black leading-tight md:text-5xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 max-w-2xl text-gray-300">{featuredPost.excerpt}</p>
                <div className="mt-6 inline-flex items-center gap-2 font-bold text-[#c9a227]">
                  Ler artigo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="flex items-center gap-3 text-[#c9a227]">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.22em]">Arquivo do blog</span>
              </div>
              <h2 className="mt-5 font-montserrat text-3xl font-black">Dicas e Análises de Especialistas</h2>
              <p className="mt-4 leading-relaxed text-gray-400">
                Aprenda a escolher a película ideal para seu projeto. Nossos artigos trazem análises técnicas sobre redução de calor, proteção UV, durabilidade e privacidade para vidros.
              </p>
              <div className="mt-8 space-y-4">
                {recentPosts.slice(0, 3).map((post) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}/`}
                    className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#c9a227]/50"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">{post.category}</p>
                    <h3 className="mt-2 font-montserrat font-bold text-white">{post.title}</h3>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-[#c9a227]/20 bg-white/[0.03] p-8 text-center md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c9a227]">Blog pronto para receber posts</p>
            <h2 className="mt-4 font-montserrat text-3xl font-black">Nenhum post publicado ainda</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Depois que o primeiro post local for adicionado ao projeto e publicado por deploy,
              ele aparecera automaticamente aqui e no sitemap.
            </p>
          </section>
        )}

        {otherPosts.length > 0 && (
          <section className="mt-16">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c9a227]">Artigos recentes</p>
                <h2 className="mt-3 font-montserrat text-3xl font-black md:text-4xl">Aprenda antes de comprar</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a227]/40"
                >
                  <a href={`/blog/${post.slug}/`} className="block">
                    <div
                      className="h-52 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${post.coverImageUrl || '/hero-bg.webp'})` }}
                      role="img"
                      aria-label={post.coverImageAlt}
                    />
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="rounded-full bg-[#c9a227]/10 px-3 py-1 font-bold text-[#c9a227]">
                          {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <h3 className="mt-4 font-montserrat text-xl font-black leading-snug text-white">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400">{post.excerpt}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#c9a227]">
                        Continuar lendo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
