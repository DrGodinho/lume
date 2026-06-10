import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/views/BlogPost';
import { getBlogUrl, getPublishedPostBySlug, getPublishedPosts } from '@/lib/blog';

export const revalidate = 300;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artigo nao encontrado',
      robots: { index: false, follow: true },
    };
  }

  const url = getBlogUrl(post.slug);
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const image = post.coverImageUrl || 'https://lumecontrolesolar.com.br/og-image.jpg';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'LUME Controle Solar',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  const posts = await getPublishedPosts(4);
  const relatedPosts = posts
    .filter((item) => item.id !== post.id)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
    }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.seoDescription || post.excerpt,
        image: post.coverImageUrl || 'https://lumecontrolesolar.com.br/og-image.jpg',
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          '@type': 'Organization',
          name: post.authorName,
        },
        publisher: {
          '@type': 'Organization',
          name: 'LUME Controle Solar',
          logo: {
            '@type': 'ImageObject',
            url: 'https://lumecontrolesolar.com.br/novo-logo-lume.png',
          },
        },
        mainEntityOfPage: getBlogUrl(post.slug),
      },
      ...post.content
        .filter((block) => block.type === 'faq')
        .map((block) => ({
          '@type': 'FAQPage',
          mainEntity: block.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost post={post} relatedPosts={relatedPosts} />
    </>
  );
}
