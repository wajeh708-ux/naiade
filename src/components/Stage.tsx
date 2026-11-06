import {useEffect, useRef} from 'react';
import {DURATION, FPS, FRAME_COUNT, loadFrames, type FrameSet} from '../lib/frames';
import {clamp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {CARDS, HERO_OUT, OUTRO_IN, REMAP, cardAmount, focalAt, holdAmount} from '../lib/timeline';
import {products} from '../content';
import {HeroCopy} from './HeroCopy';
import {ProductCard} from './ProductCard';
import {Outro} from './Outro';
import {ChapterRail} from './ChapterRail';

/** Frames the preloader waits for before lifting (coarse spread across the film). */
const READY_AT = 28;

type Props = {onProgress: (loaded: number) => void};

export function Stage({onProgress}: Props) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = root.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', {alpha: false})!;
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let loaded = 0;

    const mobile = () => window.innerWidth < 768;
    const set: FrameSet = mobile() ? 'm' : 'd';
    // The hero frame, then every hold frame, so each landing is sharp first.
    const holds = [0, 5, 10, 15, DURATION].map((s) => Math.round(s * FPS));
    const cancel = loadFrames(set, holds, (i, img) => {
      frames[i] = img;
      loaded++;
      if (loaded <= READY_AT + 1) onProgress(Math.min(1, loaded / READY_AT));
      dirty = true;
    });

    // ---- canvas sizing -------------------------------------------------
    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const nearest = (i: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (frames[i - d]) return frames[i - d]!;
        if (frames[i + d]) return frames[i + d]!;
      }
      return undefined;
    };

    /** Cover-fit a frame into a rect, cropping around the jewel rather than the centre. */
    const draw = (img: HTMLImageElement, rx: number, ry: number, rw: number, rh: number, fx: number, fy: number, zoom: number) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.max(rw / iw, rh / ih) * zoom;
      const vw = rw / s;
      const vh = rh / s;
      const sx = clamp(fx * iw - vw / 2, 0, iw - vw);
      const sy = clamp(fy * ih - vh / 2, 0, ih - vh);
      ctx.drawImage(img, sx, sy, vw, vh, rx, ry, rw, rh);
    };

    // ---- per-frame state ------------------------------------------------
    let playhead = 0;
    let last = performance.now();
    let dirty = true;
    let lastKey = '';
    const cardE = [0, 0, 0];
    const heroEls = () => Array.from(heroRef.current?.querySelectorAll<HTMLElement>('[data-out]') ?? []);
    let heroNodes = heroEls();
    let heroK = -1;
    let outroK = -1;
    let railState = '';

    const styleCard = (el: HTMLElement, e: number, side: 'left' | 'right', isMobile: boolean) => {
      const off = (1 - e) * 100;
      el.style.transform = isMobile
        ? `translate3d(0, ${off}%, 0)`
        : `translate3d(${side === 'left' ? -off : off}%, 0, 0)`;
      el.style.visibility = e < 0.002 ? 'hidden' : 'visible';
      el.style.pointerEvents = e > 0.6 ? 'auto' : 'none';
      el.querySelectorAll<HTMLElement>('[data-k]').forEach((n, i) => {
        const t = clamp((e - 0.3 - i * 0.06) / 0.45);
        n.style.opacity = String(t);
        n.style.transform = `translate3d(0, ${(1 - t) * 22}px, 0)`;
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const {p: u, rect} = pinProgress(section);
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      const isMobile = mobile();

      // Playhead chases the remapped target but never slower than real time.
      const target = REMAP.at(u);
      const diff = target - playhead;
      const step = Math.max(1.25, Math.abs(diff) * 3.2) * dt;
      const prev = playhead;
      playhead = Math.abs(diff) <= step ? target : playhead + Math.sign(diff) * step;
      const velocity = Math.abs(playhead - prev) / Math.max(dt, 1e-3); // film-seconds per second

      // Cards
      let active = -1;
      let activeE = 0;
      CARDS.forEach((w, i) => {
        const e = cardAmount(u, w);
        if (e !== cardE[i]) {
          cardE[i] = e;
          const el = cardRefs.current[i];
          if (el) styleCard(el, e, w.side, isMobile);
          dirty = true;
        }
        if (e > activeE) {
          activeE = e;
          active = i;
        }
      });

      // Hero copy blurs away in a stagger.
      const hk = range(u, HERO_OUT[0], HERO_OUT[1]);
      if (hk !== heroK) {
        heroK = hk;
        if (!heroNodes.length) heroNodes = heroEls();
        const stagger = 0.4 / Math.max(1, heroNodes.length - 1);
        heroNodes.forEach((n, i) => {
          const k = clamp((hk - i * stagger) / 0.6);
          n.style.opacity = String(1 - k);
          n.style.filter = k > 0.001 ? `blur(${(k * 14).toFixed(2)}px)` : 'none';
          n.style.transform = `translate3d(0, ${(-k * 26).toFixed(1)}px, 0)`;
        });
        if (heroRef.current) heroRef.current.style.visibility = hk >= 1 ? 'hidden' : 'visible';
      }

      // Outro lines rise out of their masks.
      const ok = range(u, OUTRO_IN[0], OUTRO_IN[1]);
      if (ok !== outroK && outroRef.current) {
        outroK = ok;
        outroRef.current.style.visibility = ok <= 0 ? 'hidden' : 'visible';
        outroRef.current.querySelectorAll<HTMLElement>('[data-line]').forEach((n, i) => {
          const t = clamp((ok - i * 0.18) / 0.7);
          const e = 1 - Math.pow(1 - t, 3);
          n.style.transform = `translate3d(0, ${(1 - e) * 110}%, 0)`;
        });
        dirty = true;
      }

      // Chapter rail
      const chapter = u < 0.12 || u > 0.9 ? -1 : u < 0.39 ? 0 : u < 0.63 ? 1 : 2;
      const fill = range(u, 0.12, 0.88);
      const rs = `${chapter}|${fill.toFixed(3)}`;
      if (rs !== railState && railRef.current) {
        railState = rs;
        const rail = railRef.current;
        rail.style.opacity = chapter < 0 ? '0' : '1';
        rail.style.setProperty('--fill', fill.toFixed(4));
        rail.querySelectorAll<HTMLElement>('[data-ch]').forEach((n, i) => n.toggleAttribute('data-on', i === chapter));
      }

      if (!onScreen || !W) return;

      const frameIndex = clamp(Math.round(playhead * FPS), 0, FRAME_COUNT - 1);
      const key = `${frameIndex}|${active}|${activeE.toFixed(4)}|${ok.toFixed(3)}|${u.toFixed(4)}`;
      if (!dirty && key === lastKey) return;
      lastKey = key;
      dirty = false;
      const img = nearest(frameIndex);
      if (!img) return;

      // Region left for the film once a card is in.
      let rx = 0;
      let ry = 0;
      let rw = W;
      let rh = H;
      if (active >= 0) {
        const card = cardRefs.current[active];
        if (isMobile) {
          rh = H - (card?.offsetHeight ?? H * 0.66) * activeE;
        } else {
          const cw = (card?.offsetWidth ?? W * 0.42) * activeE;
          rw = W - cw;
          if (CARDS[active].side === 'left') rx = cw;
        }
      }

      const [fx, fy] = focalAt(playhead);
      // Lean in while a card is open, plus a slow drift through each hold.
      const hold = active >= 0 ? holdAmount(u, CARDS[active]) : 0;
      const zoom = 1 + 0.06 * activeE + 0.035 * hold * activeE;

      // Motion blur at speed: let the previous frame linger.
      const persist = clamp((velocity - 2.2) * 0.07, 0, 0.55);
      if (persist > 0.01 && active < 0) {
        ctx.globalAlpha = 1 - persist;
        draw(img, rx, ry, rw, rh, fx, fy, zoom);
        ctx.globalAlpha = 1;
        dirty = true; // keep painting until the trail settles
      } else {
        ctx.globalAlpha = 1;
        draw(img, rx, ry, rw, rh, fx, fy, zoom);
      }

      // Dim under the outro type.
      if (ok > 0) {
        ctx.fillStyle = `rgba(6,8,9,${(ok * 0.5).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const off = onFrame(tick);
    const onResize = () => {
      cardE.fill(-1);
      dirty = true;
    };
    window.addEventListener('resize', onResize);
    return () => {
      off();
      cancel();
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [onProgress]);

  return (
    <section ref={root} id="film" aria-label="The Deep End — film" className="relative h-[1500svh] max-md:h-[1300svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-ink">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        {/* Lens falloff + a floor of shadow for the type */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgb(6_8_9/0.55))]"
        />
        <HeroCopy ref={heroRef} />
        <Outro ref={outroRef} />
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            product={p}
            side={CARDS[i].side}
          />
        ))}
        <ChapterRail ref={railRef} />
      </div>
    </section>
  );
}
