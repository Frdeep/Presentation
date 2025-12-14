"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/money";

type DemoProduct = {
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  sizes: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  product: DemoProduct;
  onAdd: (args: {
    id: string;
    name: string;
    imageUrl: string;
    size: string;
    unitPriceCents: number;
    currency: string;
  }) => void;
  onOpenCart: () => void;
};

export function DemoShopModal({ open, onClose, product, onAdd, onOpenCart }: Props) {
  const [size, setSize] = useState<string>(product.sizes[0] ?? "M");

  const price = useMemo(
    () => formatMoney(product.priceCents, product.currency),
    [product]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-slate-950/30" onClick={onClose} aria-hidden />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[760px] p-3">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-slate-600">
                Démo e-commerce (sans paiement, sans stock)
              </div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                {product.name}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Fabriqué par <span className="font-semibold">{product.manufacturer}</span>
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

          <div className="mt-4 grid gap-4 md:grid-cols-[120px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
              <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2" priority />
            </div>

            <div>
              <p className="text-sm text-slate-700">{product.description}</p>

              <div className="mt-4">
                <div className="text-xs font-semibold tracking-wide text-slate-600">Taille</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const active = s === size;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`tap-highlight-none rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                          active
                            ? "bg-slate-950 text-white"
                            : "bg-white/70 text-slate-800 hover:bg-white"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-slate-600">Prix (démo)</div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">{price}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAdd({
                        id: product.id,
                        name: product.name,
                        imageUrl: product.imageUrl,
                        size,
                        unitPriceCents: product.priceCents,
                        currency: product.currency,
                      });
                      onOpenCart();
                    }}
                    className="tap-highlight-none rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500"
                  >
                    Ajouter au panier (démo)
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="tap-highlight-none rounded-full bg-white/60 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-900/10"
                  >
                    Voir panier
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/60 p-3 text-xs text-slate-600 ring-1 ring-slate-900/10">
                Ceci est une <span className="font-semibold">démo UI</span> : aucun paiement, aucun stock, aucune commande.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
