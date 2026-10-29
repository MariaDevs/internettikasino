import { Star } from 'lucide-react';

/** Stars filled to the exact score (e.g. 4.3 → four full stars and a third), plus the number. */
export default function StarRating({ value, size = 16, showValue = true }: { value: number | null; size?: number; showValue?: boolean }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Arvosana ${value.toFixed(1)}/5`} role="img">
      <span className="inline-flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = Math.max(0, Math.min(1, value - (n - 1)));
          return (
            <span key={n} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 fill-slate-200 text-slate-200" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="fill-accent-400 text-accent-400" />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && <span className="text-xs font-semibold text-slate-600" aria-hidden>{value.toFixed(1)}</span>}
    </span>
  );
}
