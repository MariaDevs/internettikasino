import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import HubPage from '@/components/HubPage';
import PostPage from '@/components/PostPage';
import { getPage, getPost, hubPages, posts } from '@/lib/data';
import { buildMetadata } from '@/lib/meta';

interface Props {
  params: Promise<{ slug: string }>;
}

// WordPress served pages and posts from the root (/kasinot/, /nopein-kasino/),
// so both live under this one segment to keep every URL unchanged.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...hubPages.map((p) => ({ slug: p.slug })), ...posts.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (page) return buildMetadata({ path: `/${slug}/`, title: page.seoTitle, description: page.description });
  const post = getPost(slug);
  if (post)
    return buildMetadata({
      path: `/${slug}/`,
      title: post.seoTitle || post.title,
      description: post.description,
      image: post.image,
      type: 'article',
      published: post.published,
      modified: post.modified,
    });
  return {};
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage(slug);
  if (page && slug) return <HubPage page={page} />;
  const post = getPost(slug);
  if (post) return <PostPage post={post} />;
  notFound();
}
