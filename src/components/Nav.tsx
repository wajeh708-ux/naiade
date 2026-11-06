import {useEffect, useState} from 'react';
import {brand, nav} from '../content';
import {bagCount, bagStore, useBag, useFlash} from '../lib/bag';

/**
 * Thin top bar, white in `mix-blend-difference` so it reads over both the
 * night film and the ivory cards.
 */
export function Nav() {
  const bag = useBag();
  const flash = useFlash();
  const count = bagCount(bag);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    if (flash) setBump(flash.at);
  }, [flash]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 text-white mix-blend-difference">
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" className="flex items-baseline gap-3" aria-label={`${brand.name} home`}>
          <span className="display text-[22px] tracking-[0.18em] md:text-[24px]">{brand.name}</span>
        </a>

        <nav className="flex items-center gap-8 max-md:hidden" aria-label="Primary">
          {nav.map((n) => (
            <a key={n} href={n === 'The Deep End' ? '#film' : '#set'} className="group relative text-[12.5px] tracking-[0.02em] text-white/80 transition-colors hover:text-white">
              {n}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 ease-silk group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="h-4 w-px bg-white/25 max-md:hidden" />
          <button type="button" aria-label="Account" className="text-white/80 hover:text-white max-md:hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="8" cy="5.2" r="2.7" />
              <path d="M2.8 14c.6-2.8 2.7-4.3 5.2-4.3s4.6 1.5 5.2 4.3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => bagStore.setOpen(true)}
            className="label flex items-center gap-2 text-white/85 hover:text-white"
            aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3 5.5h10l-.8 8.5H3.8L3 5.5Z" />
              <path d="M5.6 5.5V4.4a2.4 2.4 0 0 1 4.8 0v1.1" />
            </svg>
            <span>Bag</span>
            <span key={bump} className={`inline-block tabular-nums ${bump ? 'bump' : ''}`}>
              ({count})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
