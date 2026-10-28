import Link from 'next/link';
import { NAV } from '@/lib/nav';

export const metadata = { title: 'Sivua ei löytynyt', robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-800">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Sivua ei löytynyt</h1>
      <p className="mt-2 text-slate-600">Sivu on ehkä siirretty. Kokeile jotain näistä:</p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {[{ label: 'Etusivu', href: '/' }, ...NAV].map((n) => (
          <li key={n.href}>
            <Link href={n.href} className="inline-block rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-brand-600">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
