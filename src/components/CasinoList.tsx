import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { getCasino, isTaxFree, licenseLabel, type Casino, type CasinoListEntry } from '@/lib/data';
import StarRating from './StarRating';
import PlayButton from './PlayButton';

/** Ranked casino comparison list used on hub pages (replaces the WP "table-s1" widget). */
export default function CasinoList({ entries }: { entries: CasinoListEntry[] }) {
  const rows = entries
    .map((entry) => ({ entry, casino: getCasino(entry.slug) }))
    .filter((r): r is { entry: CasinoListEntry; casino: Casino } => !!r.casino);
  if (!rows.length) return null;

  return (
    <div className="my-8">
      <ol className="space-y-3" aria-label="Kasinovertailu">
        {rows.map(({ entry, casino }, i) => (
          <li
            key={casino.slug}
            className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[2rem_9rem_1fr_auto] sm:p-5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">
              {i + 1}
            </span>
            <Link href={`/review/${casino.slug}/`} className="flex h-16 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 sm:h-20">
              <Image src={casino.logo} alt={`${casino.name} logo`} width={160} height={64} className="h-auto max-h-12 w-auto object-contain sm:max-h-14" />
            </Link>
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Link href={`/review/${casino.slug}/`} className="text-lg font-bold text-slate-900 hover:text-brand-700">
                  {casino.name}
                </Link>
                <StarRating value={casino.rating} size={14} />
              </div>
              <p className="mt-1 font-semibold text-brand-800">{entry.headline || casino.bonus}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={13} aria-hidden /> Lisenssi: {licenseLabel(casino.license)}
                </span>
                {isTaxFree(casino.license) && (
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700">Verovapaat voitot</span>
                )}
              </p>
            </div>
            <div className="col-span-2 flex gap-2 sm:col-span-1 sm:flex-col">
              <PlayButton go={casino.go} className="flex-1" />
              <Link
                href={`/review/${casino.slug}/`}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:border-brand-600 hover:text-brand-700"
              >
                Lue arvostelu
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-slate-500">18+ | Mainos. Tarkista bonusehdot aina kasinon sivuilta. Pelaa vastuullisesti.</p>
    </div>
  );
}
