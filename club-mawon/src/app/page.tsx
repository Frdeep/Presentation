"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Palette,
  ShoppingBag,
  TrendingUp,
  Video,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { BottomSheet } from "@/components/BottomSheet";
import { Reveal } from "@/components/Reveal";
import { formatMoney } from "@/lib/money";

type SectionId = "home" | "shop" | "about";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  sizes: string[];
  badge?: string;
};

type CartItem = {
  productId: string;
  name: string;
  imageUrl: string;
  size: string;
  unitPriceCents: number;
  currency: string;
  quantity: number;
};

export default function Home() {
  const contactHref =
    "mailto:deepgitalcontact@gmail.com?subject=Club%20Mawon%20—%20Démo%20boutique%20e-commerce";

  const products = useMemo<Product[]>(
    () => [
      {
        id: "jersey-home",
        name: "Maillot Officiel — Home",
        subtitle: "Club Mawon × Ghetball",
        description:
          "Démo visuelle de fiche produit : tailles, quantité, micro-interactions. Aucun paiement, aucun stock, aucune commande.",
        imageUrl: "/maillot-mawon.svg",
        priceCents: 5500,
        currency: "EUR",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        badge: "Nouveau",
      },
      {
        id: "jersey-away",
        name: "Maillot Officiel — Away",
        subtitle: "Édition extérieure",
        description:
          "Même UX que la boutique finale, pour présenter la qualité du design et la fluidité mobile-first.",
        imageUrl: "/maillot-mawon.svg",
        priceCents: 5500,
        currency: "EUR",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      {
        id: "shorts",
        name: "Short Officiel",
        subtitle: "Coupe match",
        description:
          "Démo catalogue + panier. Ce produit est un exemple d’extension de gamme (short, hoodie, accessoires).",
        imageUrl: "/maillot-mawon.svg",
        priceCents: 3500,
        currency: "EUR",
        sizes: ["S", "M", "L", "XL"],
        badge: "Best-seller",
      },
      {
        id: "hoodie",
        name: "Hoodie Club",
        subtitle: "Lifestyle",
        description:
          "Une boutique complète peut inclure variantes, bundles, pages SEO, et une stratégie social pour convertir.",
        imageUrl: "/maillot-mawon.svg",
        priceCents: 6500,
        currency: "EUR",
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<SectionId>("home");
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [size, setSize] = useState<string>("M");
  const [qty, setQty] = useState(1);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartCount = cartItems.reduce((s, it) => s + it.quantity, 0);
  const cartTotal = cartItems.reduce(
    (s, it) => s + it.unitPriceCents * it.quantity,
    0
  );
  const cartCurrency = cartItems[0]?.currency ?? "EUR";

  const [badgePop, setBadgePop] = useState(false);
  function triggerBadgePop() {
    setBadgePop(true);
    window.setTimeout(() => setBadgePop(false), 460);
  }

  useEffect(() => {
    const ids: SectionId[] = ["home", "shop", "about"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        const id = (visible?.target as HTMLElement | undefined)?.id as
          | SectionId
          | undefined;
        if (id) setActiveId(id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  function scrollTo(id: SectionId) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openProduct(p: Product) {
    setSelectedProduct(p);
    setSize(p.sizes[0] ?? "M");
    setQty(1);
    setProductSheetOpen(true);
  }

  function addToCart(p: Product, chosenSize: string, quantity: number) {
    triggerBadgePop();
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === p.id && it.size === chosenSize
      );
      if (idx === -1) {
        return [
          ...prev,
          {
            productId: p.id,
            name: p.name,
            imageUrl: p.imageUrl,
            size: chosenSize,
            unitPriceCents: p.priceCents,
            currency: p.currency,
            quantity,
          },
        ];
      }
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        quantity: Math.min(9, next[idx].quantity + quantity),
      };
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      <FloatingNav activeId={activeId} onNav={scrollTo} />

      {/* HERO */}
      <section
        id="home"
        className="min-h-[60vh] bg-gradient-to-b from-white via-red-50 to-white pt-20"
      >
        <div className="mx-auto max-w-2xl px-4 pb-12 pt-10 text-center">
          <Reveal>
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              Démo boutique e-commerce • Deepgital × Ghetball
            </div>
          </Reveal>

          <Reveal className="mt-5">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Club Mawon
              </span>
            </h1>
          </Reveal>

          <Reveal className="mt-4">
            <p className="text-lg text-gray-800 sm:text-xl">
              Maillots Officiels × <span className="font-semibold">Ghetball</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              En collaboration avec Deepgital — design premium, SEO optimisé et
              stratégie social media.
            </p>
          </Reveal>

          <Reveal className="mt-7">
            <button
              type="button"
              onClick={() => scrollTo("shop")}
              className={[
                "tap-highlight-none inline-flex h-14 items-center justify-center",
                "rounded-full px-7 text-sm font-semibold text-white",
                "bg-gradient-to-r from-red-600 to-red-700",
                "shadow-lg shadow-red-500/30",
                "transition-all duration-[360ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02]",
                "active:scale-95",
              ].join(" ")}
            >
              Découvrir la collection
            </button>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Deepgital s’occupe de tout
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Boutique e-commerce • SEO • Stratégie réseaux sociaux
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                title: "Design Premium",
                desc: "Interfaces modernes et engageantes pour une expérience utilisateur exceptionnelle.",
                Icon: Palette,
              },
              {
                title: "SEO Optimisé",
                desc: "Visibilité maximale sur les moteurs de recherche pour attirer vos fans.",
                Icon: TrendingUp,
              },
              {
                title: "Social Media",
                desc: "Vidéos créatives et visuels percutants publiés régulièrement.",
                Icon: Video,
              },
            ].map(({ title, desc, Icon }) => (
              <Reveal key={title}>
                <div
                  className={[
                    "glass backdrop-blur-xl bg-white/60 border border-white/80",
                    "rounded-2xl p-6 shadow-lg",
                    "transition-all duration-[360ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{title}</div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Notre Collection Exclusive
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Équipements officiels fabriqués par Ghetball
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p) => (
              <Reveal key={p.id}>
                <button
                  type="button"
                  onClick={() => openProduct(p)}
                  className={[
                    "tap-highlight-none text-left",
                    "rounded-[20px] bg-white p-3 shadow-sm",
                    "ring-1 ring-gray-200/70",
                    "transition-all duration-[360ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "hover:shadow-lg hover:-translate-y-0.5",
                    "active:scale-[0.98]",
                  ].join(" ")}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-gradient-to-b from-red-50 to-white">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-contain p-3"
                      priority={p.id === "jersey-home"}
                    />
                    {p.badge ? (
                      <div className="absolute left-2 top-2 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-100">
                        {p.badge}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <div className="line-clamp-1 text-sm font-bold text-gray-900">
                      {p.name}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-gray-500">
                      {p.subtitle}
                    </div>
                    <div className="mt-2 text-base font-extrabold text-red-600">
                      {formatMoney(p.priceCents, p.currency)}
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">À propos</h2>
            <p className="mt-2 text-sm text-gray-600">
              Club Mawon (basket) • Deepgital • Ghetball
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
                <div className="text-lg font-bold text-gray-900">
                  Objectif de cette démo
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Présenter au propriétaire du Club Mawon une{" "}
                  <span className="font-semibold">vitrine visuelle</span> de la
                  boutique : design, UX mobile, micro-interactions, et
                  possibilités.
                </p>
                <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
                  Aucun paiement réel • Aucun backend • Aucune base de données •
                  Aucun stock
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
                <div className="text-lg font-bold text-gray-900">
                  Prochaine étape
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Une fois le design validé, Deepgital déploie la version complète
                  (e-commerce + SEO + social media) avec les intégrations adaptées.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.assign(contactHref)}
                  className={[
                    "tap-highlight-none mt-5 inline-flex h-14 w-full items-center justify-center",
                    "rounded-full bg-gradient-to-r from-red-600 to-red-700",
                    "text-sm font-semibold text-white shadow-lg shadow-red-500/30",
                    "transition-all duration-[360ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "hover:scale-[1.02] active:scale-95",
                  ].join(" ")}
                >
                  Contacter Deepgital
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAB PANIER */}
      <button
        type="button"
        onClick={() => setCartSheetOpen(true)}
        className={[
          "tap-highlight-none fixed bottom-6 right-6 z-40",
          "h-14 w-14 rounded-full",
          "bg-gradient-to-br from-red-600 to-red-700",
          "shadow-lg shadow-red-500/40",
          "transition-transform duration-[360ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:scale-110 active:scale-95",
        ].join(" ")}
        aria-label="Ouvrir le panier"
      >
        <ShoppingBag className="mx-auto h-6 w-6 text-white" />
        {cartCount > 0 ? (
          <span
            className={[
              "absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full",
              "bg-red-900 text-[12px] font-extrabold text-white",
              badgePop ? "badge-pop" : "",
            ].join(" ")}
          >
            {cartCount}
          </span>
        ) : null}
      </button>

      {/* Bottom Sheet: PRODUIT */}
      <BottomSheet
        open={productSheetOpen}
        onClose={() => setProductSheetOpen(false)}
        title="Produit"
      >
        {selectedProduct ? (
          <div className="pb-24">
            <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl bg-gradient-to-b from-red-50 to-white">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                fill
                className="object-contain p-6"
                priority
              />
            </div>

            <div className="mt-5">
              <div className="text-2xl font-bold text-gray-900">
                {selectedProduct.name}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {selectedProduct.subtitle}
              </div>
              <div className="mt-3 text-3xl font-extrabold text-red-600">
                {formatMoney(selectedProduct.priceCents, selectedProduct.currency)}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {selectedProduct.description}
              </p>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-800">Tailles</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedProduct.sizes.map((s) => {
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={[
                        "tap-highlight-none h-11 min-w-11 rounded-full px-4 text-sm font-semibold",
                        "transition-all duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                        "active:scale-95",
                        active
                          ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                          : "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-600",
                      ].join(" ")}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-800">Quantité</div>
              <div className="mt-3 inline-flex items-center gap-3 rounded-full bg-gray-100 p-2">
                <button
                  type="button"
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  className="tap-highlight-none grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm active:scale-95"
                  aria-label="Diminuer"
                >
                  <Minus className="h-5 w-5 text-gray-800" />
                </button>
                <div className="w-8 text-center text-sm font-bold text-gray-900">
                  {qty}
                </div>
                <button
                  type="button"
                  onClick={() => setQty((v) => Math.min(9, v + 1))}
                  className="tap-highlight-none grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm active:scale-95"
                  aria-label="Augmenter"
                >
                  <Plus className="h-5 w-5 text-gray-800" />
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 mt-8 bg-white/90 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
              <button
                type="button"
                onClick={(e) => {
                  const btn = e.currentTarget;
                  btn.classList.remove("btn-bounce");
                  // force reflow to restart animation
                  void btn.offsetWidth;
                  btn.classList.add("btn-bounce");
                  addToCart(selectedProduct, size, qty);
                  setProductSheetOpen(false);
                  setCartSheetOpen(true);
                }}
                className={[
                  "tap-highlight-none h-14 w-full rounded-full",
                  "bg-gradient-to-r from-red-600 to-red-700",
                  "text-sm font-semibold text-white shadow-lg shadow-red-500/30",
                  "transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "active:scale-95",
                ].join(" ")}
              >
                Ajouter au panier — {formatMoney(selectedProduct.priceCents * qty, selectedProduct.currency)}
              </button>
              <div className="mt-2 text-center text-xs text-gray-500">
                Démo uniquement — aucun paiement, aucune commande.
              </div>
            </div>
          </div>
        ) : null}
      </BottomSheet>

      {/* Bottom Sheet: PANIER */}
      <BottomSheet
        open={cartSheetOpen}
        onClose={() => setCartSheetOpen(false)}
        title="Mon Panier"
      >
        <div className="pb-28">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setCartSheetOpen(false)}
              className="tap-highlight-none grid h-11 w-11 place-items-center rounded-full bg-gray-100 text-gray-700 active:scale-95"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200/70">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <div className="mt-4 text-lg font-bold text-gray-900">
                Panier vide
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Ajoute un produit depuis la boutique pour voir l’UX panier.
              </div>
              <button
                type="button"
                onClick={() => {
                  setCartSheetOpen(false);
                  scrollTo("shop");
                }}
                className="tap-highlight-none mt-5 inline-flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 text-sm font-semibold text-white shadow-lg shadow-red-500/30 active:scale-95"
              >
                Aller à la boutique
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3">
                {cartItems.map((it) => (
                  <div
                    key={`${it.productId}_${it.size}`}
                    className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-gray-200/70"
                  >
                    <div className="grid grid-cols-[60px_1fr] gap-3">
                      <div className="relative h-[60px] w-[60px] overflow-hidden rounded-2xl bg-gradient-to-b from-red-50 to-white">
                        <Image
                          src={it.imageUrl}
                          alt={it.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-gray-900">
                          {it.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Taille {it.size}
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="text-sm font-extrabold text-red-600">
                            {formatMoney(it.unitPriceCents, it.currency)}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 p-1">
                              <button
                                type="button"
                                onClick={() => {
                                  triggerBadgePop();
                                  setCartItems((prev) =>
                                    prev.map((p) =>
                                      p.productId === it.productId && p.size === it.size
                                        ? { ...p, quantity: Math.max(1, p.quantity - 1) }
                                        : p
                                    )
                                  );
                                }}
                                className="tap-highlight-none grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm active:scale-95"
                                aria-label="Diminuer"
                              >
                                <Minus className="h-4 w-4 text-gray-800" />
                              </button>
                              <div className="w-6 text-center text-sm font-bold text-gray-900">
                                {it.quantity}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  triggerBadgePop();
                                  setCartItems((prev) =>
                                    prev.map((p) =>
                                      p.productId === it.productId && p.size === it.size
                                        ? { ...p, quantity: Math.min(9, p.quantity + 1) }
                                        : p
                                    )
                                  );
                                }}
                                className="tap-highlight-none grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm active:scale-95"
                                aria-label="Augmenter"
                              >
                                <Plus className="h-4 w-4 text-gray-800" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                triggerBadgePop();
                                setCartItems((prev) =>
                                  prev.filter(
                                    (p) =>
                                      !(
                                        p.productId === it.productId &&
                                        p.size === it.size
                                      )
                                  )
                                );
                              }}
                              className="tap-highlight-none grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-700 ring-1 ring-red-100 active:scale-95"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Sous-total</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(cartTotal, cartCurrency)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                  <span>Livraison</span>
                  <span className="font-semibold text-emerald-600">Gratuite</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-red-600">
                    {formatMoney(cartTotal, cartCurrency)}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="sticky bottom-0 mt-6 bg-white/90 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
            <button
              type="button"
              onClick={() => window.location.assign(contactHref)}
              className={[
                "tap-highlight-none h-14 w-full rounded-full",
                "bg-gradient-to-r from-red-600 to-red-700",
                "text-sm font-semibold text-white shadow-lg shadow-red-500/30",
                "transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "active:scale-95",
              ].join(" ")}
              disabled={cartItems.length === 0}
            >
              Commander (démo) — {formatMoney(cartTotal, cartCurrency)}
            </button>
            <div className="mt-2 text-center text-xs text-gray-500">
              Démo uniquement — le bouton ouvre un email, aucune transaction.
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
