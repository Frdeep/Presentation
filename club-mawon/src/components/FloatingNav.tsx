"use client";

type Props = {
  items: Array<{ label: string; short: string }>;
  activeIndex: number;
  onSelect: (index: number) => void;
  cartCount: number;
  onOpenCart: () => void;
};

export function FloatingNav({
  items,
  activeIndex,
  onSelect,
  cartCount,
  onOpenCart,
}: Props) {
  return (
    <div className="fixed left-1/2 top-4 z-50 w-[min(720px,92vw)] -translate-x-1/2">
      <div className="glass flex items-center justify-between gap-2 rounded-full px-2 py-2">
        <div className="flex items-center gap-1 overflow-x-auto px-1">
          {items.map((it, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={it.label}
                type="button"
                onClick={() => onSelect(idx)}
                className={`tap-highlight-none rounded-full px-3 py-2 text-xs font-semibold transition-colors md:text-sm ${
                  active
                    ? "bg-slate-950 text-white"
                    : "text-slate-700 hover:bg-white/60"
                }`}
                aria-current={active ? "page" : undefined}
                title={it.label}
              >
                <span className="md:hidden">{it.short}</span>
                <span className="hidden md:inline">{it.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCart}
          className="tap-highlight-none relative rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-500 md:text-sm"
        >
          Panier
          {cartCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-slate-950 text-[11px] font-bold text-white">
              {cartCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
