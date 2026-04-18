import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { neighborhoods } from '../../data/neighborhoods';
import { NeighborhoodTemplate } from '../../components/NeighborhoodTemplate';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(neighborhoods).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const neighborhood = neighborhoods[slug];

  if (!neighborhood) {
    return {};
  }

  return {
    title: neighborhood.metaTitle,
    description: neighborhood.metaDescription,
    alternates: {
      canonical: neighborhood.canonical,
    },
    openGraph: {
      title: neighborhood.metaTitle,
      description: neighborhood.metaDescription,
      url: neighborhood.canonical,
      type: 'website',
      images: [
        {
          url: 'https://lumecontrolesolar.com.br/og-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const neighborhood = neighborhoods[slug];

  if (!neighborhood) {
    notFound();
  }

  return <NeighborhoodTemplate data={neighborhood} />;
}
