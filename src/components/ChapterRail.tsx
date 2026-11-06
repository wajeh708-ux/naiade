import {type Ref} from 'react';
import {products} from '../content';

/**
 * A thin vertical rail on the right edge: one tick per piece, the current one
 * lit with its name, and a Paraíba line filling as the camera travels down.
 * `--fill` and `[data-on]` are written by the Stage.
 */
export function ChapterRail({ref}: {ref?: Ref<HTMLDivElement>}) {
  return (
    <div
      ref={ref}
      aria-hidden
      style={{opacity: 0}}
      className="pointer-events-none absolute top-1/2 right-6 z-20 -translate-y-1/2 transition-opacity duration-700 max-md:hidden"
    >
      <div className="relative flex h-[38vh] flex-col justify-between pr-4">
        <span className="absolute top-0 right-0 h-full w-px bg-bone/15" />
        <span className="absolute top-0 right-0 h-full w-px origin-top bg-paraiba [transform:scaleY(var(--fill,0))]" />
        {products.map((p) => (
          <div key={p.id} data-ch className="group flex items-center justify-end gap-3">
            <span className="label translate-x-2 text-bone opacity-0 transition-all duration-700 ease-silk group-data-[on]:translate-x-0 group-data-[on]:opacity-100">
              {p.name.join(' ')}
            </span>
            <span className="label text-bone/35 transition-colors duration-500 group-data-[on]:text-paraiba">{p.index}</span>
            <span className="absolute right-0 h-px w-2 bg-bone/40 transition-all duration-500 group-data-[on]:w-4 group-data-[on]:bg-paraiba" />
          </div>
        ))}
      </div>
    </div>
  );
}
