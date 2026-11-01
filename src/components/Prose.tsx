import type { Rendered } from '@/lib/content';
import type { CasinoListEntry } from '@/lib/data';
import CasinoList from './CasinoList';

/**
 * Renders migrated Markdown, inserting casino lists where the WP page had them.
 * Lists sit outside `.prose-ik` so long-form typography never styles their buttons.
 */
export default function Prose({
  content,
  lists = [],
  listStartRank = 1,
}: {
  content: Rendered;
  lists?: CasinoListEntry[][];
  /** Rank of the first casino in each list (e.g. 4 when the top 3 are shown above the text). */
  listStartRank?: number;
}) {
  return (
    <div>
      {content.segments.map((html, i) => (
        <div key={i}>
          {html && <div className="prose-ik" dangerouslySetInnerHTML={{ __html: html }} />}
          {i < content.listIndexes.length && lists[content.listIndexes[i]] && (
            <CasinoList entries={lists[content.listIndexes[i]]} startRank={listStartRank} />
          )}
        </div>
      ))}
    </div>
  );
}
