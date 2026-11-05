"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import { isFastConnection, useHdVideo } from "@/components/home/use-hd-video"

// Data saver, slow networks and reduced motion keep the still photo only
function canPlayVideo() {
  return isFastConnection() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

const videoClass = "absolute inset-0 h-full w-full object-cover transition-opacity"

/**
 * Card artwork: shows the still photo straight away, then fades the video in
 * once the card nears the viewport and the connection can afford it.
 * With `hdSrc`, a sharper version downloads in the background and replaces it.
 */
export function ArrivalVideo({
  src,
  hdSrc,
  poster,
  posterWidth = 900,
  alt,
  style,
}: {
  src: string
  hdSrc?: string
  poster: string
  /** Intrinsic width of `poster`; a 480px copy sits next to it as `<name>-480.webp`. */
  posterWidth?: number
  alt: string
  style?: CSSProperties
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const lowRef = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hdOn, setHdOn] = useState(false)
  const hdUrl = useHdVideo(hdSrc, playing)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || !canPlayVideo()) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* static export has no image server: pick the 480px or full copy by hand */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        srcSet={`${poster.replace(/\.webp$/, "-480.webp")} 480w, ${poster} ${posterWidth}w`}
        sizes="(min-width: 768px) 25vw, 80vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={style}
      />
      {load && (
        <video
          ref={lowRef}
          src={src}
          aria-hidden="true"
          tabIndex={-1}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
          className={`${videoClass} duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
          style={style}
        />
      )}
      {hdUrl && (
        <video
          src={hdUrl}
          aria-hidden="true"
          tabIndex={-1}
          muted
          loop
          playsInline
          disablePictureInPicture
          // pick up where the light version is so the swap is seamless
          onLoadedData={(e) => {
            e.currentTarget.currentTime = lowRef.current?.currentTime ?? 0
            e.currentTarget.play().catch(() => {})
          }}
          onPlaying={() => setHdOn(true)}
          className={`${videoClass} duration-700 ${hdOn ? "opacity-100" : "opacity-0"}`}
          style={style}
        />
      )}
    </div>
  )
}
