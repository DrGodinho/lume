import { blogPosts } from '@/content/blog';

const SITE_URL = 'https://lumecontrolesolar.com.br';

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

export type BlogPostSummary = Omit<BlogPost, 'content'>;

export const blogCategories = [
  'Guias',
  'Duvidas frequentes',
  'Tipos de pelicula',
  'Ambientes',
  'Bairros',
  'Economia de energia',
];

function byFeaturedAndDate(a: BlogPost, b: BlogPost) {
  if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

function toSummary(post: BlogPost): BlogPostSummary {
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
}

function getSortedPosts() {
  return [...blogPosts].sort(byFeaturedAndDate);
}

export function getBlogUrl(slug = '') {
  return slug ? `${SITE_URL}/blog/${slug}/` : `${SITE_URL}/blog/`;
}

export async function getPublishedPosts(limit?: number): Promise<BlogPostSummary[]> {
  const posts = getSortedPosts();
  return (limit ? posts.slice(0, limit) : posts).map(toSummary);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  return blogPosts.find((post) => post.slug === slug) || null;
}

export async function getRelatedPosts(post: BlogPost, limit = 3) {
  return getSortedPosts()
    .filter((item) => item.id !== post.id)
    .sort((a, b) => {
      const aSameCategory = a.category === post.category ? 1 : 0;
      const bSameCategory = b.category === post.category ? 1 : 0;
      if (aSameCategory !== bSameCategory) return bSameCategory - aSameCategory;
      return byFeaturedAndDate(a, b);
    })
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
    }));
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
