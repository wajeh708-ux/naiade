import type {CSSProperties} from 'react';
import {closing, formatPrice, products} from '../content';
import {bagStore} from '../lib/bag';
import {useReveals} from '../hooks/useReveals';

/**
 * After the film unpins: an ivory sheet with rounded shoulders rises over the
 * last frame, holding all three pieces and the set.
 */
export function Closing() {
  const ref = useReveals<HTMLElement>();
  const total = products.reduce((a, p) => a + p.price, 0);

  const addSet = () => {
    products.forEach((p) => bagStore.add(p.id, 1));
    bagStore.flash('set');
  };

  return (
    <section
      ref={ref}
      id="set"
      className="relative z-10 -mt-[12svh] rounded-t-[clamp(28px,4vw,64px)] bg-bone px-5 pt-[clamp(72px,12vh,140px)] pb-[clamp(64px,10vh,120px)] text-ink md:px-10"
    >
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p data-reveal className="label text-paraiba-deep">
              {closing.eyebrow}
            </p>
            <h2 data-reveal style={{'--d': '80ms'} as CSSProperties} className="display mt-4 text-[clamp(52px,8.6vw,164px)]">
              <span className="uppercase">{closing.title[0]}</span>
              <br />
              <em>{closing.title[1]}</em>
            </h2>
          </div>
          <p data-reveal style={{'--d': '160ms'} as CSSProperties} className="max-w-[40ch] text-[14px] leading-[1.6] text-ink/60 md:col-span-4 md:justify-self-end">
            {closing.body}
          </p>
        </div>

        <ul className="mt-[clamp(40px,8vh,96px)] grid gap-6 md:grid-cols-3 md:gap-5">
          {products.map((p, i) => (
            <li key={p.id} data-reveal style={{'--d': `${i * 110}ms`} as CSSProperties} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#cfcac5]">
                <img
                  src={p.image}
                  alt={`${p.name.join(' ')}, ${p.material}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.06]"
                />
                <span className="label absolute top-4 left-5 text-ink/45">N°{p.index}</span>
                <button
                  type="button"
                  onClick={() => {
                    bagStore.add(p.id, 1);
                    bagStore.flash(p.id);
                  }}
                  className="glint label absolute right-4 bottom-4 left-4 h-12 translate-y-3 rounded-full bg-ink text-bone opacity-0 transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-md:translate-y-0 max-md:opacity-100"
                >
                  <span className="relative z-10">Add to bag — {formatPrice(p.price)}</span>
                </button>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="display text-[clamp(28px,2.4vw,40px)]">
                  {p.name[0]} <em>{p.name[1]}</em>
                </p>
                <p className="text-[14px] tabular-nums text-ink/70">{formatPrice(p.price)}</p>
              </div>
              <p className="mt-1 text-[12.5px] text-ink/50">{p.material}</p>
            </li>
          ))}
        </ul>

        <div
          data-reveal
          className="mt-[clamp(40px,7vh,80px)] flex flex-col gap-6 rounded-[28px] bg-ink px-6 py-6 text-bone md:flex-row md:items-center md:justify-between md:px-10 md:py-7"
        >
          <div className="flex items-center gap-5">
            <div className="flex -space-x-4">
              {products.map((p) => (
                <span key={p.id} className="size-14 overflow-hidden rounded-full bg-[#cfcac5] ring-2 ring-ink">
                  <img src={p.image} alt="" className="h-full w-full scale-150 object-cover" />
                </span>
              ))}
            </div>
            <div>
              <p className="label text-bone/45">{closing.setNote}</p>
              <p className="display mt-1 text-[28px]">
                Earrings, pendant <em>&amp; ring</em>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <p className="display text-[36px] tabular-nums">{formatPrice(total)}</p>
            <button type="button" onClick={addSet} className="glint label h-13 rounded-full bg-paraiba px-8 py-4 text-ink">
              <span className="relative z-10">Add the set</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
