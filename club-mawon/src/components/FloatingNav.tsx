"use client";

import { useEffect, useMemo, useState } from "react";

type Link = { id: "home" | "services" | "shop"; label: string };

type Props = {
  activeId: Link["id"];
  onNav: (id: Link["id"]) => void;
};

export function FloatingNav({ activeId, onNav }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = useMemo<Link[]>(
    () => [
      { id: "home", label: "Accueil" },
      { id: "services", label: "Services" },
      { id: "shop", label: "Boutique Démo" },
    ],
    []
  );

  return (
    <div
      className={[
        "fixed left-1/2 z-50 w-[min(520px,92vw)] -translate-x-1/2",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        scrolled ? "top-2" : "top-4",
      ].join(" ")}
    >
      <div
        className={[
          "tap-highlight-none glass mx-auto flex items-center justify-center",
          "rounded-full shadow-lg",
          "backdrop-blur-xl bg-white/80",
          "border border-white/50 shadow-red-500/10",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          scrolled ? "scale-[0.96] py-1.5" : "scale-100 py-2",
        ].join(" ")}
      >
        <div className="flex items-center">
          {links.map((l, idx) => {
            const active = l.id === activeId;
            return (
              <div key={l.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onNav(l.id)}
                  className={[
                    "px-4 py-1.5 rounded-full text-sm font-semibold",
                    "min-h-[44px] min-w-[44px]",
                    "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "active:scale-95",
                    active
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600",
                  ].join(" ")}
                >
                  {l.label}
                </button>
                {idx < links.length - 1 ? (
                  <div className="mx-1 h-4 w-px bg-gray-300" aria-hidden />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
