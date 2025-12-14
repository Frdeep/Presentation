"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type CartItem = {
  variantId: string;
  sku: string;
  size: string;
  name: string;
  imageUrl: string;
  unitPriceCents: number;
  currency: string;
  quantity: number;
};

const STORAGE_KEY = "clubmawon_cart_v1";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const total = useMemo(() => {
    const currency = items[0]?.currency ?? "EUR";
    const totalCents = items.reduce(
      (sum, it) => sum + it.unitPriceCents * it.quantity,
      0
    );
    return { totalCents, currency };
  }, [items]);

  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.variantId === item.variantId);
      if (idx === -1) return [...prev, { ...item, quantity: qty }];
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        quantity: Math.min(9, next[idx].quantity + qty),
      };
      return next;
    });
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((p) => p.variantId !== variantId));
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.variantId === variantId ? { ...p, quantity } : p))
        .filter((p) => p.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, total, count, add, remove, setQuantity, clear };
}
