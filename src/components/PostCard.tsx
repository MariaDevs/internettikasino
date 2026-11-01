import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/data';
import { formatDate } from '@/lib/site';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-brand-600/30 hover:shadow-lg motion-safe:hover:-translate-y-1">
      <Link href={`/${post.slug}/`} className="block aspect-[16/9] overflow-hidden bg-brand-900" tabIndex={-1} aria-hidden>
        {post.image ? (
          <Image src={post.image} alt="" width={640} height={360} className="h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-105" />
        ) : (
          <span className="flex h-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-950 p-6 text-center text-lg font-bold text-white">
            {post.title}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={post.modified} className="text-xs text-slate-500">{formatDate(post.modified)}</time>
        <h3 className="mt-1 text-lg font-bold leading-snug text-slate-900">
          <Link href={`/${post.slug}/`} className="transition-colors group-hover:text-brand-700">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.description}</p>
      </div>
    </article>
  );
}
