 'use client';

import { ArrowRight, CalendarDays, Clock, MessageCircle, Tag, User, ShieldCheck } from 'lucide-react';
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

import React, { type ReactNode } from 'react';

function parseInlineFormatting(text: string): ReactNode[] {
  if (!text) return [];

  // Match: Links, Bold-Italic, Bold, Inline code, Italic
  const INLINE_REGEX =
    /(\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;

  const tokens = text.split(INLINE_REGEX);

  return tokens.map((token, index) => {
    if (!token) return null;

    // 1. Link: [label](url)
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a
          key={`link-${index}`}
          href={linkUrl}
          className="font-bold text-[#c9a227] underline decoration-[#c9a227]/40 underline-offset-4 transition-colors hover:text-[#dfb738] hover:decoration-[#c9a227]"
        >
          {parseInlineFormatting(linkText)}
        </a>
      );
    }

    // 2. Bold + Italic: ***text***
    const boldItalicMatch = /^\*\*\*(.+?)\*\*\*$/.exec(token);
    if (boldItalicMatch) {
      return (
        <strong key={`bi-${index}`} className="font-bold text-white">
          <em className="italic text-[#c9a227]">{parseInlineFormatting(boldItalicMatch[1])}</em>
        </strong>
      );
    }

    // 3. Bold: **text** or __text__
    const boldMatch = /^(\*\*|__)(.+?)\1$/.exec(token);
    if (boldMatch) {
      return (
        <strong key={`bold-${index}`} className="font-bold text-white tracking-wide">
          {parseInlineFormatting(boldMatch[2])}
        </strong>
      );
    }

    // 4. Inline code: `text`
    const codeMatch = /^`([^`]+)`$/.exec(token);
    if (codeMatch) {
      return (
        <code
          key={`code-${index}`}
          className="rounded-md border border-[#c9a227]/30 bg-[#c9a227]/10 px-1.5 py-0.5 text-xs font-mono font-medium text-[#c9a227]"
        >
          {codeMatch[1]}
        </code>
      );
    }

    // 5. Italic: *text* or _text_
    const italicMatch = /^(\*|_)(.+?)\1$/.exec(token);
    if (italicMatch) {
      return (
        <em key={`italic-${index}`} className="italic text-gray-200">
          {italicMatch[2]}
        </em>
      );
    }

    return <React.Fragment key={`text-${index}`}>{token}</React.Fragment>;
  });
}

function RichText({ text }: { text: string }) {
  if (!text) return null;
  return <>{parseInlineFormatting(text)}</>;
}

function TextWithBreaks({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line.slice(0, 20)}-${index}`}>
          <RichText text={line} />
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function BlogBlock({ block }: { block: BlogContentBlock }) {
  if (block.type === 'heading') {
    if (block.level === 3) {
      return (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
            <span className="h-px w-8 bg-gradient-to-r from-[#c9a227] to-transparent" />
          </div>
          <h3 className="font-montserrat text-xl md:text-2xl font-black text-white">
            <RichText text={block.text} />
          </h3>
        </div>
      );
    }

    return (
      <div className="mt-14 scroll-mt-28">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-0.5 w-10 bg-gradient-to-r from-[#c9a227] to-transparent" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#c9a227]">
            Guia Especialista LUME
          </span>
        </div>
        <h2
          id={slugifyHeading(block.text)}
          className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-white"
        >
          <RichText text={block.text} />
        </h2>
      </div>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-300">
        <TextWithBreaks text={block.text} />
      </p>
    );
  }

  if (block.type === 'list') {
    return (
      <ul className="mt-6 space-y-3.5">
        {block.items.map((item, itemIdx) => (
          <li
            key={`${item.slice(0, 30)}-${itemIdx}`}
            className="group flex items-start gap-3.5 rounded-xl border border-white/[0.05] bg-white/[0.015] p-4 transition-all duration-200 hover:border-[#c9a227]/30 hover:bg-[#c9a227]/[0.02]"
          >
            <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#c9a227] shadow-[0_0_8px_rgba(201,162,39,0.8)]" />
            <div className="text-base md:text-lg leading-relaxed text-gray-300">
              <RichText text={item} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'image') {
    return (
      <figure className="my-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-2xl">
        <img src={block.url} alt={block.alt} className="aspect-[16/9] w-full object-cover" loading="lazy" />
        {block.caption && (
          <figcaption className="border-t border-white/5 bg-black/40 p-4 text-xs md:text-sm text-gray-400">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="my-10 relative overflow-hidden rounded-2xl border-l-4 border-[#c9a227] bg-gradient-to-r from-[#c9a227]/12 via-white/[0.02] to-transparent p-6 md:p-8 shadow-lg">
        <p className="font-serif text-lg md:text-xl font-medium italic leading-relaxed text-gray-100">
          “<RichText text={block.text} />”
        </p>
        {block.cite && (
          <cite className="mt-4 flex items-center gap-2.5 text-xs font-black uppercase tracking-widest not-italic text-[#c9a227]">
            <span className="h-px w-6 bg-[#c9a227]" />
            {block.cite}
          </cite>
        )}
      </blockquote>
    );
  }

  if (block.type === 'callout') {
    return (
      <aside className="my-10 relative overflow-hidden rounded-[1.75rem] border border-[#c9a227]/35 bg-gradient-to-br from-[#c9a227]/12 via-[#0c1828]/95 to-[#04080f] p-7 md:p-8 shadow-xl shadow-black/40">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a227] via-[#f0d065] to-transparent" />
        {block.title && (
          <div className="flex items-center gap-2.5 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c9a227] shadow-[0_0_10px_rgba(201,162,39,0.9)]" />
            <h3 className="font-montserrat text-xl font-black tracking-wide text-[#c9a227]">
              {block.title}
            </h3>
          </div>
        )}
        <div className="text-base md:text-lg leading-relaxed text-gray-200">
          <RichText text={block.text} />
        </div>
      </aside>
    );
  }

  if (block.type === 'card_grid') {
    return (
      <section className="my-12">
        {block.title && (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-8 bg-gradient-to-r from-[#c9a227] to-transparent" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                Seleção Recomendada
              </span>
            </div>
            <h2 className="font-montserrat text-2xl md:text-3xl font-black text-white">{block.title}</h2>
          </div>
        )}
        {block.text && <p className="mt-2 text-base md:text-lg leading-relaxed text-gray-400">{block.text}</p>}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {block.cards.map((card) => (
            <a
              key={`${card.title}-${card.href || card.tag || ''}`}
              href={card.href || '#'}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a227]/50 hover:shadow-xl hover:shadow-[#c9a227]/10"
            >
              <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-gradient-to-bl from-[#c9a227]/15 to-transparent pointer-events-none transition-opacity group-hover:from-[#c9a227]/25" />
              <div>
                {card.tag && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#c9a227]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                    {card.tag}
                  </span>
                )}
                <h3 className="mt-4 font-montserrat text-xl font-black text-white group-hover:text-[#c9a227] transition-colors">
                  {card.title}
                </h3>
                <div className="mt-3 text-sm leading-relaxed text-gray-300">
                  <RichText text={card.text} />
                </div>
              </div>
              {card.href && (
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#c9a227]">
                  {card.label || 'Ver detalhes'}
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
        {block.title && (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-8 bg-gradient-to-r from-[#c9a227] to-transparent" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
                Dados Técnicos
              </span>
            </div>
            <h2 className="font-montserrat text-2xl md:text-3xl font-black text-white">{block.title}</h2>
          </div>
        )}
        {block.text && <p className="mt-2 text-base md:text-lg leading-relaxed text-gray-400">{block.text}</p>}
        <div className="mt-6 overflow-x-auto rounded-[1.75rem] border border-[#c9a227]/30 bg-gradient-to-b from-[#091424] to-[#04080f] p-1 shadow-2xl">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#c9a227]/25 bg-[#c9a227]/15">
                <th className="p-4 text-xs font-black uppercase tracking-widest text-[#c9a227]">{block.firstColumnTitle || 'Item'}</th>
                {block.columns.map((column) => (
                  <th key={column} className="p-4 text-xs font-black uppercase tracking-widest text-[#c9a227]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {block.rows.map((row, rowIndex) => (
                <tr key={`${row.title}-${rowIndex}`} className="transition-colors hover:bg-white/[0.04]">
                  <td className="p-4 font-bold text-white">
                    {row.href ? (
                      <a href={row.href} className="text-[#c9a227] hover:underline flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                        {row.title}
                      </a>
                    ) : (
                      row.title
                    )}
                  </td>
                  {row.values.map((value, valueIndex) => (
                    <td key={`${row.title}-${rowIndex}-${valueIndex}`} className="p-4">
                      <RichText text={value} />
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
      <aside className="my-14 relative overflow-hidden rounded-[2rem] border border-[#c9a227]/40 bg-gradient-to-br from-[#c9a227]/20 via-[#10243e]/90 to-[#04080f] p-8 md:p-10 shadow-2xl shadow-[#c9a227]/10">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#c9a227]/15 blur-3xl pointer-events-none" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a227]/40 bg-[#c9a227]/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#c9a227] mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
          Atendimento Oficial LUME
        </span>
        <h3 className="font-montserrat text-2xl md:text-3xl font-black text-white">{block.title}</h3>
        <p className="mt-3 max-w-2xl text-base md:text-lg leading-relaxed text-gray-300">{block.text}</p>
        <a
          href={block.href}
          target={block.href.startsWith('http') ? '_blank' : undefined}
          rel={block.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="btn-primary mt-6 inline-flex items-center gap-3 text-base py-3.5 px-8 shadow-lg shadow-[#c9a227]/25 hover:scale-105 transition-transform"
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
        <div className="flex items-center gap-3 mb-2">
          <div className="h-0.5 w-8 bg-gradient-to-r from-[#c9a227] to-transparent" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a227]">
            Tira-Dúvidas
          </span>
        </div>
        <h2 className="font-montserrat text-2xl md:text-3xl font-black text-white">Perguntas frequentes</h2>
        <div className="mt-6 space-y-4">
          {block.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition-all duration-200 hover:border-[#c9a227]/40 open:border-[#c9a227]/40 open:bg-[#c9a227]/[0.03]"
            >
              <summary className="flex cursor-pointer items-center justify-between font-montserrat text-lg font-bold text-white transition-colors group-hover:text-[#c9a227]">
                <span>{item.question}</span>
                <span className="ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-[#c9a227] transition-transform duration-300 group-open:rotate-45 group-hover:border-[#c9a227]/50">
                  +
                </span>
              </summary>
              <div className="mt-4 text-base leading-7 text-gray-300 border-t border-white/5 pt-4">
                <RichText text={item.answer} />
              </div>
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
  const waHref = `https://wa.me/5521965140612?text=${encodeURIComponent(`Olá! Li o artigo ${postUrl} e quero um orçamento.`)}`;
  const headings = post.content.flatMap((block) =>
    block.type === 'heading' && block.level !== 3 ? [block.text] : [],
  );

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
              <User className="h-4 w-4 text-[#c9a227]" />
              {post.authorName}
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
          {headings.length >= 3 && (
            <nav
              aria-label="Neste artigo"
              className="mb-10 rounded-[1.5rem] border border-[#c9a227]/25 bg-[#c9a227]/[0.06] p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c9a227]">Neste artigo</p>
              <ul className="mt-3 space-y-2">
                {headings.map((heading) => (
                  <li key={heading}>
                    <a
                      href={`#${slugifyHeading(heading)}`}
                      className="text-sm font-bold leading-6 text-gray-200 hover:text-[#c9a227] hover:underline"
                    >
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {post.content.map((block, index) => (
            <BlogBlock key={`${block.type}-${index}`} block={block} />
          ))}

          {/* E-E-A-T Author Box (Monograma elegante MPG sem foto) */}
          <div className="mt-14 rounded-2xl border border-[#c9a227]/30 bg-gradient-to-br from-[#0c1829] via-[#081220] to-[#04080f] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-[#c9a227]/50 bg-gradient-to-br from-[#1a3a5c] to-[#0a1828] text-xl font-bold font-montserrat tracking-wider text-[#c9a227] shadow-lg shadow-[#c9a227]/10">
                MPG
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-montserrat text-xl font-bold text-white">
                    {post.authorName}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#c9a227]/15 px-2.5 py-0.5 text-xs font-semibold text-[#c9a227] border border-[#c9a227]/30">
                    <ShieldCheck className="h-3 w-3" />
                    Especialista Técnico
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#c9a227]/90">
                  Especialista em Películas de Controle Solar e Fundador da LUME
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  Com anos de experiência prática em soluções arquitetônicas de vidro no Rio de Janeiro, orienta clientes residenciais e comerciais a alcançarem a máxima redução térmica, proteção contra raios UV e privacidade personalizada.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#c9a227] hover:text-white transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Tirar dúvidas diretamente com o especialista
                  </a>
                </div>
              </div>
            </div>
          </div>
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
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#04080f]/95 px-4 pt-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex w-full items-center justify-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Pedir orçamento no WhatsApp
        </a>
      </div>
    </article>
  );
}
