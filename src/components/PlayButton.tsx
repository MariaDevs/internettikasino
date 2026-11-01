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
        'group/play inline-flex items-center justify-center gap-1.5 rounded-lg bg-cta-600 px-5 py-2.5 font-semibold text-white shadow-sm transition duration-200 hover:bg-cta-700 hover:shadow-md hover:shadow-cta-600/30 motion-safe:hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-600',
        className,
      )}
    >
      {label}
      <ExternalLink size={15} aria-hidden className="transition-transform duration-200 motion-safe:group-hover/play:translate-x-0.5 motion-safe:group-hover/play:-translate-y-0.5" />
    </a>
  );
}
