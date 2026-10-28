import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';

/** Outbound affiliate CTA. Always nofollow + sponsored. */
export default function PlayButton({ go, label = 'Pelaa nyt', className }: { go: string | null; label?: string; className?: string }) {
  if (!go) return null;
  return (
    <a
      href={`/go/${go}/`}
      rel="nofollow sponsored noopener"
      target="_blank"
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg bg-cta-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-cta-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-600',
        className,
      )}
    >
      {label}
      <ExternalLink size={15} aria-hidden />
    </a>
  );
}
