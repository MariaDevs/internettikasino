import type { Heading } from '@/lib/content';

export default function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;
  return (
    <nav aria-labelledby="toc-title" className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
      <p id="toc-title" className="mb-3 font-bold text-slate-900">Sisällysluettelo</p>
      <ol className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="block border-l-2 border-transparent pl-2 text-slate-600 transition-colors duration-200 hover:border-accent-400 hover:text-brand-700">{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
