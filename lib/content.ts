// Marketing copy, condensed from the operator's previous site.
// Every claim here comes from the operator — re-verify before launch (spec §1).

export const HERO = {
  eyebrow: "Official parking · Rome Fiumicino",
  title: ["Park in minutes.", "Fly stress-free."],
  body: "Secure parking 6 minutes from Terminals 1 & 3, with a free shuttle running around the clock.",
  highlights: ["Open 24/7", "Free shuttle", "Video surveillance"],
}

export const STATS: { head: string; value: string; unit?: string; label: string }[] = [
  { head: "Transfer", value: "6", unit: "min", label: "Free shuttle to Terminals 1 & 3" },
  { head: "Open", value: "24/7", label: "Parking and shuttle, every day" },
  { head: "Access", value: "A91", label: "Direct from the Rome-Fiumicino motorway" },
  { head: "Official since", value: "2024", label: "Fiumicino's official car park" },
]

export const BOOKING_STEPS = [
  {
    word: "Pick.",
    title: "Pick dates & extras",
    body: "Choose drop-off, pick-up and any extras. Your total updates live.",
  },
  {
    word: "Book.",
    title: "Add your details",
    body: "Add your car and contact details. Flight number optional.",
  },
  {
    word: "Park.",
    title: "Pay & you're set",
    body: "Card, Apple Pay or Google Pay. Confirmation lands in your inbox.",
  },
]

export const SERVICES = {
  featured: {
    title: "Watched over, around the clock",
    body: "Fenced site with video surveillance across the whole facility and on-site staff. Support is available before, during and after your trip.",
  },
  items: [
    { key: "shuttle", title: "Free shuttle every 15-20 min", body: "Direct to Terminals 1 & 3, included with every booking." },
    { key: "covered", title: "Covered or open-air", body: "Standard open-air spaces, or covered for a small supplement." },
    { key: "valet", title: "Car valet", body: "Skip the shuttle. Hand over your car right at the terminal." },
    { key: "keys", title: "Keep your keys, free", body: "Prefer to hold on to your keys? No charge." },
  ],
}

// Equal length on purpose: 3-word titles, 12-word descriptions, so cards align.
export const ARRIVAL_STEPS = [
  {
    title: "Arrive and unload",
    body: "Stop under the reception shelter. Unload your luggage and let passengers out.",
  },
  {
    title: "Check in first",
    body: "Check in at the reception booth. We email your summary and instructions.",
  },
  {
    title: "Wait for staff",
    body: "Never park alone. An attendant shows you your row and parking direction.",
  },
  {
    title: "Photograph your car",
    body: "Take four photos and a walk-around video. Your keys stay with you.",
  },
]

export const ROW_RULES = [
  {
    key: "even",
    title: "Even rows",
    rows: "Rows 2, 4, 6 … 20",
    mode: "Drive in forward",
    rules: ["Nose toward the back of the stall", "Rear plate visible from the lane"],
  },
  {
    key: "odd",
    title: "Odd rows",
    rows: "Rows 1, 3, 5 … 21",
    mode: "Reverse in",
    rules: ["Rear toward the back of the stall", "Front facing the traffic lane"],
  },
] as const

export const PARKING_NOTICE =
  "Vehicles parked without an attendant, or against the row direction, are towed immediately at the owner's expense."

export const READY_TO_GO =
  "All done? Head back to the reception garage. The shuttle picks you up there and takes you straight to the airport."

export const CANCELLATION = [
  { key: "window", title: "Cancel within 24 hours", body: "Of purchase, directly from your booking page." },
  { key: "help", title: "Talk to our team", body: "Message us or call, open 24/7." },
  { key: "refund", title: "Refund to your card", body: "Returned to the original payment method." },
]

export const APP_FEATURES = [
  { key: "photos", title: "Photos of your car", body: "Four photos and a walk-around video, in your dashboard." },
  { key: "shuttle", title: "Call the shuttle", body: "Request pickup with one tap when you land." },
  { key: "receipts", title: "Receipts & signature", body: "Download PDF receipts and sign your booking." },
]

export const FINAL_CTA = {
  title: "Your terminal is 6 minutes away.",
  body: "Book in seconds. Open 24 hours, shuttle always running.",
}

export const FOOTER = {
  about:
    "Airport parking near Rome Fiumicino with shuttle transfers and extra services for individuals, families and business travelers.",
  agreements:
    "Tailored agreements for individuals, companies and travel agencies. Not active during high season.",
  services: ["Airport parking", "Shuttle service", "Car wash", "Refueling"],
  newsletter: {
    title: "Smart travel, weekly",
    body: "Travel tips, parking updates and the occasional offer. No spam.",
  },
}
