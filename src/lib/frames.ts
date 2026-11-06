/**
 * The film runs off a decoded WebP frame sequence rather than a <video>:
 * scrubbing a <video> means async seeks that drop under fast scrolling, while
 * pre-decoded bitmaps make picking a frame an array index.
 *
 * Source: one film of four shots chained through the
 * keyframes (hero → face → earring → pendant → ring), 24 fps.
 */

export const FRAME_COUNT = 481;
export const FPS = 24;
export const DURATION = (FRAME_COUNT - 1) / FPS;

export type FrameSet = 'd' | 'm';

export const frameUrl = (set: FrameSet, i: number) =>
  `${import.meta.env.BASE_URL}frames/${set}/c${String(i + 1).padStart(3, '0')}.webp`;

/** Resting frames first, then every 32nd, every 16th… so a fast scroller always has a neighbour. */
function loadOrder(count: number, priority: number[]): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (i: number) => {
    if (i < 0 || i >= count || seen.has(i)) return;
    seen.add(i);
    order.push(i);
  };
  priority.forEach(push);
  for (let stride = 32; stride >= 1; stride /= 2) for (let i = 0; i < count; i += stride) push(i);
  push(count - 1);
  return order;
}

function loadOne(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    const done = () => resolve(img);
    img.decode().then(done, () => (img.complete ? done() : (img.onload = done)));
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
  });
}

/** Streams the sequence coarse-to-fine, six requests at a time. Returns a cancel function. */
export function loadFrames(
  set: FrameSet,
  priority: number[],
  onFrame: (index: number, img: HTMLImageElement) => void,
) {
  const queue = loadOrder(FRAME_COUNT, priority);
  let cancelled = false;

  const worker = async () => {
    while (!cancelled && queue.length) {
      const i = queue.shift()!;
      try {
        const img = await loadOne(frameUrl(set, i));
        if (!cancelled) onFrame(i, img);
      } catch {
        // A missing frame just means its neighbour gets painted instead.
      }
    }
  };

  // The hero frame alone first, so it paints before anything competes.
  const first = queue.shift()!;
  loadOne(frameUrl(set, first))
    .then((img) => !cancelled && onFrame(first, img))
    .catch(() => {})
    .finally(() => {
      for (let k = 0; k < 6; k++) void worker();
    });

  return () => {
    cancelled = true;
  };
}
