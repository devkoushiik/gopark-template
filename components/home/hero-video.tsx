"use client"

import { useEffect, useRef, useState } from "react"

import { isFastConnection, useHdVideo } from "@/components/home/use-hd-video"

/**
 * Decorative background video. Pauses for users who prefer reduced motion.
 * With `hdSrc`, the light version plays first and the sharp one fades in once downloaded.
 *
 * The file is not requested during page load (it would fight the JS/CSS for bandwidth): a `priority`
 * video starts once the browser is idle, any other when it nears the viewport. On data saver / 2G-3G
 * the `poster` simply stays.
 */
export function HeroVideo({
  src,
  hdSrc,
  wideSrc,
  className,
  priority = false,
  poster,
}: {
  src: string
  hdSrc?: string
  /** Sharper file picked by the browser at ≥ 64rem wide (no JS, no swap); `src` stays the small-screen file. */
  wideSrc?: string
  className?: string
  /** Above-the-fold video: fetch right away instead of metadata only. */
  priority?: boolean
  /** Exact first frame of the video: shown (and painted as LCP) until the video has painted, then crossfaded out. */
  poster?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const hdRef = useRef<HTMLVideoElement>(null)
  const [motionOk, setMotionOk] = useState(false)
  const [hdOn, setHdOn] = useState(false)
  const [painted, setPainted] = useState(false)
  const [load, setLoad] = useState(false)
  const hdUrl = useHdVideo(hdSrc, motionOk)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      setMotionOk(!mq.matches)
      for (const v of [video, hdRef.current]) {
        if (!v) continue
        if (mq.matches) v.pause()
        else v.play().catch(() => {})
      }
    }
    sync()
    mq.addEventListener("change", sync)

    // when to start fetching the file (see the doc comment above)
    let cancel = () => {}
    if (!(poster && !isFastConnection())) {
      if (priority) {
        const w: Partial<Window> = window // older Safari has no requestIdleCallback
        const id = w.requestIdleCallback ? window.requestIdleCallback(() => setLoad(true), { timeout: 1500 }) : window.setTimeout(() => setLoad(true), 300)
        cancel = () => (w.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id))
      } else {
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return
            setLoad(true)
            io.disconnect()
          },
          { rootMargin: "200px" },
        )
        io.observe(video)
        cancel = () => io.disconnect()
      }
    }

    // The poster stays on top until the video has really painted a frame, then fades out.
    // Swapping them instantly is what makes the first frame "jump".
    const revealVideo = () => {
      if ("requestVideoFrameCallback" in video) video.requestVideoFrameCallback(() => setPainted(true))
      else setPainted(true)
    }
    if (!video.paused && video.readyState >= 3) revealVideo()
    else video.addEventListener("playing", revealVideo, { once: true })

    return () => {
      cancel()
      mq.removeEventListener("change", sync)
      video.removeEventListener("playing", revealVideo)
    }
  }, [priority, poster])

  // src arrives after mount, so start playback here (autoplay is off: reduced motion stays on frame 1)
  useEffect(() => {
    if (!load || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    ref.current?.play().catch(() => {})
  }, [load])

  return (
    <>
      <video
        ref={ref}
        className={className}
        src={load && !wideSrc ? src : undefined}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
      >
        {load && wideSrc && (
          <>
            <source src={wideSrc} media="(min-width: 64rem)" type="video/mp4" />
            <source src={src} type="video/mp4" />
          </>
        )}
      </video>
      {poster && (
        // plain <img>: static export, and it needs fetchPriority for LCP. Same box as the video so the fade is seamless.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className={`${className ?? ""} pointer-events-none transition-opacity duration-500 ease-out ${painted ? "opacity-0" : "opacity-100"}`}
        />
      )}
      {hdUrl && (
        <video
          ref={hdRef}
          className={`${className ?? ""} transition-opacity duration-700 ${hdOn ? "opacity-100" : "opacity-0"}`}
          src={hdUrl}
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          // pick up where the light version is so the swap is seamless
          onLoadedData={(e) => {
            e.currentTarget.currentTime = ref.current?.currentTime ?? 0
            e.currentTarget.play().catch(() => {})
          }}
          onPlaying={() => setHdOn(true)}
        />
      )}
    </>
  )
}
