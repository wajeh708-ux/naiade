import {type Ref} from 'react';
import {formatPrice, hero, products} from '../content';

/**
 * The hero frame's type, kept minimal: a two-line Bodoni headline and one
 * readable line bottom left, a compact teaser for the ring bottom right.
 * A soft shadow sits under the type so it reads over the film.
 * Every `[data-out]` node is blurred away by the Stage as the camera moves.
 */
export function HeroCopy({ref}: {ref?: Ref<HTMLDivElement>}) {
  const ring = products[2];
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-10">
      <div
        data-out
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_70%_at_0%_20%,rgb(6_8_9/0.7),transparent_70%),radial-gradient(45%_35%_at_0%_100%,rgb(6_8_9/0.65),transparent_75%)]"
      />

      {/* Headline in the dark space under the logo */}
      <div className="absolute inset-x-0 top-0 mx-auto max-w-[1680px] px-5 pt-[clamp(124px,20vh,210px)] md:px-10">
        <h1 className="display text-paraiba max-md:text-[clamp(36px,9.6vw,56px)] md:text-[clamp(48px,4vw,84px)]">
          {hero.headline.map((line, li) => (
            <span key={li} data-out className="block">
              {line.map((part, pi) =>
                part.i ? (
                  <em key={pi} className="pr-[0.04em]">
                    {part.t}
                  </em>
                ) : (
                  <span key={pi} className="uppercase">
                    {part.t}
                  </span>
                ),
              )}
            </span>
          ))}
        </h1>
      </div>

      <div className="relative mx-auto flex h-full max-w-[1680px] items-end justify-between gap-10 px-5 pb-8 md:px-10 md:pb-12">
        <p data-out className="max-w-[30ch] text-[14px] leading-[1.5] text-bone/80 md:text-[15px]">
          {hero.line}
        </p>
        {/* Compact teaser for the ring on her hand */}
        <div data-out className="flex shrink-0 items-center gap-4 max-md:hidden">
          <div className="text-right">
            <p className="label text-bone/55">N°{ring.index}</p>
            <p className="mt-1.5 text-[14px] font-medium text-bone">{ring.name.join(' ')}</p>
            <p className="display mt-1 text-[22px] text-bone">{formatPrice(ring.price)}</p>
          </div>
          <div className="size-[104px] overflow-hidden rounded-[22px] bg-[#cfcac5] shadow-[0_24px_60px_-18px_rgb(43_240_238/0.3)]">
            <img src={ring.image} alt="" className="h-full w-full scale-[1.3] object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
