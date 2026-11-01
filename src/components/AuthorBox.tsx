import Link from 'next/link';
import { AUTHOR, formatDate } from '@/lib/site';

export default function AuthorBox({ published, modified, compact = false }: { published?: string | null; modified?: string | null; compact?: boolean }) {
  return (
    <div className={compact ? 'flex items-center gap-3 text-sm text-slate-600' : 'flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5'}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-800 font-bold text-white" aria-hidden>
        {AUTHOR.initials}
      </span>
      <div>
        <p>
          Kirjoittanut{' '}
          <Link href={AUTHOR.path} rel="author" className="font-semibold text-slate-900 hover:text-brand-700">{AUTHOR.name}</Link>
          {!compact && <span className="text-slate-500"> · {AUTHOR.role}</span>}
        </p>
        <p className="text-slate-500">
          {modified && <>Päivitetty <time dateTime={modified}>{formatDate(modified)}</time></>}
          {modified && published && published !== modified && ' · '}
          {published && published !== modified && <>Julkaistu <time dateTime={published}>{formatDate(published)}</time></>}
        </p>
        {!compact && (
          <p className="mt-2 text-sm text-slate-600">
            Jokainen arvio perustuu käytännön testiin: tunnistautuminen, talletus, bonusehdot, pelaaminen ja kotiutus.
            Lue lisää <Link href="/internettikasino-arvostelu/" className="text-brand-700 underline">arviointiperiaatteistamme</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
