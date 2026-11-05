"use client"

import { useEffect, useState } from "react"

type Connection = { saveData?: boolean; effectiveType?: string }

/** False on data saver or 2G/3G; true when the browser doesn't report a connection. */
export function isFastConnection() {
  const conn = (navigator as Navigator & { connection?: Connection }).connection
  if (conn?.saveData) return false
  return !(conn?.effectiveType && /(^|-)2g|3g/.test(conn.effectiveType))
}

/**
 * Background-downloads the high quality version once the page has finished
 * loading and returns a local URL for it, so the swap never stalls playback.
 * Returns null until it's ready, or forever on slow connections.
 */
export function useHdVideo(hdSrc: string | undefined, enabled: boolean) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!hdSrc || !enabled || !isFastConnection()) return
    const ctrl = new AbortController()
    let objectUrl: string | null = null

    const start = () => {
      fetch(hdSrc, { signal: ctrl.signal })
        .then((res) => (res.ok ? res.blob() : Promise.reject()))
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob)
          setUrl(objectUrl)
        })
        .catch(() => {})
    }

    // wait for the page itself, then for an idle moment
    const idle = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 3000 }) : setTimeout(start, 1000)
    if (document.readyState === "complete") idle()
    else window.addEventListener("load", idle, { once: true })

    return () => {
      ctrl.abort()
      window.removeEventListener("load", idle)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [hdSrc, enabled])

  return url
}
