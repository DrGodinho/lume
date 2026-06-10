import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://lumecontrolesolar.com.br';
const BLOG_TABLE = 'blog_posts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const blogSupabase =
  supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'COLE_SUA_ANON_KEY_AQUI'
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

export type BlogContentBlock =
  | { type: 'heading'; level?: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; url: string; alt: string; caption?: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; title?: string; text: string }
  | {
      type: 'card_grid';
      title?: string;
      text?: string;
      cards: {
        title: string;
        tag?: string;
        text: string;
        href?: string;
        label?: string;
      }[];
    }
  | {
      type: 'comparison_table';
      title?: string;
      text?: string;
      columns: string[];
      rows: {
        title: string;
        href?: string;
        values: string[];
      }[];
    }
  | { type: 'cta'; title: string; text: string; href: string; label: string }
  | { type: 'faq'; items: { question: string; answer: string }[] };

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContentBlock[];
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  coverImageAlt: string;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  featured: boolean;
};

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  category: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  published_at: string | null;
  updated_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean | null;
};

export type BlogPostSummary = Omit<BlogPost, 'content'>;

export const blogCategories = [
  'Guias',
  'Duvidas frequentes',
  'Tipos de pelicula',
  'Ambientes',
  'Bairros',
  'Economia de energia',
];

const blogColumns = `
  id,
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  cover_image_url,
  cover_image_alt,
  author_name,
  published_at,
  updated_at,
  seo_title,
  seo_description,
  featured
`;

function isContentBlock(value: unknown): value is BlogContentBlock {
  if (!value || typeof value !== 'object' || !('type' in value)) return false;
  const block = value as { type?: unknown };
  return typeof block.type === 'string';
}

function normalizeContent(content: unknown): BlogContentBlock[] {
  if (!Array.isArray(content)) return [];
  return content.filter(isContentBlock);
}

function normalizePost(row: BlogPostRow): BlogPost {
  const fallbackDate = row.published_at || row.updated_at || new Date().toISOString();

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    content: normalizeContent(row.content),
    category: row.category || 'Guias',
    tags: row.tags || [],
    coverImageUrl: row.cover_image_url,
    coverImageAlt: row.cover_image_alt || row.title,
    authorName: row.author_name || 'LUME Controle Solar',
    publishedAt: fallbackDate,
    updatedAt: row.updated_at || fallbackDate,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    featured: Boolean(row.featured),
  };
}

export function getBlogUrl(slug = '') {
  return slug ? `${SITE_URL}/blog/${slug}/` : `${SITE_URL}/blog/`;
}

export async function getPublishedPosts(limit?: number): Promise<BlogPostSummary[]> {
  if (!blogSupabase) return [];

  let query = blogSupabase
    .from(BLOG_TABLE)
    .select(blogColumns)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.warn('[blog] Failed to load published posts:', error?.message);
    return [];
  }

  return data.map((row) => {
    const post = normalizePost(row as BlogPostRow);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      coverImageUrl: post.coverImageUrl,
      coverImageAlt: post.coverImageAlt,
      authorName: post.authorName,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      featured: post.featured,
    };
  });
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!blogSupabase) return null;

  const { data, error } = await blogSupabase
    .from(BLOG_TABLE)
    .select(blogColumns)
    .eq('status', 'published')
    .eq('slug', slug)
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) {
    console.warn('[blog] Failed to load post:', error?.message);
    return null;
  }

  return normalizePost(data as BlogPostRow);
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getReadingTime(blocks: BlogContentBlock[]) {
  const words = blocks.reduce((total, block) => {
    if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote') {
      return total + countWords(block.text);
    }

    if (block.type === 'list') {
      return total + countWords(block.items.join(' '));
    }

    if (block.type === 'callout') {
      return total + countWords(`${block.title || ''} ${block.text}`);
    }

    if (block.type === 'faq') {
      return total + countWords(block.items.map((item) => `${item.question} ${item.answer}`).join(' '));
    }

    if (block.type === 'card_grid') {
      return total + countWords(
        `${block.title || ''} ${block.text || ''} ${block.cards
          .map((card) => `${card.title} ${card.tag || ''} ${card.text}`)
          .join(' ')}`
      );
    }

    if (block.type === 'comparison_table') {
      return total + countWords(
        `${block.title || ''} ${block.text || ''} ${block.columns.join(' ')} ${block.rows
          .map((row) => `${row.title} ${row.values.join(' ')}`)
          .join(' ')}`
      );
    }

    if (block.type === 'cta') {
      return total + countWords(`${block.title} ${block.text}`);
    }

    return total;
  }, 0);

  return Math.max(1, Math.ceil(words / 220));
}
