import {type Ref} from 'react';
import {outro} from '../content';

/** The last line, over the rewound wide shot. Lines rise out of masks (driven by the Stage). */
export function Outro({ref}: {ref?: Ref<HTMLDivElement>}) {
  return (
    <div
      ref={ref}
      style={{visibility: 'hidden'}}
      className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-5 text-center"
    >
      <p className="display text-[clamp(52px,10.5vw,190px)]">
        <span className="block overflow-hidden pb-[0.08em]">
          <span data-line className="block uppercase text-bone [transform:translate3d(0,110%,0)]">
            {outro.line1}
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.12em]">
          <span data-line className="block text-paraiba [transform:translate3d(0,110%,0)]">
            <em>{outro.line2[0]}</em>
            <span className="uppercase">{outro.line2[1]}</span>
          </span>
        </span>
      </p>
    </div>
  );
}
