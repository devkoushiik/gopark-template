"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ArrowRightIcon, ArrowUpRightIcon, BusIcon, MenuIcon, PhoneIcon, SquareParkingIcon, XIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { isActive } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CONTACT, PRIMARY_NAV } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)
  const phone = CONTACT.phones[0]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="icon" className="size-11 rounded-full lg:hidden" aria-label="Open menu" />}
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>

      {/* full screen on phones; from sm it is the usual 24rem side sheet (the sheet's own sm:max-w-sm cap) */}
      <SheetContent side="right" showCloseButton={false} className="gap-0 p-0 data-[side=right]:h-dvh data-[side=right]:w-full">
        <div className="flex h-header items-center justify-between border-b px-gutter">
          <SheetTitle render={<div />}>
            <Logo size="sm" />
          </SheetTitle>
          <SheetClose
            render={<Button variant="ghost" size="icon" className="size-10 rounded-full bg-secondary hover:bg-accent" aria-label="Close menu" />}
          >
            <XIcon className="size-5" />
          </SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto px-gutter py-s">
          {/* Self-serve first: the reason most people open the menu at the airport */}
          <div className="grid grid-cols-2 gap-2xs">
            <Link
              href="/call-shuttle"
              onClick={close}
              className="group relative flex min-h-28 flex-col justify-between rounded-card bg-ink p-s text-ink-foreground transition-colors hover:bg-ink-2"
            >
              <span aria-hidden className="grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                <BusIcon className="size-5" />
              </span>
              <ArrowUpRightIcon aria-hidden className="absolute top-s right-s size-4 opacity-50 transition-[opacity,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              <span className="text-sm font-semibold">Call shuttle</span>
            </Link>
            <Link
              href="/booking"
              onClick={close}
              className="group relative flex min-h-28 flex-col justify-between rounded-card bg-brand-soft p-s text-brand-soft-foreground transition-colors hover:bg-accent"
            >
              <span aria-hidden className="grid size-10 place-items-center rounded-full bg-white shadow-sm">
                <SquareParkingIcon className="size-5" />
              </span>
              <ArrowUpRightIcon aria-hidden className="absolute top-s right-s size-4 opacity-50 transition-[opacity,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              <span className="text-sm font-semibold">Book parking</span>
            </Link>
          </div>

          <nav aria-label="Mobile" className="mt-m">
            <ul className="stack [--stack-gap:0]">
              {PRIMARY_NAV.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex min-h-12 items-center justify-between rounded-lg px-3 text-base font-medium transition-colors",
                        active ? "bg-secondary text-foreground" : "text-foreground/80 hover:bg-secondary",
                      )}
                    >
                      {item.label}
                      <ArrowRightIcon
                        aria-hidden
                        className={cn(
                          "size-4 transition-transform group-hover:translate-x-0.5",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="safe-bottom stack border-t px-gutter pt-s [--stack-gap:var(--space-2xs)]">
          <Button
            size="lg"
            className="w-full"
            nativeButton={false}
            render={
              <Link href="/booking" onClick={close}>
                Book parking
              </Link>
            }
          />
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            nativeButton={false}
            render={
              <Link href="/login" onClick={close}>
                Log in
              </Link>
            }
          />
          <a
            href={`tel:+39${phone.replace(/\s/g, "")}`}
            className="inline-flex min-h-11 items-center justify-center gap-2xs text-sm text-muted-foreground hover:text-foreground"
          >
            <PhoneIcon aria-hidden className="size-4" />
            Need help? <span className="font-medium text-foreground tabular">{phone}</span>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
