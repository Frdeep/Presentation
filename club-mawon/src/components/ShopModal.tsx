"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (args: {
    variantId: string;
    sku: string;
    size: string;
    name: string;
    imageUrl: string;
    unitPriceCents: number;
    currency: string;
  }) => void;
};

export function ShopModal({ open, onClose, product, onAddToCart }: Props) {
  const [size, setSize] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (!product || !size) return null;
    return product.variants.find((v) => v.size === size) ?? null;
  }, [product, size]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-slate-950/30"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[720px] p-3">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-slate-600">
                Boutique
              </div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                {product?.name ?? "Produit"}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Fabriqué par <span className="font-semibold">Ghetball</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="tap-highlight-none rounded-full bg-white/60 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
            >
              Fermer
            </button>
          </div>

          {product ? (
            <div className="mt-4 grid grid-cols-[92px_1fr] gap-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              <div>
                <p className="text-sm text-slate-700">{product.description}</p>

                <div className="mt-4">
                  <div className="text-xs font-semibold tracking-wide text-slate-600">
                    Taille
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const disabled = v.stock <= 0;
                      const active = size === v.size;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSize(v.size)}
                          disabled={disabled}
                          className={`tap-highlight-none rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                            disabled
                              ? "bg-slate-100 text-slate-400"
                              : active
                                ? "bg-slate-950 text-white"
                                : "bg-white/70 text-slate-800 hover:bg-white"
                          }`}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-slate-600">
                      Prix
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-950">
                      {selected
                        ? formatMoney(selected.priceCents, selected.currency)
                        : "—"}
                    </div>
                    {selected ? (
                      <div className="text-xs text-slate-600">
                        Stock: {selected.stock}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!product || !selected) return;
                      onAddToCart({
                        variantId: selected.id,
                        sku: selected.sku,
                        size: selected.size,
                        name: product.name,
                        imageUrl: product.imageUrl,
                        unitPriceCents: selected.priceCents,
                        currency: selected.currency,
                      });
                    }}
                    disabled={!selected || selected.stock <= 0}
                    className="tap-highlight-none rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-sm text-slate-700">
              Chargement du produit…
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500">
            Paiement sécurisé (V1) — commande créée côté serveur, stock réservé.
          </div>
        </div>
      </div>
    </div>
  );
}
