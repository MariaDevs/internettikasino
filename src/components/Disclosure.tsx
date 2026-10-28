import Link from 'next/link';
import { Info } from 'lucide-react';

export default function Disclosure() {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-600">
      <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
      <span>
        Mainosyhteistyö: saatamme saada komission, jos avaat tilin linkkiemme kautta. Se ei vaikuta arvosteluihin.{' '}
        <Link href="/internettikasino-arvostelu/" className="underline">Näin arvioimme kasinot</Link>. 18+
      </span>
    </p>
  );
}
