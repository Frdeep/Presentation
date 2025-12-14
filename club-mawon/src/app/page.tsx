"use client";

import "keen-slider/keen-slider.min.css";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { FlipCard } from "@/components/FlipCard";
import { FloatingNav } from "@/components/FloatingNav";
import { ShopModal } from "@/components/ShopModal";
import { CartDrawer } from "@/components/CartDrawer";
import { apiGet } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { Product } from "@/lib/types";

export default function Home() {
  const [active, setActive] = useState(0);
  const [shopOpen, setShopOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { items, count, add, remove, setQuantity, clear } = useCart();

  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let mounted = true;
    apiGet<{ products: Product[] }>("/api/products")
      .then((res) => {
        if (!mounted) return;
        setProducts(res.products);
      })
      .catch(() => {
        if (!mounted) return;
        setProducts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const product = products?.[0] ?? null;

  const navItems = useMemo(
    () => [
      { label: "Identité", short: "ID" },
      { label: "Mission", short: "MS" },
      { label: "Objectifs", short: "OBJ" },
      { label: "Digital", short: "DIG" },
      { label: "Site", short: "WEB" },
      { label: "Planning", short: "PLAN" },
    ],
    []
  );

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
    {
      rubberband: true,
      slides: { perView: 1, spacing: 18, origin: "center" },
      defaultAnimation: { duration: 520 },
      slideChanged(s) {
        setActive(s.track.details.rel);
      },
    },
    []
  );

  const cards = useMemo(
    () => [
      {
        title: "Identité visuelle",
        kicker: "Carte 1 — Maillot & Branding",
        accent: "red" as const,
        front: (
          <div className="flex h-full flex-col">
            <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
              <Image
                src="/maillot-mawon.svg"
                alt="Maillot officiel Club Mawon"
                fill
                className="object-contain p-3"
                priority
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-900/10">
                Ghetball • Officiel
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-700">
              Une identité forte, reconnaissable instantanément — pensée pour la
              communauté.
            </div>

            <div className="mt-auto grid gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShopOpen(true)}
                className="tap-highlight-none w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500"
              >
                Voir le maillot
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="tap-highlight-none w-full rounded-full bg-white/60 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-900/10"
              >
                Ouvrir le panier
              </button>
            </div>
          </div>
        ),
        back: (
          <div className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">
                Pourquoi le maillot est central
              </div>
              <ul className="mt-2 list-disc pl-5">
                <li>Branding du club & cohérence visuelle</li>
                <li>Reconnaissance immédiate</li>
                <li>Fidélisation et fierté fans</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="text-xs font-semibold tracking-wide text-slate-600">
                Palette
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-white ring-1 ring-slate-900/10" />
                <span className="h-7 w-7 rounded-full bg-rose-600 ring-1 ring-slate-900/10" />
                <span className="h-7 w-7 rounded-full bg-slate-900 ring-1 ring-slate-900/10" />
                <span className="text-xs text-slate-600">
                  Blanc • Rouge • Slate
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Mission stratégique",
        kicker: "Carte 2 — 2 axes",
        accent: "slate" as const,
        front: (
          <div className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">Axe 1</div>
              <div className="mt-2">
                Plateforme e-commerce dédiée à la vente des maillots officiels.
              </div>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">Axe 2</div>
              <div className="mt-2">
                Stratégie social media dynamique pour engager et convertir.
              </div>
            </div>
          </div>
        ),
        back: (
          <div className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">
                Expérience “mobile-first”
              </div>
              <div className="mt-2">
                Swipe fluide, sections en cartes 3D, accès panier en 1 geste.
              </div>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">
                Social = moteur de trafic
              </div>
              <div className="mt-2">
                Teasing drop, UGC fans, coulisses, matchday, liens trackés.
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Objectifs commerciaux",
        kicker: "Carte 3 — 3 objectifs",
        accent: "red" as const,
        front: (
          <div className="grid gap-3 text-sm text-slate-700">
            {[
              ["Faciliter l’achat", "Parcours simple, rapide, sans friction."],
              ["Gestion optimisée", "Stocks & commandes clairs, exportables."],
              ["Revenus additionnels", "Nouvelle source de revenus pour le club."],
            ].map(([h, p]) => (
              <div
                key={h}
                className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10"
              >
                <div className="font-semibold text-slate-950">{h}</div>
                <div className="mt-2">{p}</div>
              </div>
            ))}
          </div>
        ),
        back: (
          <div className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">
                KPI (V1 recommandés)
              </div>
              <ul className="mt-2 list-disc pl-5">
                <li>Taux d’ajout au panier</li>
                <li>Taux de conversion checkout</li>
                <li>Ruptures / vitesse de vente par taille</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        title: "Objectifs digitaux",
        kicker: "Carte 4 — Notoriété / Engagement / Acquisition",
        accent: "slate" as const,
        front: (
          <div className="grid gap-3 text-sm text-slate-700">
            {[
              ["Notoriété", "Visibilité et reconnaissance Club Mawon."],
              ["Engagement", "Interaction forte et régulière avec les fans."],
              ["Acquisition", "Nouveaux fans, partenaires, acheteurs."],
            ].map(([h, p]) => (
              <div
                key={h}
                className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10"
              >
                <div className="font-semibold text-slate-950">{h}</div>
                <div className="mt-2">{p}</div>
              </div>
            ))}
          </div>
        ),
        back: (
          <div className="rounded-2xl bg-white/60 p-4 text-sm text-slate-700 ring-1 ring-slate-900/10">
            <div className="font-semibold text-slate-950">
              Pistes social media (à brancher)
            </div>
            <ul className="mt-2 list-disc pl-5">
              <li>Teasers “drop” + compte à rebours</li>
              <li>UGC fans : repost & challenges</li>
              <li>Matchday : stories, scores, best-of</li>
              <li>Liens trackés vers la boutique</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Site web — features",
        kicker: "Carte 5 — Catalogue / Gestion / Paiement",
        accent: "red" as const,
        front: (
          <div className="grid gap-3 text-sm text-slate-700">
            {[
              ["Catalogue", "Présentation claire et premium du maillot."],
              ["Gestion intelligente", "Stocks, commandes, base clients."],
              ["Expérience optimisée", "Mobile-first + paiements sécurisés."],
            ].map(([h, p]) => (
              <div
                key={h}
                className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10"
              >
                <div className="font-semibold text-slate-950">{h}</div>
                <div className="mt-2">{p}</div>
              </div>
            ))}
          </div>
        ),
        back: (
          <div className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">Backend (V1)</div>
              <ul className="mt-2 list-disc pl-5">
                <li>API produits/tailles/stocks</li>
                <li>Création de commande + réserve stock</li>
                <li>Endpoint admin stock (clé serveur)</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">Frontend (V1)</div>
              <ul className="mt-2 list-disc pl-5">
                <li>Swipe (horizontal) + cartes 3D flip</li>
                <li>Shop modal + panier drawer</li>
                <li>Checkout simple (création commande)</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        title: "Planning & investissement",
        kicker: "Carte 6 — 3 semaines",
        accent: "slate" as const,
        front: (
          <div className="grid gap-3 text-sm text-slate-700">
            {[
              ["Semaines 1–2", "Développement + intégration design."],
              ["Semaines 2–3", "Tests, débogage, intégration données."],
              ["Semaine 3", "Lancement + début campagne."],
            ].map(([h, p]) => (
              <div
                key={h}
                className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10"
              >
                <div className="font-semibold text-slate-950">{h}</div>
                <div className="mt-2">{p}</div>
              </div>
            ))}
          </div>
        ),
        back: (
          <div className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">Budget</div>
              <ul className="mt-2 list-disc pl-5">
                <li>Site : 550€ (remise incluse)</li>
                <li>Maintenance : 60€/mois</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-slate-900/10">
              <div className="font-semibold text-slate-950">
                Prochaine étape
              </div>
              <div className="mt-2">
                Brancher un paiement réel (Stripe/PayPal) + emails
                transactionnels.
              </div>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      <FloatingNav
        items={navItems}
        activeIndex={active}
        onSelect={(idx) => slider.current?.moveToIdx(idx)}
        cartCount={count}
        onOpenCart={() => setCartOpen(true)}
      />

      <header className="mx-auto w-[min(980px,92vw)] pt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-900/10">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              Club Mawon • Boutique officielle
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Maillot officiel, expérience premium.
            </h1>
            <p className="mt-3 max-w-[52ch] text-sm text-slate-700 md:text-base">
              Mobile-first, swipe & cartes 3D. Achetez le maillot fabriqué par{" "}
              <span className="font-semibold">Ghetball</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShopOpen(true)}
            className="tap-highlight-none hidden rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500 md:inline"
          >
            Acheter
          </button>
        </div>
      </header>

      <main className="mt-8 pb-16">
        <div ref={sliderRef} className="keen-slider">
          {cards.map((c) => (
            <div key={c.title} className="keen-slider__slide flex justify-center">
              <FlipCard
                title={c.title}
                kicker={c.kicker}
                front={c.front}
                back={c.back}
                accent={c.accent}
              />
            </div>
          ))}
        </div>

        <div className="mx-auto mt-4 flex w-[min(520px,92vw)] items-center justify-center gap-2">
          {cards.map((_, idx) => {
            const activeDot = idx === active;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => slider.current?.moveToIdx(idx)}
                className={`tap-highlight-none h-2.5 rounded-full transition-all ${
                  activeDot ? "w-8 bg-slate-950" : "w-2.5 bg-slate-950/20"
                }`}
                aria-label={`Aller à la carte ${idx + 1}`}
              />
            );
          })}
        </div>

        <div className="mx-auto mt-10 w-[min(980px,92vw)]">
          <div className="rounded-3xl bg-white/60 p-5 ring-1 ring-slate-900/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-600">
                  V1 e-commerce (backend + frontend)
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  Produits, stocks, commandes — déjà branchés.
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShopOpen(true)}
                  className="tap-highlight-none rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500"
                >
                  Ouvrir la boutique
                </button>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="tap-highlight-none rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  Voir le panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ShopModal
        open={shopOpen}
        onClose={() => setShopOpen(false)}
        product={product}
        onAddToCart={(it) => {
          add(it, 1);
          setShopOpen(false);
          setCartOpen(true);
        }}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onRemove={remove}
        onSetQuantity={setQuantity}
        onClear={clear}
      />

      <button
        type="button"
        onClick={() => setShopOpen(true)}
        className="tap-highlight-none fixed bottom-4 right-4 z-40 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(225,29,72,0.35)] md:hidden"
      >
        Acheter
      </button>
    </div>
  );
}
