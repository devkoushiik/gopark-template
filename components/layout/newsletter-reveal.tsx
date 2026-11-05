"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { MailIcon } from "lucide-react"

type Phase = "wait" | "intro" | "press" | "final"

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)"
const AUTO_PRESS_MS = 1200
const PRESS_MS = 650

// Speed lines trailing the plane, along its heading (x1 y1 -> x2 y2), staggered
const STREAKS = [
  [14, 150, 52, 122, 0],
  [40, 168, 66, 149, 0.35],
  [22, 182, 30, 176, 0.7],
  [66, 182, 98, 158, 0.2],
  [52, 198, 82, 176, 0.55],
] as const

/** Blue paper plane with a yellow envelope riding on it and a "1" badge. */
function PlaneMail({ shown }: { shown: boolean }) {
  return (
    <svg viewBox="0 0 240 210" className="size-full overflow-visible" aria-hidden>
      <g stroke="#facc15" strokeWidth="8" strokeLinecap="round">
        {STREAKS.map(([x1, y1, x2, y2, d], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="animate-[nl-streak_1.1s_linear_infinite]"
            style={{ animationDelay: `${d}s`, opacity: 0 }}
          />
        ))}
      </g>

      {/* plane + cargo bob together */}
      <g className="animate-[nl-float_3.2s_ease-in-out_infinite] [transform-box:fill-box] [transform-origin:center]">
        <ellipse cx="128" cy="204" rx="60" ry="5" fill="black" opacity="0.25" />
        {/* plane: top wing, keel fold, lower wing */}
        <path d="M228 18 L44 112 L104 124 Z" fill="#4ea8f2" />
        <path d="M228 18 L104 124 L122 186 Z" fill="#1f6fd6" />
        <path d="M228 18 L120 136 L176 150 Z" fill="#3b95ea" />

        {/* envelope tilted with the plane */}
        <g transform="rotate(-26 128 92)">
          <rect x="88" y="64" width="84" height="58" rx="6" fill="#f5b83d" />
          <path d="M88 122 L130 90 L172 122" fill="#e9a52a" />
          <path d="M88 64 L130 98 L172 64 Z" fill="#fbc858" stroke="#e9a52a" strokeWidth="1.5" strokeLinejoin="round" />
          {/* unread badge pops once the plane lands */}
          <g transform="translate(170 64)">
            <g
              className="[transform-box:fill-box] [transform-origin:center]"
              style={{
                scale: shown ? "1" : "0",
                transition: "scale 0.34s cubic-bezier(0.34, 1.8, 0.64, 1) 0.82s",
              }}
            >
              <circle r="14" fill="#ef4444" stroke="#161b27" strokeWidth="3" />
              <text y="5" textAnchor="middle" fontSize="15" fontWeight="800" fill="white">1</text>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

/**
 * Footer newsletter: plays a short intro when scrolled into view (headline rises, the CTA presses itself), then unfolds into the email form.
 */
export function NewsletterReveal({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>("wait")
  const timers = useRef<number[]>([])

  const press = () => {
    timers.current.forEach(clearTimeout)
    setPhase("press")
    timers.current = [window.setTimeout(() => setPhase("final"), PRESS_MS)]
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("final")
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        setPhase("intro")
        timers.current = [window.setTimeout(press, AUTO_PRESS_MS)]
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    const t = timers.current
    return () => {
      io.disconnect()
      t.forEach(clearTimeout)
    }
  }, [])

  const shown = phase !== "wait"
  const final = phase === "final"
  const pressed = phase === "press"
  const opened = pressed || final
  const words = title.split(" ")

  return (
    <div className="relative">
    <div
      ref={ref}
      className="relative isolate overflow-hidden rounded-card bg-[#161b27] ring-1 ring-primary/25"
      // one height for intro and form, so nothing jumps when they swap
      style={{ minHeight: "clamp(17rem, 22vw, 19rem)" }}
    >

      {/* airmail border shared by both states: striped edge, envelope paper inset over it */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(-45deg,var(--primary)_0_14px,rgb(255_255_255/0.85)_14px_28px)]"
        style={{ opacity: shown ? 1 : 0, transition: `opacity 0.41s ${EASE}` }}
      />
      <span aria-hidden className="absolute inset-2 -z-10 overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] bg-[#161b27]">
        {/* Intro backdrop: soft dot field, strongest mid-block */}
        <span
          className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1.5px)] [background-size:18px_18px] [mask-image:radial-gradient(70%_90%_at_55%_50%,black,transparent)]"
          style={{ opacity: shown && !final ? 1 : 0, transition: `opacity 0.54s ${EASE}` }}
        />
        {/* Form backdrop: dot field over the left/top, fading out before the form */}
        <span
          className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1.5px)] [background-size:18px_18px] [mask-image:radial-gradient(75%_110%_at_15%_30%,black_20%,transparent_75%)]"
          style={{ opacity: final ? 1 : 0, transition: `opacity 0.54s ${EASE} 0.14s` }}
        />
        {/* Form backdrop: faint line grid, fades in with the form */}
        <span
          className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.018)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.018)_1px,transparent_1px)] [background-size:24px_24px]"
          style={{ opacity: final ? 1 : 0, transition: `opacity 0.54s ${EASE} 0.14s` }}
        />
      </span>

      {/* Intro: an airmail envelope. Decorative, the real heading lives in the final layer */}
      <div
        aria-hidden
        inert
        className="absolute inset-0"
        style={{
          opacity: final ? 0 : 1,
          transform: final ? "translateY(-12px) scale(0.97)" : "none",
          filter: final ? "blur(6px)" : "none",
          visibility: final ? "hidden" : "visible",
          transition: `opacity 0.31s ${EASE}, transform 0.41s ${EASE}, filter 0.31s ${EASE}, visibility 0s linear ${final ? "0.31s" : "0s"}`,
        }}
      >
        <div className="relative grid h-full items-center gap-m px-l py-m md:grid-cols-[minmax(0,1fr)_auto] md:px-xl">
          <div className="stack items-start [--stack-gap:var(--space-s)]">
            <p className="text-sm font-medium text-white/55" style={{ opacity: shown ? 1 : 0, transition: `opacity 0.41s ${EASE} 0.14s` }}>
              Every Thursday, free
            </p>
            <p className="text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-white">
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span
                    className="inline-block"
                    style={{
                      transform: shown ? "none" : "translateY(105%)",
                      transition: `transform 0.61s ${EASE} ${0.2 + i * 0.061}s`,
                    }}
                  >
                    {w}
                  </span>
                </span>
              )).flatMap((el, i) => (i < words.length - 1 ? [el, " "] : [el]))}
            </p>

            <button
              type="button"
              tabIndex={-1}
              onClick={press}
              className="relative mt-2xs inline-flex h-12 items-center gap-2xs overflow-hidden rounded-full bg-primary px-l text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_rgb(37_99_235/0.7)]"
              style={{
                opacity: shown ? 1 : 0,
                transform: !shown ? "translateY(12px) scale(0.9)" : pressed ? "scale(0.93)" : "scale(1)",
                transition: pressed
                  ? `transform 0.09s ease-out`
                  : `opacity 0.41s ${EASE} 0.61s, transform 0.48s cubic-bezier(0.34, 1.56, 0.64, 1) 0.61s`,
              }}
            >
              {/* ripple from the press */}
              <span
                className="pointer-events-none absolute top-1/2 left-1/2 size-12 rounded-full bg-white/40"
                style={{
                  transform: `translate(-50%, -50%) scale(${pressed ? 5 : 0})`,
                  opacity: pressed ? 0 : 0.6,
                  transition: pressed ? `transform 0.31s ease-out, opacity 0.31s ease-out` : "none",
                }}
              />
              <MailIcon aria-hidden className="size-4" />
              Get the weekly brief
            </button>
          </div>

          {/* Paper plane carrying the letter: flies in, hovers with speed lines trailing,
              then on press shoots off top-right, handing over to the form */}
          <div
            className="relative mr-m hidden h-44 w-56 md:block"
            style={{
              opacity: !shown || opened ? 0 : 1,
              translate: !shown ? "-70px 60px" : opened ? "180px -140px" : "0 0",
              scale: opened ? "0.6" : "1",
              transition: opened
                ? `translate 0.41s cubic-bezier(0.5, 0, 0.75, 0), scale 0.41s ease-in, opacity 0.2s ease-in 0.2s`
                : `opacity 0.27s ${EASE} 0.27s, translate 0.61s cubic-bezier(0.34, 1.4, 0.64, 1) 0.27s`,
            }}
          >
            <PlaneMail shown={shown} />
          </div>
        </div>
      </div>

      {/* Final: the actual form */}
      <div
        inert={!final}
        className="relative grid min-h-[inherit] content-center items-center gap-m p-m lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:p-l"
        style={{ visibility: final ? "visible" : "hidden" }}
      >
        <div
          className="stack [--stack-gap:var(--space-3xs)]"
          style={{
            opacity: final ? 1 : 0,
            transform: final ? "none" : "translateX(-24px)",
            transition: `opacity 0.41s ${EASE} 0.17s, transform 0.48s ${EASE} 0.17s`,
          }}
        >
          {/* the plane from the intro lands here once the form is up */}
          <div
            className="mb-2xs h-28 w-32"
            style={{
              opacity: final ? 1 : 0,
              translate: final ? "0 0" : "-40px 24px",
              transition: `opacity 0.27s ${EASE} 0.24s, translate 0.54s cubic-bezier(0.34, 1.4, 0.64, 1) 0.24s`,
            }}
          >
            <PlaneMail shown={final} />
          </div>
          <h2 className="text-h3 font-bold text-white">{title}</h2>
          <p className="text-sm font-medium text-white/75">{body}</p>
        </div>
        {/* wipes open leftward, as if the CTA button stretched into the form */}
        <div
          style={{
            opacity: final ? 1 : 0,
            clipPath: final ? "inset(-6px round 0)" : "inset(0 0 0 70% round 999px)",
            transition: `opacity 0.2s ${EASE} 0.07s, clip-path 0.54s ${EASE} 0.07s`,
          }}
        >
          {children}
        </div>
      </div>

    </div>
    </div>
  )
}
