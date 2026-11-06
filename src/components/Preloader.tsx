import {useEffect, useState} from 'react';
import {brand} from '../content';

/**
 * Holds the page on the wordmark while the hero frame and a coarse spread of
 * the film decode, then lifts like a curtain. Gives up waiting after 6 s.
 */
export function Preloader({progress}: {progress: number}) {
  const [gone, setGone] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const done = progress >= 1 || timedOut;

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 1600);
    return () => window.clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[70] grid place-items-center bg-ink transition-[clip-path] delay-300 duration-[1200ms] ease-drawer ${
        done ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'
      }`}
    >
      <div className="text-center">
        <p className="display text-[clamp(44px,8vw,96px)] tracking-[0.2em] text-bone">{brand.name}</p>
        <div className="mx-auto mt-6 h-px w-[min(240px,50vw)] overflow-hidden bg-bone/10">
          <div
            className="h-full origin-left bg-paraiba transition-transform duration-500 ease-silk"
            style={{transform: `scaleX(${done ? 1 : progress})`}}
          />
        </div>
        <p className="label mt-4 text-bone/40">{brand.collection} · Paraíba tourmaline</p>
      </div>
    </div>
  );
}
