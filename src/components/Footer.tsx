import type {CSSProperties} from 'react';
import {brand, footer} from '../content';
import {useFitText} from '../hooks/useFitText';
import {useReveals} from '../hooks/useReveals';

export function Footer() {
  const ref = useReveals<HTMLElement>();
  const word = useFitText<HTMLSpanElement>();

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink px-5 pt-[clamp(64px,10vh,120px)] pb-8 text-bone md:px-10">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-10 md:grid-cols-12">
          <div data-reveal className="md:col-span-5">
            <p className="display text-[clamp(34px,3.6vw,56px)]">
              Book a private <em className="text-paraiba">viewing</em>
            </p>
            <form className="mt-6 flex max-w-[440px] items-center border-b border-bone/25 pb-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email"
                className="flex-1 bg-transparent py-2 text-[14px] text-bone placeholder:text-bone/35 focus:outline-none"
              />
              <button type="submit" className="label text-bone/70 hover:text-paraiba">
                Request →
              </button>
            </form>
          </div>
          {footer.columns.map(([title, links], i) => (
            <div key={title} data-reveal style={{'--d': `${(i + 1) * 90}ms`} as CSSProperties} className="md:col-span-2 md:col-start-auto">
              <p className="label text-bone/40">{title}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#set" className="text-[13.5px] text-bone/75 transition-colors hover:text-paraiba">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(56px,10vh,120px)]" aria-hidden>
          <span ref={word} className="display inline-block leading-[0.8] whitespace-nowrap text-bone">
            NA<em className="text-paraiba">Ï</em>ADE
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-bone/10 pt-6 text-[11.5px] text-bone/35 md:flex-row md:justify-between">
          <p>
            © 2026 {brand.name} · {brand.collection} · Developer Wajeh
          </p>
          <p className="max-w-[60ch]">{footer.concept}</p>
        </div>
      </div>
    </footer>
  );
}
