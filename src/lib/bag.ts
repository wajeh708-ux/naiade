import {useSyncExternalStore} from 'react';

/** A tiny shopping-bag store: product id → quantity, shared by every card. */

type Bag = Record<string, number>;

let bag: Bag = {};
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const bagStore = {
  add(id: string, qty = 1) {
    bag = {...bag, [id]: (bag[id] ?? 0) + qty};
    emit();
  },
  set(id: string, qty: number) {
    const next = {...bag};
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    bag = next;
    emit();
  },
  setOpen(v: boolean) {
    open = v;
    emit();
  },
  /** Announce the last add, for the toast and the bag-count bump. */
  flash(id: string) {
    flash = {id, at: Date.now()};
    emit();
  },
};

let flash: {id: string; at: number} | null = null;

export const useBag = () => useSyncExternalStore(subscribe, () => bag);
export const useBagOpen = () => useSyncExternalStore(subscribe, () => open);
export const useFlash = () => useSyncExternalStore(subscribe, () => flash);
export const bagCount = (b: Bag) => Object.values(b).reduce((a, n) => a + n, 0);
