"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Camera,
  Check,
  ChevronRight,
  Clapperboard,
  Facebook,
  Film,
  Headphones,
  Image as LucideImage,
  Instagram,
  Layout,
  Linkedin,
  Mail,
  Minus,
  Palette,
  Phone,
  PlayCircle,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Twitter,
  Video,
  X,
} from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { BottomSheet } from "@/components/BottomSheet";
import { formatMoney } from "@/lib/money";

type NavSectionId = "home" | "services" | "shop";

type Product = {
  id: string;
  name: string;
  badge: string | null;
  category: string;
  sizes: string[];
  priceCents: number;
  currency: string;
  description: string;
  imageUrl: string;
};

type CartItem = {
  uniqueId: number;
  productId: string;
  name: string;
  imageUrl: string;
  size: string;
  unitPriceCents: number;
  currency: string;
  quantity: number;
};

export default function Home() {
  const contactEmail = "deepgitalcontact@gmail.com";

  const products = useMemo<Product[]>(
    () => [
      {
        id: "1",
        name: "Maillot Domicile 2024",
        priceCents: 5990,
        badge: "Nouveau",
        category: "domicile",
        sizes: ["S", "M", "L", "XL", "XXL"],
        description:
          "Maillot officiel domicile Club Mawon, design Ghetball premium avec tissu technique respirant.",
        imageUrl: "/club-mawon/cm-1.jpg",
        currency: "EUR",
      },
      {
        id: "2",
        name: "Maillot Extérieur 2024",
        priceCents: 5990,
        badge: null,
        category: "exterieur",
        sizes: ["S", "M", "L", "XL", "XXL"],
        description:
          "Maillot officiel extérieur, conception Ghetball avec technologie d'évacuation de la transpiration.",
        imageUrl: "/club-mawon/cm-2.jpg",
        currency: "EUR",
      },
      {
        id: "3",
        name: "Maillot Third Rouge",
        priceCents: 6490,
        badge: "Édition Limitée",
        category: "special",
        sizes: ["S", "M", "L", "XL"],
        description:
          "Édition spéciale third kit, rouge intense avec détails exclusifs.",
        imageUrl: "/club-mawon/cm-3.jpg",
        currency: "EUR",
      },
      {
        id: "4",
        name: "Maillot Entraînement",
        priceCents: 4490,
        badge: null,
        category: "entrainement",
        sizes: ["S", "M", "L", "XL", "XXL"],
        description:
          "Maillot d'entraînement confortable, parfait pour les sessions quotidiennes.",
        imageUrl: "/club-mawon/cm-4.jpg",
        currency: "EUR",
      },
      {
        id: "5",
        name: "Maillot Vintage 90s",
        priceCents: 6990,
        badge: "Collector",
        category: "vintage",
        sizes: ["M", "L", "XL"],
        description:
          "Réédition exclusive du maillot iconique des années 90 du club.",
        imageUrl: "/club-mawon/cm-1.jpg",
        currency: "EUR",
      },
      {
        id: "6",
        name: "Maillot Enfant Domicile",
        priceCents: 3990,
        badge: null,
        category: "enfant",
        sizes: ["6-8ans", "10-12ans", "14-16ans"],
        description:
          "Version junior du maillot domicile, conçu pour les jeunes talents.",
        imageUrl: "/club-mawon/cm-2.jpg",
        currency: "EUR",
      },
      {
        id: "7",
        name: "Maillot Gardien",
        priceCents: 5990,
        badge: "Nouveau",
        category: "gardien",
        sizes: ["M", "L", "XL", "XXL"],
        description:
          "Maillot spécial (démo) avec couleurs distinctives et finitions renforcées.",
        imageUrl: "/club-mawon/cm-3.jpg",
        currency: "EUR",
      },
      {
        id: "8",
        name: "Maillot Signature Player",
        priceCents: 7990,
        badge: "Premium",
        category: "signature",
        sizes: ["S", "M", "L", "XL"],
        description:
          "Maillot signature édition limitée avec finition premium (démo).",
        imageUrl: "/club-mawon/cm-4.jpg",
        currency: "EUR",
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<NavSectionId>("home");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productOpen, setProductOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const cartCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const cartTotalCents = cart.reduce(
    (sum, it) => sum + it.unitPriceCents * it.quantity,
    0
  );
  const cartCurrency = cart[0]?.currency ?? "EUR";

  const [badgePop, setBadgePop] = useState(false);
  function triggerBadge() {
    setBadgePop(true);
    window.setTimeout(() => setBadgePop(false), 460);
  }

  useEffect(() => {
    // Nav active section observer
    const ids: NavSectionId[] = ["home", "services", "shop"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];
        const id = (visible?.target as HTMLElement | undefined)?.id as
          | NavSectionId
          | undefined;
        if (id) setActiveId(id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Scroll reveal
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-reveal")
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: NavSectionId) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openProduct(p: Product) {
    setSelectedProduct(p);
    setSelectedSize(null);
    setQuantity(1);
    setProductOpen(true);
  }

  function addToCart(p: Product, size: string, qty: number) {
    triggerBadge();
    setCart((prev) => [
      ...prev,
      {
        uniqueId: Date.now() + Math.floor(Math.random() * 1000),
        productId: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        size,
        unitPriceCents: p.priceCents,
        currency: p.currency,
        quantity: qty,
      },
    ]);
  }

  function removeItem(uniqueId: number) {
    triggerBadge();
    setCart((prev) => prev.filter((it) => it.uniqueId !== uniqueId));
  }

  function updateQuantity(uniqueId: number, newQty: number) {
    if (newQty < 1) return;
    triggerBadge();
    setCart((prev) =>
      prev.map((it) =>
        it.uniqueId === uniqueId ? { ...it, quantity: newQty } : it
      )
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <FloatingNav activeId={activeId} onNav={scrollToSection} />

      {/* SECTION 1 : HERO */}
      <section
        id="home"
        className="min-h-[70vh] bg-gradient-to-b from-white via-red-50 to-white px-4 pt-24 pb-16"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="scroll-reveal inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            Proposition de Services
          </div>

          <h1 className="scroll-reveal mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-gray-900 via-red-700 to-gray-900 bg-clip-text text-transparent">
              Deepgital × Club Mawon
            </span>
          </h1>

          <div className="scroll-reveal mt-6 text-xl font-bold text-gray-800 sm:text-2xl">
            Propulsez votre club vers le succès digital
          </div>

          <p className="scroll-reveal mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            Deepgital, agence experte en marketing digital et création de contenu,
            vous propose une solution complète pour développer la présence digitale
            du Club Mawon et monétiser vos maillots Ghetball.
          </p>

          <div className="scroll-reveal mt-10 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection("services")}
              className="tap-highlight-none rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 font-bold text-white shadow-lg shadow-red-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/50 active:scale-95"
            >
              Découvrir nos services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("shop")}
              className="tap-highlight-none rounded-full border-2 border-red-600 bg-white px-8 py-4 font-bold text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-95"
            >
              Voir la démo boutique
            </button>
          </div>

          <div className="scroll-reveal mx-auto mt-12 max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-white shadow-lg shadow-red-500/10 ring-1 ring-red-100">
              <Image
                src="/club-mawon/cm-1.jpg"
                alt="Aperçu visuel Club Mawon"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 : SERVICE #1 - SOCIAL MEDIA */}
      <section id="services" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="scroll-reveal text-center">
            <div className="text-sm font-bold uppercase tracking-wide text-red-600">
              Service #1
            </div>
            <h2 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Création de Contenu Social Media
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Vidéos créatives, images percutantes et stratégie complète pour dominer
              les réseaux sociaux.
            </p>
          </div>

          {/* Sous-section A */}
          <div className="scroll-reveal mt-12">
            <h3 className="text-2xl font-bold text-gray-900">
              Vidéos Shorts & Reels
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  Icon: Video,
                  title: "Shorts Instagram/TikTok",
                  desc: "8-12 vidéos créatives par mois au format vertical optimisé",
                },
                {
                  Icon: Film,
                  title: "Behind-the-Scenes",
                  desc: "Contenus exclusifs des coulisses du club et des joueurs",
                },
                {
                  Icon: PlayCircle,
                  title: "Promotions Maillots",
                  desc: "Vidéos stylisées de présentation des maillots Ghetball",
                },
                {
                  Icon: Clapperboard,
                  title: "Teasers Événements",
                  desc: "Annonces percutantes pour vos matchs et événements",
                },
              ].map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:border-red-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{title}</div>
                  <div className="mt-2 text-sm text-gray-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sous-section B */}
          <div className="scroll-reveal mt-12">
            <h3 className="text-2xl font-bold text-gray-900">
              Design Graphique & Visuels
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  Icon: LucideImage,
                  title: "Posts & Carousels",
                  desc: "12-20 publications mensuelles avec visuels premium",
                },
                {
                  Icon: Palette,
                  title: "Stories Interactives",
                  desc: "Stories quotidiennes engageantes et sondages",
                },
                {
                  Icon: Layout,
                  title: "Match Days Graphics",
                  desc: "Visuels de match avec stats et lineup",
                },
                {
                  Icon: Sparkles,
                  title: "Bannières Événements",
                  desc: "Designs personnalisés pour vos événements spéciaux",
                },
              ].map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:border-red-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{title}</div>
                  <div className="mt-2 text-sm text-gray-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sous-section C */}
          <div className="scroll-reveal mt-12">
            <h3 className="text-2xl font-bold text-gray-900">
              Stratégie Organique & Ads
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border-2 border-red-500 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    Croissance Organique
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-700">
                  {[
                    "Planning éditorial optimisé",
                    "Hashtags stratégiques",
                    "Engagement communautaire",
                    "Analyse de performance",
                    "Croissance naturelle des abonnés",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 text-red-600" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-lg shadow-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Target className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-bold">Publicités Payantes</div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-white/90">
                  {[
                    "Meta Ads (Facebook/Instagram)",
                    "TikTok Ads",
                    "Ciblage précis fans basketball",
                    "Retargeting intelligent",
                    "ROI optimisé",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-5 w-5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  alert("Contactez Deepgital pour un devis personnalisé !")
                }
                className="tap-highlight-none rounded-full bg-gradient-to-r from-red-600 to-red-700 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-red-500/30 transition-all duration-300 active:scale-95"
              >
                Booster votre présence sociale
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 : SERVICE #2 - ECOMMERCE */}
      <section id="ecommerce" className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="scroll-reveal text-center">
            <div className="text-sm font-bold uppercase tracking-wide text-red-600">
              Service #2
            </div>
            <h2 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Boutique E-commerce Premium
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Vendez vos maillots Ghetball en ligne avec une plateforme professionnelle et performante.
            </p>
          </div>

          <div className="scroll-reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: ShoppingBag,
                title: "Design & Expérience",
                desc: "Interface moderne, responsive et optimisée pour la conversion. Design mobile-first nouvelle génération.",
              },
              {
                Icon: Search,
                title: "Référencement Naturel",
                desc: "Optimisation SEO complète pour apparaître en premier sur Google. Visibilité organique maximisée.",
              },
              {
                Icon: Headphones,
                title: "Maintenance & Accompagnement",
                desc: "Support technique continu, mises à jour régulières et analytics détaillés de vos ventes.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-center text-xl font-bold text-gray-900">{title}</div>
                <div className="mt-3 text-center text-sm text-gray-600">{desc}</div>
              </div>
            ))}
          </div>

          <div className="scroll-reveal my-12 flex items-center gap-4">
            <div className="flex-1 border-t-2 border-gray-300" />
            <div className="text-sm font-semibold uppercase text-gray-500">
              Découvrez la démo interactive ci-dessous
            </div>
            <div className="flex-1 border-t-2 border-gray-300" />
          </div>
        </div>
      </section>

      {/* SECTION 4 : DÉMO BOUTIQUE */}
      <section id="shop" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="scroll-reveal text-center">
            <div className="inline-block rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
              Démo Interactive
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Boutique Club Mawon - Aperçu
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-gray-600">
              Ceci est une démonstration de ce que Deepgital peut créer pour vous. Navigation et panier fonctionnels.
            </p>
          </div>

          <div className="scroll-reveal mx-auto mt-8 max-w-4xl rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
              <div className="text-sm text-red-700">
                <span className="font-bold">Mode démonstration</span> — Les paiements ne sont pas fonctionnels. Ceci est un aperçu visuel de la boutique finale.
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} className="scroll-reveal">
                <button
                  type="button"
                  onClick={() => openProduct(p)}
                  className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20 active:scale-[0.98]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={p.id === "1"}
                    />
                    {p.badge ? (
                      <div className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                        {p.badge}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const defaultSize = p.sizes[0];
                        if (!defaultSize) return;
                        addToCart(p, defaultSize, 1);
                      }}
                      className="tap-highlight-none absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-red-600 shadow-lg shadow-red-500/30 transition-transform duration-300 hover:scale-105 active:scale-95"
                      aria-label="Ajouter"
                      title="Ajouter au panier (démo)"
                    >
                      <Plus className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {p.name}
                    </div>
                    <div className="mt-2 text-lg font-bold text-red-600">
                      {formatMoney(p.priceCents, p.currency)}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 : GALERIE SOCIAL MEDIA */}
      <section id="social" className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="scroll-reveal">
            <h2 className="text-3xl font-bold text-gray-900">
              Exemples de Créations Social Media
            </h2>
            <p className="mt-3 text-gray-600">
              Visuels et vidéos que Deepgital produirait pour le Club Mawon
            </p>
          </div>

          <div className="scroll-reveal mt-10 grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, idx) => {
              const img = `/club-mawon/cm-${(idx % 4) + 1}.jpg`;
              const Icon = idx % 2 === 0 ? Video : Camera;
              return (
                <button
                  key={idx}
                  type="button"
                  className="group relative aspect-square overflow-hidden rounded-lg"
                  onClick={() => alert("Démo : aperçu social media")}
                >
                  <Image src={img} alt={`Création ${idx + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 transition-opacity duration-300 group-hover:bg-black/40" />
                  <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="scroll-reveal mt-6 text-sm text-gray-500">
            Publication régulière et stratégie d&apos;engagement pour booster votre communauté.
          </div>
        </div>
      </section>

      {/* SECTION 6 : CTA FINAL */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <div className="scroll-reveal">
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Prêt à Propulser le Club Mawon ?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-xl opacity-90">
              Deepgital est votre partenaire idéal pour dominer les réseaux sociaux et vendre vos maillots Ghetball en ligne.
            </p>
            <button
              type="button"
              onClick={() =>
                alert(`Merci de l'intérêt ! Contactez Deepgital à : ${contactEmail}`)
              }
              className="tap-highlight-none mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-red-600 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 active:scale-95"
            >
              Contactez-nous pour un Devis Gratuit
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7 : FOOTER */}
      <footer className="bg-gradient-to-br from-red-900 to-red-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <div className="text-xl font-bold">Deepgital</div>
              <p className="mt-3 text-sm text-red-200">
                Agence créative spécialisée en marketing digital, création de contenu social media et développement web.
              </p>
            </div>

            <div>
              <div className="font-semibold">Nos Services</div>
              <ul className="mt-3 space-y-2 text-sm text-red-200">
                <li>Social Media Management</li>
                <li>Création Vidéo & Photo</li>
                <li>Boutiques E-commerce</li>
                <li>Référencement SEO</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold">Contact</div>
              <div className="mt-3 space-y-2 text-sm text-red-200">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>

              <div className="mt-4 flex gap-4 text-red-200">
                <Instagram className="h-5 w-5" />
                <Facebook className="h-5 w-5" />
                <Twitter className="h-5 w-5" />
                <Linkedin className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-red-800 pt-6 text-center text-sm text-red-300">
            © 2024 Deepgital - Agence Créative Digitale
            <div className="mt-2 text-xs">
              ⚠️ Ceci est une démonstration de proposition commerciale pour le Club Mawon
            </div>
          </div>
        </div>
      </footer>

      {/* FAB PANIER */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="tap-highlight-none fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-500/40 transition-transform duration-200 hover:scale-110 active:scale-95"
        aria-label="Ouvrir le panier"
      >
        <ShoppingBag className="mx-auto h-6 w-6 text-white" />
        {cartCount > 0 ? (
          <span
            className={[
              "absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full",
              "bg-red-900 text-xs font-bold text-white",
              "animate-bounce",
              badgePop ? "badge-pop" : "",
            ].join(" ")}
          >
            {cartCount}
          </span>
        ) : null}
      </button>

      {/* Bottom Sheet PRODUIT */}
      <BottomSheet
        open={productOpen}
        onClose={() => setProductOpen(false)}
        title="Produit"
      >
        {selectedProduct ? (
          <div className="pb-28">
            <div className="aspect-square overflow-hidden rounded-2xl">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                width={900}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <div className="text-2xl font-bold text-gray-900">
                {selectedProduct.name}
              </div>
              <div className="mt-2 text-3xl font-bold text-red-600">
                {formatMoney(selectedProduct.priceCents, selectedProduct.currency)}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                {selectedProduct.description}
              </p>
            </div>

            <div className="mt-6">
              <div className="font-semibold text-gray-900">Taille</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedProduct.sizes.map((s) => {
                  const active = s === selectedSize;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={[
                        "tap-highlight-none min-w-[44px] h-11 px-4 rounded-xl font-semibold",
                        "transition-all duration-300",
                        active
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600",
                        "active:scale-95",
                      ].join(" ")}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="font-semibold text-gray-900">Quantité</div>
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="tap-highlight-none grid h-11 w-11 place-items-center rounded-xl bg-gray-100 active:scale-95"
                  aria-label="Diminuer"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="min-w-[40px] text-center text-xl font-bold">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                  className="tap-highlight-none grid h-11 w-11 place-items-center rounded-xl bg-gray-100 active:scale-95"
                  aria-label="Augmenter"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 mt-8 bg-white pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={(e) => {
                  if (!selectedSize) {
                    alert("Veuillez sélectionner une taille");
                    return;
                  }
                  const btn = e.currentTarget;
                  btn.classList.remove("btn-bounce");
                  void btn.offsetWidth;
                  btn.classList.add("btn-bounce");
                  addToCart(selectedProduct, selectedSize, quantity);
                  setProductOpen(false);
                  setCartOpen(true);
                }}
                className="tap-highlight-none h-14 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
              >
                Ajouter au panier - {formatMoney(selectedProduct.priceCents * quantity, selectedProduct.currency)}
              </button>
              <div className="mt-2 text-center text-xs text-gray-500">
                Démo uniquement — aucun paiement, aucune commande.
              </div>
            </div>
          </div>
        ) : null}
      </BottomSheet>

      {/* Bottom Sheet PANIER */}
      <BottomSheet open={cartOpen} onClose={() => setCartOpen(false)} title="Panier">
        <div className="pb-28">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">Mon Panier</div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="tap-highlight-none grid h-10 w-10 place-items-center rounded-full bg-gray-100 active:scale-95"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
              <div className="mt-4 text-gray-500">Votre panier est vide</div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((it) => (
                  <div
                    key={it.uniqueId}
                    className="flex gap-4 rounded-2xl bg-gray-50 p-4"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                      <Image src={it.imageUrl} alt={it.name} fill className="object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {it.name}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Taille : {it.size}</div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.uniqueId, it.quantity - 1)}
                          className="tap-highlight-none grid h-7 w-7 place-items-center rounded-lg bg-white shadow-sm active:scale-95"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="min-w-[32px] text-center text-sm font-bold text-gray-900">
                          {it.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.uniqueId, it.quantity + 1)}
                          className="tap-highlight-none grid h-7 w-7 place-items-center rounded-lg bg-white shadow-sm active:scale-95"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        type="button"
                        onClick={() => removeItem(it.uniqueId)}
                        className="tap-highlight-none grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 active:scale-95"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="text-sm font-bold text-red-600">
                        {formatMoney(it.unitPriceCents * it.quantity, it.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Sous-total</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(cartTotalCents, cartCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Livraison</span>
                  <span className="font-semibold text-emerald-600">Gratuite</span>
                </div>
                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">
                    {formatMoney(cartTotalCents, cartCurrency)}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="sticky bottom-0 mt-6 bg-white pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() =>
                alert(
                  "Mode démo - Paiement non fonctionnel. Contactez Deepgital pour activer les paiements !"
                )
              }
              className="tap-highlight-none h-14 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-60 active:scale-[0.98]"
            >
              Commander - {formatMoney(cartTotalCents, cartCurrency)}
            </button>
            <div className="mt-2 text-center text-xs text-gray-500">
              Démo uniquement — aucun paiement, aucune transaction.
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
