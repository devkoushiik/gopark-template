"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRightIcon, PlusIcon, SearchIcon, SearchXIcon, XIcon, MessageCircleQuestionIcon, PaperclipIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FaqArt } from "@/components/home/faq-art"
import { Button } from "@/components/ui/button"
import { FAQ_CATEGORIES, FAQS, type FaqCategory } from "@/lib/faq"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/layout/dot-pattern"

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")

const FEATURED = FAQS.filter((f) => f.featured)

// First question of the topic shown on arrival: it opens by itself once, as a hint that the cards expand
const WELCOME_ID = FAQS.find((f) => f.category === "booking")?.id

export function FaqBrowser() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<FaqCategory | "all">("booking")
  const [open, setOpen] = useState<string[]>([])
  const deferred = useDeferredValue(query)
  // set as soon as the visitor searches, switches topic or opens/closes anything
  const touched = useRef(false)

  // When that first card scrolls into view, open it with the normal (soft) accordion animation.
  // Not for deep links, reduced motion, or anyone who already interacted.
  useEffect(() => {
    if (!WELCOME_ID || window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = document.getElementById(WELCOME_ID)
    if (!el) return
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        timer = window.setTimeout(() => {
          if (!touched.current) setOpen((o) => (o.length ? o : [WELCOME_ID]))
        }, 700)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  // search matches, before the topic filter (drives the board counts)
  const matches = useMemo(() => {
    const terms = normalize(deferred).split(/\s+/).filter(Boolean)
    return FAQS.filter((f) => terms.every((t) => normalize(`${f.q} ${f.a}`).includes(t)))
  }, [deferred])

  const groups = useMemo(
    () =>
      FAQ_CATEGORIES.filter((c) => category === "all" || c.value === category)
        .map((c) => ({ ...c, items: matches.filter((f) => f.category === c.value) }))
        .filter((g) => g.items.length),
    [matches, category],
  )

  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const countFor = (c: FaqCategory | "all") => (c === "all" ? matches.length : matches.filter((f) => f.category === c).length)

  const reset = () => {
    touched.current = true
    setQuery("")
    setCategory("all")
  }

  // quick pick: clear filters, open the answer and bring it into view
  const jumpTo = (id: string) => {
    reset()
    setOpen((o) => (o.includes(id) ? o : [...o, id]))
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }))
  }

  return (
    <>
      {/* Hero: title and search on the left, popular questions panel on the right */}
      <section aria-labelledby="faq-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <DotPattern />
        {/* same edge arcs as the contact hero: gradient rings cropped by the section sides */}
        <div aria-hidden className="edge-arc top-[8%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden" />
        <div
          aria-hidden
          className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden"
        />
        {/* same height as the contact page hero: fills the screen below the header, capped at 44rem */}
        <div className="container-fluid grid items-center gap-xl py-xl lg:min-h-[min(44rem,calc(100svh-var(--header-h)))] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="stack max-w-[40rem] [--stack-gap:var(--space-m)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <div className="stack [--stack-gap:var(--space-s)]">
              <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md">
                <MessageCircleQuestionIcon aria-hidden className="size-4" />
                Help centre
              </p>
              <h1 id="faq-title" className="max-w-[13ch] text-hero font-bold">
                Questions, answered.
              </h1>
              <p className="max-w-[44ch] text-ink-muted">
                Everything about parking with GoPark at Fiumicino.
              </p>
            </div>

            <div className="relative">
              <label htmlFor="faq-search" className="sr-only">Search questions</label>
              <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-subtle" />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => {
                  touched.current = true
                  setQuery(e.target.value)
                }}
                placeholder="Search, e.g. shuttle or cancel"
                className="h-14 w-full rounded-full bg-ink-2 pr-14 pl-13 text-base text-white ring-1 ring-white/15 outline-none placeholder:text-ink-subtle focus-visible:bg-[#1b2234] focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    touched.current = true
                    setQuery("")
                  }}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-white/10 hover:text-white"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>

          </div>

          {/* popular questions on a paper sheet, same as the contact page's contact card:
              loose sheets behind, paperclip, binder clip, highlighter label */}
          <div className="anim-sheet relative mx-auto w-full max-w-[32rem] py-s">
            <span aria-hidden className="sheet-back-a absolute inset-x-4 inset-y-2 rotate-[4deg] rounded-md bg-[#e9ebef] shadow-lg" />
            <span aria-hidden className="sheet-back-b absolute inset-x-2 inset-y-1 -rotate-[3deg] rounded-md bg-[#f1f2f4] shadow-lg" />

            <div className="sheet-main relative -rotate-1 rounded-md bg-[#f7f7f5] p-l text-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]">
              <PaperclipIcon aria-hidden strokeWidth={1.6} className="sheet-clip absolute -top-6 left-6 size-14 -rotate-[20deg] text-[#9aa3b2] drop-shadow-sm" />
              <span aria-hidden className="sheet-binder absolute top-1/2 -right-3 h-14 w-6 -translate-y-1/2 rounded-sm bg-gradient-to-b from-[#3a4152] to-[#1d2230] shadow-md">
                <span className="absolute top-1/2 left-full h-8 w-5 -translate-y-1/2 rounded-r-full border-2 border-l-0 border-[#9aa3b2]" />
              </span>

              {/* label in a highlighter box with selection-handle dots */}
              <h2 className="mb-m ml-[calc(2.5rem+var(--space-s))]">
                <span className="sheet-mark relative inline-block bg-[#dbe6ff] px-1.5 py-0.5 text-xs font-semibold tracking-wide text-primary">
                  <span aria-hidden className="absolute -top-1 -left-1 size-2 rounded-full bg-primary" />
                  <span aria-hidden className="absolute -right-1 -bottom-1 size-2 rounded-full bg-primary" />
                  Popular questions
                </span>
              </h2>

              <ul className="stack [--stack-gap:var(--space-2xs)]">
                {FEATURED.slice(0, 5).map((f) => (
                  <li key={f.id} className="sheet-row">
                    <button
                      type="button"
                      onClick={() => jumpTo(f.id)}
                      className="group flex w-full items-center gap-s rounded-lg py-2xs text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/40 text-primary transition-colors group-hover:border-primary group-hover:bg-[#dbe6ff]">
                        <span className="font-serif text-lg leading-none italic">?</span>
                      </span>
                      <span className="flex-1 font-semibold group-hover:text-primary">{f.q}</span>
                      <ArrowUpRightIcon aria-hidden className="size-4 shrink-0 text-primary opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Answers */}
      {/* same layout as the home page FAQ: sticky animated artwork beside the list */}
      <div className="container-fluid grid gap-l py-xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="max-lg:hidden lg:sticky lg:top-[calc(var(--header-h)+var(--space-l))] lg:self-start">
          <FaqArt className="mx-auto max-w-md rounded-card shadow-lg" />
        </div>
        <div className="stack min-w-0 [--stack-gap:var(--space-xl)]">
          <div className="flex flex-wrap items-center justify-between gap-s">
            {/* count: number in a round badge, topic (and search) beside it */}
            <p aria-live="polite" className="flex items-center gap-s">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-xl font-bold text-ink-foreground tabular">
                {String(total).padStart(2, "0")}
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">{total === 1 ? "Question" : "Questions"}</span>
                <span className="block text-sm text-muted-foreground">
                  {category === "all" ? "All topics" : FAQ_CATEGORIES.find((c) => c.value === category)?.label}
                  {deferred && <> for “{deferred}”</>}
                </span>
              </span>
            </p>
            {/* tabs: same filter as the board above */}
            <div
              role="tablist"
              aria-label="Filter by topic"
              className="-mx-gutter flex gap-1 overflow-x-auto px-gutter [scrollbar-width:none] sm:mx-0 sm:rounded-full sm:bg-secondary sm:p-1 sm:px-1"
            >
              {FAQ_CATEGORIES.map((c) => {
                const active = category === c.value
                return (
                  <button
                    key={c.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    disabled={countFor(c.value) === 0}
                    onClick={() => {
                      touched.current = true
                      setCategory(c.value)
                    }}
                    className={cn(
                      "h-9 shrink-0 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors disabled:opacity-40",
                      active ? "bg-ink text-ink-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {c.label.split(" & ")[0]}
                  </button>
                )
              })}
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="stack items-center rounded-card border border-dashed p-l text-center [--stack-gap:var(--space-xs)]">
              <SearchXIcon aria-hidden className="size-8 text-muted-foreground" />
              <p className="font-semibold">No matching questions</p>
              <p className="text-sm text-muted-foreground">Try a different word, or ask us directly.</p>
              <Button variant="outline" onClick={reset}>Reset search</Button>
            </div>
          ) : (
            // "All" shows every question, so the list scrolls inside a fixed-height panel instead of stretching the page
            <div
              className={cn(
                "stack [--stack-gap:var(--space-xl)]",
                category === "all" &&
                  "-mr-2 max-h-[min(44rem,calc(100dvh-var(--header-h)-8rem))] overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] [mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)] pb-l",
              )}
            >
            {groups.map((g) => (
              <section key={g.value} aria-labelledby={`faq-${g.value}`} className="stack [--stack-gap:var(--space-s)]">
                <h2 id={`faq-${g.value}`} className="flex items-center gap-xs text-h3 font-semibold">
                  {g.label}
                </h2>
                <Accordion
                  value={open}
                  onValueChange={(v) => {
                    touched.current = true
                    setOpen(v as string[])
                  }}
                  className="gap-2xs"
                >
                  {g.items.map((f) => (
                    // same card as the home page FAQ: "?" tile, plus that turns to x, dark when open
                    <AccordionItem
                      key={f.id}
                      value={f.id}
                      id={f.id}
                      className="group/faq relative isolate scroll-mt-[calc(var(--header-h)+var(--space-l))] overflow-hidden rounded-2xl border bg-card transition-all duration-300 not-last:border-b hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 data-open:border-ink data-open:bg-ink data-open:text-ink-foreground data-open:shadow-xl data-open:shadow-primary/20"
                    >
                      {/* blue glow behind the open card */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-16 -right-10 -z-10 size-48 rounded-full bg-primary/40 opacity-0 blur-3xl transition-opacity duration-500 group-data-open/faq:opacity-100"
                      />
                      <AccordionTrigger className="min-h-16 items-center gap-s px-s py-s text-base font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                        <span
                          aria-hidden
                          className="relative grid size-11 shrink-0 -rotate-3 place-items-center rounded-lg bg-brand-soft text-lg font-bold text-primary shadow-[inset_0_-3px_0_rgb(37_99_235/0.25)] transition-all duration-300 group-hover/faq:rotate-0 group-data-open/faq:rotate-3 group-data-open/faq:bg-primary group-data-open/faq:text-primary-foreground group-data-open/faq:shadow-[0_0_24px_rgb(37_99_235/0.6)]"
                        >
                          <span className="font-serif text-2xl leading-none italic">?</span>
                        </span>
                        <span className="flex-1">{f.q}</span>
                        <span
                          aria-hidden
                          className="grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 group-data-open/faq:rotate-45 group-data-open/faq:border-primary group-data-open/faq:bg-primary group-data-open/faq:text-primary-foreground"
                        >
                          <PlusIcon className="size-4" />
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pr-s pb-s pl-[calc(var(--space-s)+2.75rem+var(--space-s))] text-ink-muted">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
