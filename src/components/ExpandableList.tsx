'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Ordered list whose extra rows (marked by the server with `group-data-[expanded=false]:hidden`)
 * stay in the HTML for crawlers but are hidden until the visitor asks for more.
 */
export default function ExpandableList({
  children,
  hiddenCount,
  label,
}: {
  children: React.ReactNode;
  hiddenCount: number;
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <ol className="group space-y-3" data-expanded={expanded} aria-label={label}>
        {children}
      </ol>
      {hiddenCount > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700"
          >
            {expanded ? 'Näytä vähemmän' : `Näytä lisää kasinoita (${hiddenCount})`}
            <ChevronDown size={16} aria-hidden className={expanded ? 'rotate-180 transition' : 'transition'} />
          </button>
        </div>
      )}
    </>
  );
}
