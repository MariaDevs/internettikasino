import { Star } from 'lucide-react';

export default function StarRating({ value, size = 16 }: { value: number | null; size?: number }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Arvosana ${value}/5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          aria-hidden
          className={n <= Math.round(value) ? 'fill-accent-400 text-accent-400' : 'fill-slate-200 text-slate-200'}
        />
      ))}
    </span>
  );
}
