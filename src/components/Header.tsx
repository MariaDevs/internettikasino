'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { NAV } from '@/lib/nav';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-brand-950 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400 text-brand-950" aria-hidden>
            iK
          </span>
          Internettikasino
        </Link>
        <nav aria-label="Päävalikko" className="hidden xl:block">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'whitespace-nowrap rounded-md px-3 py-2 transition hover:bg-white/10',
                    pathname === item.href && 'bg-white/10 text-accent-300',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="rounded-md p-2 hover:bg-white/10 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Sulje valikko' : 'Avaa valikko'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobiilivalikko" className="border-t border-white/10 xl:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-md px-3 py-2.5 hover:bg-white/10" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
