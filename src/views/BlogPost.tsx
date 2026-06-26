 'use client';

import { ArrowRight, CalendarDays, Clock, MessageCircle, Tag } from 'lucide-react';
import { getBlogUrl, getReadingTime, type BlogContentBlock, type BlogPost as BlogPostType } from '@/lib/blog';

type BlogPostProps = {
  post: BlogPostType;
  relatedPosts: {
    id: string;
    title: string;
    slug: string;
    category: string;
  }[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

function TextWithBreaks({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function BlogBlock({ block }: { block: BlogContentBlock }) {
  if (block.type === 'heading') {
    const className =
      block.level === 3
        ? 'mt-12 font-montserrat text-2xl font-black text-white'
        : 'mt-14 font-montserrat text-3xl font-black text-white md:text-4xl';

    return block.level === 3 ? <h3 className={className}>{block.text}</h3> : <h2 className={className}>{block.text}</h2>;
  }

  if (block.type === 'paragraph') {
    return (
      <p className="mt-6 text-lg leading-8 text-gray-300">
        <TextWithBreaks text={block.text} />
      </p>
    );
  }

  if (block.type === 'list') {
    return (
      <ul className="mt-6 space-y-3">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 text-lg leading-8 text-gray-300">
            <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-[#c9a227]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'image') {
    return (
      <figure className="my-10 overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.03]">
        <img src={block.url} alt={block.alt} className="w-full object-cover" loading="lazy" />
        {block.caption && <figcaption className="p-4 text-sm text-gray-500">{block.caption}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="my-10 border-l-4 border-[#c9a227] bg-[#c9a227]/10 p-6 text-xl font-semibold leading-8 text-white">
        "{block.text}"
        {block.cite && <cite className="mt-4 block text-sm not-italic text-[#c9a227]">{block.cite}</cite>}
      </blockquote>
    );
  }

  if (block.type === 'callout') {
    return (
      <aside className="my-10 rounded-[1.5rem] border border-[#c9a227]/30 bg-[#c9a227]/10 p-6">
        {block.title && <h3 className="font-montserrat text-xl font-black text-[#c9a227]">{block.title}</h3>}
        <p className="mt-3 text-lg leading-8 text-gray-200">{block.text}</p>
      </aside>
    );
  }

  if (block.type === 'card_grid') {
    return (
      <section className="my-12">
        {block.title && <h2 className="font-montserrat text-3xl font-black text-white">{block.title}</h2>}
        {block.text && <p className="mt-4 text-lg leading-8 text-gray-400">{block.text}</p>}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {block.cards.map((card) => (
            <a
              key={`${card.title}-${card.href || card.tag || ''}`}
              href={card.href || '#'}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a227]/40"
            >
              {card.tag && (
                <span className="inline-flex rounded-full bg-[#c9a227]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#c9a227]">
                  {card.tag}
                </span>
              )}
              <h3 className="mt-4 font-montserrat text-xl font-black text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">{card.text}</p>
              {card.href && (
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#c9a227]">
                  {card.label || 'Ver guia'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </a>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'comparison_table') {
    return (
      <section className="my-12">
        {block.title && <h2 className="font-montserrat text-3xl font-black text-white">{block.title}</h2>}
        {block.text && <p className="mt-4 text-lg leading-8 text-gray-400">{block.text}</p>}
        <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[#c9a227]/10">
                <th className="p-4 text-xs font-black uppercase tracking-widest text-[#c9a227]">Item</th>
                {block.columns.map((column) => (
                  <th key={column} className="p-4 text-xs font-black uppercase tracking-widest text-[#c9a227]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {block.rows.map((row, rowIndex) => (
                <tr key={`${row.title}-${rowIndex}`} className="transition-colors hover:bg-white/[0.03]">
                  <td className="p-4 font-bold text-white">
                    {row.href ? (
                      <a href={row.href} className="hover:text-[#c9a227]">
                        {row.title}
                      </a>
                    ) : (
                      row.title
                    )}
                  </td>
                  {row.values.map((value, valueIndex) => (
                    <td key={`${row.title}-${rowIndex}-${valueIndex}`} className="p-4">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (block.type === 'cta') {
    return (
      <aside className="my-12 rounded-[2rem] border border-[#c9a227]/30 bg-gradient-to-br from-[#c9a227]/18 to-[#1a3a5c]/30 p-8">
        <h3 className="font-montserrat text-2xl font-black text-white">{block.title}</h3>
        <p className="mt-3 max-w-2xl text-gray-300">{block.text}</p>
        <a
          href={block.href}
          target={block.href.startsWith('http') ? '_blank' : undefined}
          rel={block.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="btn-primary mt-6 inline-flex items-center gap-2"
        >
          {block.label}
          <ArrowRight className="h-4 w-4" />
        </a>
      </aside>
    );
  }

  if (block.type === 'faq') {
    return (
      <section className="my-12">
        <h2 className="font-montserrat text-3xl font-black text-white">Perguntas frequentes</h2>
        <div className="mt-6 space-y-4">
          {block.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <summary className="cursor-pointer list-none font-montserrat text-lg font-bold text-white">
                {item.question}
                <span className="float-right text-[#c9a227] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-7 text-gray-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

export function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const readingTime = getReadingTime(post.content);
  const postUrl = getBlogUrl(post.slug);

  return (
    <article className="min-h-screen bg-[#04080f] text-white">
      <section className="relative overflow-hidden px-4 pt-32 pb-16 lg:pt-44 lg:pb-24">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${post.coverImageUrl || '/hero-bg.webp'})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(201,162,39,0.24),transparent_36%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#04080f]/55 via-[#04080f]/88 to-[#04080f]" />
        </div>

        <div className="container-lume relative z-10 max-w-5xl">
          <a href="/blog/" className="text-sm font-bold uppercase tracking-[0.2em] text-[#c9a227] hover:text-white">
            Blog LUME
          </a>
          <h1 className="mt-6 font-montserrat text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">{post.excerpt}</p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-[#c9a227]">
              <Tag className="h-4 w-4" />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
              <Clock className="h-4 w-4" />
              {readingTime} min de leitura
            </span>
          </div>
        </div>
      </section>

      <main className="container-lume grid gap-10 px-4 pb-24 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 md:p-10">
          {post.content.map((block, index) => (
            <BlogBlock key={`${block.type}-${index}`} block={block} />
          ))}
        </div>

        <aside>
          <div className="rounded-[1.7rem] border border-[#c9a227]/20 bg-[#09121d]/90 p-6 lg:sticky lg:top-28">
            <h2 className="font-montserrat text-xl font-black">Quer saber qual película usar?</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Fale com a LUME e receba uma indicação prática para seu vidro, sol e objetivo.
            </p>
            <a
              href={`https://wa.me/5521965140612?text=${encodeURIComponent(`Olá! Li o artigo ${postUrl} e quero ajuda para escolher uma película.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>

            {post.tags.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a227]">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-8">
                <h2 className="font-montserrat text-xl font-black">Leia também</h2>
                <div className="mt-5 space-y-3">
                  {relatedPosts.map((relatedPost) => (
                    <a
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}/`}
                      className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#c9a227]/50"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
                        {relatedPost.category}
                      </p>
                      <h3 className="mt-2 text-sm font-bold text-white">{relatedPost.title}</h3>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </article>
  );
}
