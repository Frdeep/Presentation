"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ open, title, onClose, children }: Props) {
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function closeAnimated() {
    setClosing(true);
    window.setTimeout(() => onClose(), 260);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className={[
          "fixed inset-0 bg-black/40 backdrop-blur-sm",
          "transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          closing ? "opacity-0" : "opacity-100",
        ].join(" ")}
        onClick={closeAnimated}
        aria-label="Fermer"
      />

      <div
        className={[
          "fixed inset-x-0 bottom-0 z-50",
          "rounded-t-3xl bg-white",
          "max-h-[85vh] overflow-y-auto",
          "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          closing ? "translate-y-full" : "translate-y-0",
        ].join(" ")}
        style={{
          transform: `translateY(${Math.max(0, dragY)}px)`,
        }}
        onTouchStart={(e) => {
          startY.current = e.touches[0]?.clientY ?? null;
        }}
        onTouchMove={(e) => {
          const y = e.touches[0]?.clientY ?? null;
          if (startY.current == null || y == null) return;
          const dy = y - startY.current;
          if (dy > 0) setDragY(dy);
        }}
        onTouchEnd={() => {
          if (dragY > 90) closeAnimated();
          else setDragY(0);
          startY.current = null;
        }}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto w-full max-w-6xl px-4 pt-3">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
            {title ? (
              <div className="mt-3 text-center text-sm font-semibold text-gray-700">
                {title}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

