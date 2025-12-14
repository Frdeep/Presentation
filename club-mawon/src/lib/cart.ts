"use client";

import { useCallback, useMemo, useState } from "react";

export type DemoCartItem = {
  id: string;
  name: string;
  imageUrl: string;
  size: string;
  unitPriceCents: number;
  currency: string;
  quantity: number;
};

const STORAGE_KEY = "clubmawon_demo_cart_v1";

function readCart(): DemoCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as DemoCartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: DemoCartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useDemoCart() {
  const [items, setItems] = useState<DemoCartItem[]>(() => readCart());

  const persist = useCallback((next: DemoCartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  const total = useMemo(() => {
    const currency = items[0]?.currency ?? "EUR";
    const totalCents = items.reduce(
      (sum, it) => sum + it.unitPriceCents * it.quantity,
      0
    );
    return { totalCents, currency };
  }, [items]);

  const add = useCallback(
    (item: Omit<DemoCartItem, "quantity">, qty = 1) => {
      persist((() => {
        const prev = readCart();
        const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size);
        if (idx === -1) return [...prev, { ...item, quantity: qty }];
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: Math.min(9, next[idx].quantity + qty) };
        return next;
      })());
    },
    [persist]
  );

  const remove = useCallback(
    (id: string, size: string) => {
      persist(readCart().filter((p) => !(p.id === id && p.size === size)));
    },
    [persist]
  );

  const setQuantity = useCallback(
    (id: string, size: string, quantity: number) => {
      persist(
        readCart()
          .map((p) => (p.id === id && p.size === size ? { ...p, quantity } : p))
          .filter((p) => p.quantity > 0)
      );
    },
    [persist]
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { items, count, total, add, remove, setQuantity, clear };
}
