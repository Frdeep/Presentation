"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { apiPost } from "@/lib/api";
import { CartItem } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (variantId: string) => void;
  onSetQuantity: (variantId: string, quantity: number) => void;
  onClear: () => void;
};

type CheckoutResponse =
  | { ok: true; orderId: string; totalCents: number; currency: string }
  | { ok: false; error: string };

export function CartDrawer({
  open,
  onClose,
  items,
  onRemove,
  onSetQuantity,
  onClear,
}: Props) {
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ orderId: string } | null>(null);

  const total = useMemo(() => {
    const currency = items[0]?.currency ?? "EUR";
    const totalCents = items.reduce(
      (sum, it) => sum + it.unitPriceCents * it.quantity,
      0
    );
    return { totalCents, currency };
  }, [items]);

  async function submitCheckout(form: HTMLFormElement) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData(form);
      const payload = {
        email: String(fd.get("email") ?? ""),
        fullName: String(fd.get("fullName") ?? ""),
        phone: String(fd.get("phone") ?? "") || undefined,
        addressLine1: String(fd.get("addressLine1") ?? ""),
        addressLine2: String(fd.get("addressLine2") ?? "") || undefined,
        city: String(fd.get("city") ?? ""),
        postalCode: String(fd.get("postalCode") ?? ""),
        country: String(fd.get("country") ?? "FR"),
        items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
      };

      const res = await apiPost<CheckoutResponse>("/api/checkout", payload);
      if (!res.ok) throw new Error(res.error);

      setSuccess({ orderId: res.orderId });
      setStep("success");
      onClear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur" );
    } finally {
      setLoading(false);
    }
  }

  function resetAndClose() {
    setStep("cart");
    setError(null);
    setSuccess(null);
    setLoading(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-slate-950/30"
        onClick={resetAndClose}
        aria-hidden
      />
      <div className="absolute inset-y-0 right-0 w-full max-w-[440px] p-3">
        <div className="glass flex h-full flex-col rounded-3xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-slate-600">
                {step === "success" ? "Confirmation" : "Panier"}
              </div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                {step === "checkout"
                  ? "Finaliser la commande"
                  : step === "success"
                    ? "Commande créée"
                    : "Votre panier"}
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="tap-highlight-none rounded-full bg-white/60 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
            >
              Fermer
            </button>
          </div>

          {step === "success" ? (
            <div className="mt-6">
              <div className="rounded-2xl bg-white/60 p-4 text-sm text-slate-800">
                <div className="font-semibold">Merci !</div>
                <div className="mt-1">
                  Votre commande a été créée (stock réservé).
                </div>
                <div className="mt-3 text-xs text-slate-600">
                  Référence : <span className="font-mono">{success?.orderId}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="mt-4 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Retour au site
              </button>
            </div>
          ) : step === "checkout" ? (
            <form
              className="mt-5 flex flex-1 flex-col overflow-auto"
              onSubmit={(e) => {
                e.preventDefault();
                void submitCheckout(e.currentTarget);
              }}
            >
              <div className="grid gap-3">
                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nom complet
                  </label>
                  <input
                    name="fullName"
                    required
                    className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Téléphone (optionnel)
                  </label>
                  <input
                    name="phone"
                    className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Adresse
                  </label>
                  <input
                    name="addressLine1"
                    required
                    className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Complément (optionnel)
                  </label>
                  <input
                    name="addressLine2"
                    className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Ville
                    </label>
                    <input
                      name="city"
                      required
                      className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Code postal
                    </label>
                    <input
                      name="postalCode"
                      required
                      className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Pays
                  </label>
                  <input
                    name="country"
                    defaultValue="FR"
                    className="h-11 rounded-xl bg-white/70 px-3 text-sm outline-none ring-1 ring-slate-900/10 focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>Total</span>
                  <span className="font-semibold text-slate-950">
                    {formatMoney(total.totalCents, total.currency)}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="mt-3 w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
                >
                  {loading ? "Traitement…" : "Créer la commande"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("cart")}
                  className="mt-2 w-full rounded-full bg-white/60 px-5 py-3 text-sm font-semibold text-slate-800"
                >
                  Retour au panier
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-5 flex flex-1 flex-col overflow-hidden">
              {items.length === 0 ? (
                <div className="rounded-2xl bg-white/60 p-4 text-sm text-slate-700">
                  Votre panier est vide.
                </div>
              ) : (
                <div className="flex-1 overflow-auto">
                  <div className="grid gap-3">
                    {items.map((it) => (
                      <div
                        key={it.variantId}
                        className="rounded-2xl bg-white/60 p-3 ring-1 ring-slate-900/10"
                      >
                        <div className="grid grid-cols-[56px_1fr] gap-3">
                          <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                            <Image
                              src={it.imageUrl}
                              alt={it.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-950">
                              {it.name}
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              Taille {it.size} • {it.sku}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold text-slate-950">
                                {formatMoney(it.unitPriceCents, it.currency)}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSetQuantity(it.variantId, Math.max(1, it.quantity - 1))
                                  }
                                  className="tap-highlight-none grid h-9 w-9 place-items-center rounded-full bg-white/70 text-sm font-bold text-slate-900"
                                >
                                  −
                                </button>
                                <div className="w-6 text-center text-sm font-semibold text-slate-900">
                                  {it.quantity}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSetQuantity(it.variantId, Math.min(9, it.quantity + 1))
                                  }
                                  className="tap-highlight-none grid h-9 w-9 place-items-center rounded-full bg-white/70 text-sm font-bold text-slate-900"
                                >
                                  +
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onRemove(it.variantId)}
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
                </div>
              )}

              <div className="pt-4">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>Total</span>
                  <span className="font-semibold text-slate-950">
                    {formatMoney(total.totalCents, total.currency)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  disabled={items.length === 0}
                  className="mt-3 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Passer au paiement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
