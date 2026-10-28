import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  name: string;
  path: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Murupolku" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="text-slate-400" aria-hidden />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-slate-700">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-brand-700 hover:underline">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
