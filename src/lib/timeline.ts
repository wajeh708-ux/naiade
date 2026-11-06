import {createRemap, type Beat} from './timeRemap';
import {DURATION} from './frames';
import {clamp, easeOutCubic, range} from './math';

/**
 * The whole page is one camera move: hero → crane up to
 * her face → macro on the earring (card) → down the neck to the pendant
 * (card) → down to the ring hand (card) → a fast rewind back to the wide
 * shot for the last line. `u` is scroll progress through the pinned stage.
 *
 * Film seconds: 0–5 hero→face, 5–10 face→earring, 10–15 earring→pendant,
 * 15–20 pendant→ring.
 */

const END = DURATION;

export const BEATS: Beat[] = [
  [0, 0],
  [0.055, 0], // hero holds while its type blurs away
  [0.17, 5], // push in + crane up to her face
  [0.25, 10], // fast push to the earring
  [0.39, 10], // hold — card 01
  [0.49, 15], // tilt down the neck
  [0.63, 15], // hold — card 02
  [0.73, END], // down to the ring hand
  [0.87, END], // hold — card 03
  [0.955, 0], // rewind to the wide shot
  [1, 0],
];

export const REMAP = createRemap(BEATS, DURATION);

export type CardWindow = {inA: number; inB: number; outA: number; outB: number; side: 'left' | 'right'};

export const CARDS: CardWindow[] = [
  {inA: 0.262, inB: 0.296, outA: 0.362, outB: 0.388, side: 'left'},
  {inA: 0.502, inB: 0.536, outA: 0.602, outB: 0.628, side: 'right'},
  {inA: 0.742, inB: 0.776, outA: 0.842, outB: 0.868, side: 'left'},
];

/** 0 → 1 as the card slides in (eased out), 1 → 0 as it leaves (eased in). */
export function cardAmount(u: number, w: CardWindow): number {
  if (u <= w.inA || u >= w.outB) return 0;
  if (u < w.inB) return easeOutCubic(range(u, w.inA, w.inB));
  if (u <= w.outA) return 1;
  const t = range(u, w.outA, w.outB);
  return 1 - t * t * t;
}

/** How far through a card's hold we are (for the slow drift-in while it's open). */
export const holdAmount = (u: number, w: CardWindow) => clamp((u - w.inA) / (w.outB - w.inA));

/** Hero copy out, outro copy in. */
export const HERO_OUT: [number, number] = [0.006, 0.07];
export const OUTRO_IN: [number, number] = [0.93, 0.975];

/**
 * Where the jewel sits in the 16:9 frame (0–1) at each film second. Used to
 * keep the piece in view when a card narrows the film, and to steer the crop
 * on portrait phones.
 */
export const FOCAL: [t: number, x: number, y: number][] = [
  [0, 0.5, 0.5],
  [5, 0.5, 0.36],
  [10, 0.44, 0.56],
  [15, 0.475, 0.8],
  [END, 0.38, 0.47],
];

export function focalAt(t: number): [number, number] {
  let i = 0;
  while (i < FOCAL.length - 2 && t > FOCAL[i + 1][0]) i++;
  const [t0, x0, y0] = FOCAL[i];
  const [t1, x1, y1] = FOCAL[i + 1];
  const k = clamp((t - t0) / (t1 - t0));
  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
}
