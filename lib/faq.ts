// FAQ content. Questions from the operator's previous site; answers condensed.
// `verify: true` = answer needs operator confirmation before launch (spec §1: no invented facts).

export type FaqCategory = "booking" | "arrival" | "shuttle" | "vehicle" | "changes"

export type Faq = {
  id: string
  category: FaqCategory
  q: string
  a: string
  featured?: boolean
  verify?: boolean
}

export const FAQ_CATEGORIES: { value: FaqCategory; label: string }[] = [
  { value: "booking", label: "Booking & payment" },
  { value: "arrival", label: "Arrival & return" },
  { value: "shuttle", label: "Shuttle" },
  { value: "vehicle", label: "Parking & vehicle" },
  { value: "changes", label: "Changes & cancellations" },
]

export const FAQS: Faq[] = [
  // Booking & payment
  {
    id: "services",
    category: "booking",
    q: "What services do you offer?",
    a: "Covered and open-air parking 6 minutes from Fiumicino Terminals 1 & 3, a free 24/7 shuttle, car valet, car wash and refueling. Keeping your keys is free.",
  },
  {
    id: "how-to-book",
    category: "booking",
    q: "How do I book parking at Fiumicino?",
    a: "Online in three steps: pick your dates and extras, add your details, then pay by card, Apple Pay or Google Pay. No account needed. You can also book in the app.",
    featured: true,
  },
  {
    id: "no-reservation",
    category: "booking",
    q: "Can I park without a reservation?",
    a: "We recommend booking online so a space is guaranteed and the price is fixed. For same-day arrivals without a booking, call us first to check availability.",
    verify: true,
  },
  {
    id: "payment-declined",
    category: "booking",
    q: "Why was my payment declined?",
    a: "Usually the card details, a failed bank verification (3-D Secure) or a spending limit. Your booking details are kept, so you can retry or switch to another payment method. If it keeps failing, contact your bank or us.",
  },
  {
    id: "no-email",
    category: "booking",
    q: "I didn't receive a confirmation email. What now?",
    a: "Check your spam or promotions folder first. Still nothing? Contact us with your booking reference and we'll send it again.",
  },
  {
    id: "agreements",
    category: "booking",
    q: "Do you offer business or agency agreements?",
    a: "Yes, tailored agreements for individuals, companies and travel agencies. They're paused during high season.",
  },

  // Arrival & return
  {
    id: "on-arrival",
    category: "arrival",
    q: "What should I do when I arrive at the car park?",
    a: "Pull up under the shelter by reception and unload. Check in at the booth, wait for an attendant to show you your row, then take four photos and a video of your car before leaving it.",
    featured: true,
  },
  {
    id: "staff",
    category: "arrival",
    q: "How do I recognise GoPark staff?",
    a: "Our staff work from the reception booth on site and will greet you there. Only hand over keys or documents at reception — if in doubt, ask at the booth.",
    verify: true,
  },
  {
    id: "car-back",
    category: "arrival",
    q: "How do I get my car back when I return?",
    a: "Once you've collected your luggage, request the shuttle from your phone. It takes you back to the car park, where your car is waiting.",
    featured: true,
  },
  {
    id: "tips",
    category: "arrival",
    q: "Any tips for a smooth trip?",
    a: "Book ahead, allow extra time for check-in, keep your booking reference handy, and take your photos and video before leaving the car.",
  },

  // Shuttle
  {
    id: "shuttle-free",
    category: "shuttle",
    q: "Is there a shuttle? Is it free?",
    a: "Yes. A free shuttle runs 24/7, typically every 15–20 minutes, between the car park and Terminals 1 & 3. Waits may be slightly longer during unexpected delays.",
    featured: true,
  },
  {
    id: "shuttle-point",
    category: "shuttle",
    q: "Where is the shuttle pick-up point?",
    a: "On departure, the shuttle leaves from the reception garage. On return, exact pickup instructions for your terminal are shown when you request the shuttle.",
    verify: true,
  },

  // Parking & vehicle
  {
    id: "vehicle-size",
    category: "vehicle",
    q: "Is there a surcharge for larger vehicles?",
    a: "Standard cars have no surcharge. Longer vehicles and buses have a supplement, shown before you pay.",
    verify: true,
  },
  {
    id: "park-myself",
    category: "vehicle",
    q: "Can I park the car myself?",
    a: "No. Always wait for an attendant. Even rows drive in forward, odd rows reverse in. Cars parked without an attendant or against the row direction are towed at the owner's expense.",
  },
  {
    id: "keys",
    category: "vehicle",
    q: "Do I have to leave my keys?",
    a: "No. Keeping your keys is free. You only hand them over if you choose car valet or car wash.",
  },
  {
    id: "insurance",
    category: "vehicle",
    q: "Is my car insured while parked?",
    a: "Coverage terms are set out in our terms and conditions. Contact us if you have specific questions before booking.",
    verify: true,
  },

  // Changes & cancellations
  {
    id: "cancel",
    category: "changes",
    q: "Can I cancel my booking?",
    a: "Yes, within 24 hours of purchase. Contact us with your booking reference. A €1.99 fee is deducted and the rest is refunded to your original payment method.",
    featured: true,
  },
  {
    id: "extend",
    category: "changes",
    q: "Can I extend my stay?",
    a: "Yes. Contact us with your booking reference and new pick-up time. Any price difference is confirmed before you pay.",
    featured: true,
  },
  {
    id: "late",
    category: "changes",
    q: "What if I return later than booked?",
    a: "Extra time is charged on return. If you know you'll be late — for example a delayed flight — contact us to extend and see the price upfront.",
    verify: true,
  },
]
