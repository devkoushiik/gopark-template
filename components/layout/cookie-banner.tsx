"use client"

import { useEffect, useState } from "react"
import { CookieIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const KEY = "gopark-cookie-consent"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read client-only storage after mount
      if (!localStorage.getItem(KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function choose(value: "accepted" | "refused") {
    try {
      localStorage.setItem(KEY, value)
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-gutter pb-[max(var(--space-s),env(safe-area-inset-bottom))]"
    >
      <div className="@container mx-auto max-w-[56rem] rounded-card border bg-card p-s shadow-xl">
        <div className="flex flex-col gap-s @xl:flex-row @xl:items-center">
          <CookieIcon aria-hidden className="hidden size-8 shrink-0 @xl:block" />
          <div className="flex-1">
            <p className="font-semibold">Cookies & privacy</p>
            <p className="text-sm text-muted-foreground">
              We use cookies to improve your experience and analyse traffic. You can accept or refuse non-essential cookies.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2xs @xl:flex">
            <Button variant="outline" onClick={() => choose("refused")}>Refuse</Button>
            <Button onClick={() => choose("accepted")}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
