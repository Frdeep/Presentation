"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  title: string;
  kicker?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  accent?: "red" | "slate";
};

export function FlipCard({ title, kicker, front, back, accent = "red" }: Props) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  const accentStyle = useMemo(() => {
    if (accent === "slate") {
      return {
        ring: "ring-slate-900/10",
        pill: "bg-slate-900 text-white",
        glow: "rgba(15, 23, 42, 0.18)",
      };
    }
    return {
      ring: "ring-rose-500/15",
      pill: "bg-rose-600 text-white",
      glow: "rgba(225, 29, 72, 0.22)",
    };
  }, [accent]);

  function onPointerMove(e: React.PointerEvent) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const dx = (x / r.width - 0.5) * 2;
    const dy = (y / r.height - 0.5) * 2;
    setTilt({ rx: -dy * 7, ry: dx * 9 });
  }

  function onPointerLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="tap-highlight-none relative h-[72vh] min-h-[520px] w-[86vw] max-w-[420px] select-none"
      style={{ perspective: 1200 }}
    >
      <motion.button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className={`glass ring-1 ${accentStyle.ring} relative h-full w-full rounded-3xl p-5 text-left transition-shadow active:scale-[0.995]`}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: `0 20px 70px ${accentStyle.glow}`,
        }}
        animate={
          reduce
            ? undefined
            : {
                rotateX: tilt.rx,
                rotateY: tilt.ry,
              }
        }
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              backfaceVisibility: "hidden",
              transition: reduce
                ? "none"
                : "transform 560ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  {kicker ? (
                    <div className="text-xs font-semibold tracking-wide text-slate-600">
                      {kicker}
                    </div>
                  ) : null}
                  <div className="mt-1 line-clamp-2 text-xl font-semibold tracking-tight text-slate-950">
                    {title}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${accentStyle.pill}`}
                >
                  Tap ▸ Flip
                </span>
              </div>

              <div className="mt-4 flex-1">{front}</div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>Swipe pour naviguer</span>
                <span>Recto</span>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0"
            style={{
              transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)",
              backfaceVisibility: "hidden",
              transition: reduce
                ? "none"
                : "transform 560ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-wide text-slate-600">
                    Détails
                  </div>
                  <div className="mt-1 line-clamp-2 text-xl font-semibold tracking-tight text-slate-950">
                    {title}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${accentStyle.pill}`}
                >
                  Tap ▸ Retour
                </span>
              </div>

              <div className="mt-4 flex-1">{back}</div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>Swipe pour naviguer</span>
                <span>Verso</span>
              </div>
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
