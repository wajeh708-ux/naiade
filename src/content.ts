/**
 * All copy lives here. NAÏADE is a placeholder concept brand for this demo —
 * the pieces, prices and specs are invented.
 */

export const brand = {
  name: 'NAÏADE',
  collection: 'The Deep End',
  tagline: 'Fine jewellery for after hours',
};

export const nav = ['Collections', 'Atelier', 'The Deep End', 'Journal'];

export const hero = {
  // Headline lines: roman parts render as capitals, italic parts stay lower-case.
  headline: [
    [{t: 'Born', i: true}, {t: ' in'}],
    [{t: 'still water.'}],
    [{t: 'Worn '}, {t: 'after', i: true}, {t: ' dark.'}],
  ],
  line: 'Pear-cut Paraíba tourmaline, set in 18K white gold.',
};

export type Product = {
  id: string;
  index: string;
  eyebrow: string;
  name: [string, string];
  material: string;
  description: string;
  image: string;
  specs: [label: string, value: string][];
  price: number;
};

const media = (f: string) => `${import.meta.env.BASE_URL}media/${f}`;

export const products: Product[] = [
  {
    id: 'undertow-drops',
    index: '01',
    eyebrow: 'Fine earrings',
    name: ['Undertow', 'Drops'],
    material: '18K white gold & Paraíba tourmaline',
    description:
      'A pair of pear-cut Paraíba drops hung from round brilliant studs on a hidden articulated link, so they move a half-beat after you do.',
    image: media('earrings.webp'),
    specs: [
      ['Paraíba', '2 × 2.05 ct'],
      ['Diamonds', '0.42 ct, D–F'],
      ['Drop', '28 mm'],
    ],
    price: 12400,
  },
  {
    id: 'deep-end-pendant',
    index: '02',
    eyebrow: 'Pendant necklace',
    name: ['Deep End', 'Pendant'],
    material: '18K white gold & Paraíba tourmaline',
    description:
      'One 3.1 ct pear in a four-claw basket, a single diamond at the bail and a chain fine enough to disappear against the skin.',
    image: media('pendant.webp'),
    specs: [
      ['Paraíba', '3.10 ct'],
      ['Chain', '42 + 3 cm'],
      ['Metal', '18K white gold'],
    ],
    price: 9600,
  },
  {
    id: 'night-swim-ring',
    index: '03',
    eyebrow: 'Cocktail ring',
    name: ['Night Swim', 'Ring'],
    material: '18K white gold, Paraíba & pavé halo',
    description:
      'A pear-cut Paraíba ringed in a halo of hand-set micro-pavé, raised on a slim knife-edge band that sits flush with the finger beside it.',
    image: media('ring.webp'),
    specs: [
      ['Paraíba', '3.40 ct'],
      ['Halo', '28 × 0.01 ct'],
      ['Band', '1.8 mm'],
    ],
    price: 16200,
  },
];

export const outro = {
  line1: 'Three pieces.',
  line2: ['One ', 'night swim.'],
};

export const closing = {
  eyebrow: 'The complete set',
  title: ['Take the whole', 'deep end'],
  body: 'Earrings, pendant and ring, cut from stones of the same parcel so their colour matches under any light. Delivered in one case, hand-finished in our atelier.',
  setNote: 'Set of three',
};

export const footer = {
  columns: [
    ['Shop', ['The Deep End', 'Earrings', 'Necklaces', 'Rings']],
    ['Atelier', ['Our stones', 'Bespoke', 'Care & repairs', 'Book a viewing']],
    ['House', ['Journal', 'Stockists', 'Contact', 'Careers']],
  ] as [string, string[]][],
  concept: 'NAÏADE is a concept brand made for a design study. Pieces, prices and imagery are fictional.',
};

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(n);
