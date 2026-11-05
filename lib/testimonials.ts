// Guest video testimonials. One short clip (1 MB, silent, 540x960) is shared by every entry for now:
// each card starts it at its own second, so they look different until there are separate videos.
// `photo` is the cut-out portrait shown on the card until the video plays (22 KB, transparent WebP).
// To use a real video, give the entry its own `src` and set `start: 0`.
// Name, trip and quote below are PLACEHOLDERS, not real guest feedback: replace them before launch.
const SHARED_SRC = "/videos/testimonial.mp4"
const SHARED_PHOTO = "/images/testimonial-guest.webp"
const PLACEHOLDER = { name: "Guest name", trip: "Trip details", quote: "A short quote from your guest goes here.", rating: 5 }

export type Testimonial = {
  id: string
  src: string
  /** Second the clip starts (and loops back to) on this card. */
  start: number
  /** Cut-out portrait (transparent WebP) shown on the card until the video plays. */
  photo: string
  name: string
  trip: string
  quote: string
  /** 1-5 stars given by the guest. */
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", src: SHARED_SRC, photo: SHARED_PHOTO, start: 0, ...PLACEHOLDER },
  { id: "t2", src: SHARED_SRC, photo: SHARED_PHOTO, start: 6, ...PLACEHOLDER },
  { id: "t3", src: SHARED_SRC, photo: SHARED_PHOTO, start: 12, ...PLACEHOLDER },
  { id: "t4", src: SHARED_SRC, photo: SHARED_PHOTO, start: 18, ...PLACEHOLDER },
  { id: "t5", src: SHARED_SRC, photo: SHARED_PHOTO, start: 3, ...PLACEHOLDER },
  { id: "t6", src: SHARED_SRC, photo: SHARED_PHOTO, start: 9, ...PLACEHOLDER },
  { id: "t7", src: SHARED_SRC, photo: SHARED_PHOTO, start: 15, ...PLACEHOLDER },
  { id: "t8", src: SHARED_SRC, photo: SHARED_PHOTO, start: 20, ...PLACEHOLDER },
]

/**
 * Numbers for the stats sheet on the testimonial page, worked out from the entries above so they never
 * drift from the videos shown. With the placeholder entries they read 8 videos, 5.0 average, 100%.
 */
export function testimonialStats(items: Testimonial[] = TESTIMONIALS) {
  const count = items.length
  const average = count ? items.reduce((sum, t) => sum + t.rating, 0) / count : 0
  const recommendPct = count ? Math.round((items.filter((t) => t.rating >= 4).length / count) * 100) : 0
  return { count, average, recommendPct }
}
