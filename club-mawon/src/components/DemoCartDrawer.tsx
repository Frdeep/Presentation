"use client";

import Image from "next/image";
import { DemoCartItem } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

type Props = {
  open: boolean;
  onClose: () => void;
  items: DemoCartItem[];
  total: { totalCents: number; currency: string };
  onRemove: (id: string, size: string) => void;
  onSetQuantity: (id: string, size: string, quantity: number) => void;
  onClear: () => void;
  contactHref: string;
};

export function DemoCartDrawer({
  open,
  onClose,
  items,
  total,
  onRemove,
  onSetQuantity,
  onClear,
  contactHref,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-slate-950/30" onClick={onClose} aria-hidden />
      <div className="absolute inset-y-0 right-0 w-full max-w-[460px] p-3">
        <div className="glass flex h-full flex-col rounded-3xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-slate-600">Panier (démo)</div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">Démo e-commerce</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="tap-highlight-none rounded-full bg-white/60 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
            >
              Fermer
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-white/60 p-3 text-xs text-slate-700 ring-1 ring-slate-900/10">
            Aucun paiement, aucun stock, aucune commande. Le panier sert uniquement à montrer l’UX.
          </div>

          <div className="mt-4 flex-1 overflow-auto">
            {items.length === 0 ? (
              <div className="rounded-2xl bg-white/60 p-4 text-sm text-slate-700 ring-1 ring-slate-900/10">
                Panier vide.
              </div>
            ) : (
              <div className="grid gap-3">
                {items.map((it) => (
                  <div
                    key={`${it.id}_${it.size}`}
                    className="rounded-2xl bg-white/60 p-3 ring-1 ring-slate-900/10"
                  >
                    <div className="grid grid-cols-[56px_1fr] gap-3">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                        <Image src={it.imageUrl} alt={it.name} fill className="object-contain p-1" />
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-950">{it.name}</div>
                        <div className="mt-1 text-xs text-slate-600">Taille {it.size}</div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-950">
                            {formatMoney(it.unitPriceCents, it.currency)}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSetQuantity(it.id, it.size, Math.max(1, it.quantity - 1))}
                              className="tap-highlight-none grid h-9 w-9 place-items-center rounded-full bg-white/70 text-sm font-bold text-slate-900"
                            >
                              −
                            </button>
                            <div className="w-6 text-center text-sm font-semibold text-slate-900">{it.quantity}</div>
                            <button
                              type="button"
                              onClick={() => onSetQuantity(it.id, it.size, Math.min(9, it.quantity + 1))}
                              className="tap-highlight-none grid h-9 w-9 place-items-center rounded-full bg-white/70 text-sm font-bold text-slate-900"
                            >
                              +
                            </button>

                            <button
                              type="button"
                              onClick={() => onRemove(it.id, it.size)}
                              className="tap-highlight-none rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200"
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Total (démo)</span>
              <span className="font-semibold text-slate-950">{formatMoney(total.totalCents, total.currency)}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onClear}
                disabled={items.length === 0}
                className="tap-highlight-none rounded-full bg-white/60 px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Vider
              </button>
              <button
                type="button"
                onClick={() => window.location.assign(contactHref)}
                className="tap-highlight-none rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                Demander la boutique
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
