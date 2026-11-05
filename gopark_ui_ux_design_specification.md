# GoPark --- UI/UX Design Specification

**Project:** GoPark airport parking service  
**Document:** `design.md`  
**Design approach:** Mobile-first, low-poly, royal blue + navy ink on cool neutrals, with semantic status tokens  
**Frontend target:** Next.js App Router + TypeScript + shadcn/ui  
**Visual assets:** No photographs, stock imagery, or external raster assets. Use CSS geometry, inline SVG, functional vector diagrams, icons, and neutral placeholders.

------------------------------------------------------------------------

## 1. Product and UX goals

GoPark helps travelers reserve parking near an airport while they are away. The interface should communicate clarity, convenience, and trust without making unsupported claims about security or services. Because airport travelers often interact with the product under time pressure or while in transit, every flow must minimize typing, cognitive load, and navigation friction.

### Primary goals

1.  Help visitors find parking quickly with smart date/time defaults and error prevention.
2.  Make parking options, operational constraints, and the full price easy to compare at a glance.
3.  Keep checkout short, unified, and accessible without forcing account creation or memorization of vehicle plates.
4.  Clearly confirm what happens after a booking and provide offline-ready access passes.
5.  Provide self-serve booking management for flight delays, date changes, plate updates, and cancellations.
6.  Make shuttle requests, vehicle lookup, and damage reporting effortless on mobile devices.
7.  Establish one consistent visual system across marketing, booking, checkout, support, and authentication pages.

### UX principles

-   **Booking first:** the homepage search is the primary action.
-   **Guest-first checkout:** never block a reservation behind an account login wall; offer frictionless account creation after payment.
-   **Progressive disclosure:** show essential information first; put secondary details behind accordions, drawers, or links.
-   **Transparent pricing:** display the full price and mandatory fees before payment.
-   **Trust through clarity:** explain actual parking arrangements, shuttle details, policies, and support routes. Never invent security certifications, insurance, ratings, or service guarantees.
-   **Real-world travel resilience:** accommodate common travel edge cases (unknown rental plates, delayed flights, terminal confusion, poor airport cellular connectivity).
-   **Mobile-first:** design narrow layouts first, then enhance them for larger screens.
-   **Accessible by default:** semantic HTML, keyboard support, visible focus, readable contrast, and clear form errors.
-   **Subtle low-poly styling:** geometry adds identity, but must not interfere with forms, navigation, or content.

------------------------------------------------------------------------

## 2. Visual direction

### Overall style

Use a clean, modern, primarily monochrome interface:

-   White main surfaces.
-   Pale-grey secondary panels.
-   Black primary actions and headings.
-   Mid-grey secondary text.
-   Thin neutral borders.
-   Minimal shadows.
-   Rounded cards with restrained geometric corner details.
-   Generous spacing and consistent alignment.

Do not use photographs or raster images. Use CSS-generated polygons, inline SVG, simple line icons, functional vector wayfinding diagrams, skeleton placeholders, and abstract neutral blocks instead.

### Low-poly and vector language

Use low-poly and SVG details selectively:

-   Faceted polygons in hero backgrounds and footer sections.
-   Diagonal cuts or triangular motifs on decorative panels.
-   Simple geometric car, parking, calendar, or airport symbols built with inline SVG or icons.
-   Functional high-contrast SVG diagrams for operational clarity (e.g., terminal pickup zone diagrams on `/call-shuttle` and `/payment/success`, or a clickable top-down vehicle diagram on `/damage-report`).
-   Neutral abstract shapes for empty states and placeholder artwork.
-   Optional clipped corners on decorative cards, not on essential form controls.

**Important:** keep inputs, dropdowns, date pickers, buttons, and payment controls conventional. Decorative geometry should never reduce legibility or make controls harder to recognize.

### Color tokens — royal blue + navy ink

Palette: white surfaces, cool blue-grey neutrals, **royal blue** for actions and selection, **navy ink** for dark heroes, feature tiles and footer. Semantic status tokens unchanged. Never rely on color alone — pair with icon + text.

| Token | Value | Use |
| :--- | :--- | :--- |
| `--background` / `--card` / `--popover` | `#FFFFFF` | Page and card surfaces |
| `--foreground` | `#0B0F19` | Main text |
| `--primary` | `#2563EB` | CTAs, selected controls, links, icon chips (5.2:1 on white) |
| `--primary-hover` | `#1D4ED8` | Hover/pressed primary |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--brand-soft` / `--brand-soft-foreground` | `#E8EFFF` / `#1D4ED8` | Pale blue chips, eyebrows, soft icon tiles |
| `--ink` / `--ink-2` | `#0B0F19` / `#141A29` | Dark sections: booking hero, feature tiles, footer |
| `--ink-foreground` | `#FFFFFF` | Text on ink |
| `--ink-muted` / `--ink-subtle` | `#A7B0C2` / `#7C869A` | Secondary text on ink (8.4:1 / 5.1:1) |
| `--secondary` / `--muted` | `#F3F6FB` | Pale blue-grey panels |
| `--muted-foreground` | `#5B6476` | Secondary text (5.9:1 on white) |
| `--accent` | `#E8EEFA` | Hover / neutral selected |
| `--border` / `--input` | `#E3E8F2` / `#D3DAE8` | Dividers / input borders |
| `--ring` | `#2563EB` | Focus ring |
| `--destructive` / `--destructive-surface` | `#DC2626` / `#FEF2F2` | Errors (with icon) |
| `--warning` / `--warning-surface` | `#D97706` / `#FFFBEB` | Pending / caution (with icon) |
| `--success` / `--success-surface` | `#16A34A` / `#F0FDF4` | Confirmed / included (with icon) |
| `--radius` | `0.75rem` | Default radius |

Usage rules:
- Blue = "you can act here". Keep it for CTAs, selection, focus and small accents; never for large body text.
- Ink = depth. One dark band per page section at most (hero, featured tile, footer).
- Closing CTA panels use a solid blue band with blue low-poly facets.
- Low-poly tones: `light` (cool grey facets), `dark` (navy facets on ink), `brand` (blue facets on primary).

### Typography

-   Preferred font: Geist or Inter (plus Geist Mono or system monospace for license plates, booking references, and OTP inputs).
-   Use a clear hierarchy rather than many font sizes.
-   Headings: bold or semibold, short, sentence case.
-   Body: regular weight and comfortable line height.
-   Form labels: always visible; do not rely on placeholder text as the only label.
-   License plates and reference codes: use uppercase monospace with wide letter-spacing so characters like `0` and `O` or `1` and `I` are unmistakable.
-   Eyebrow labels: optional uppercase, small, medium weight, increased letter spacing.

Fluid type scale (no stepped breakpoint jumps). Every size interpolates linearly between a **320px** and **1440px** viewport, then locks. The `rem` intercept keeps browser zoom and user font preferences working (WCAG 1.4.4); never use bare `vw` for text.

Formula: `clamp(MIN, MIN − slope·320px + slope·100vw, MAX)` where `slope = (MAX − MIN) / (1440 − 320)`.

| Token | Role | 320px → 1440px | Value |
| :--- | :--- | :--- | :--- |
| `--text-hero` | Hero heading | 36 → 60px | `clamp(2.25rem, 1.821rem + 2.143vw, 3.75rem)` |
| `--text-h1` | Page heading | 28 → 44px | `clamp(1.75rem, 1.464rem + 1.429vw, 2.75rem)` |
| `--text-h2` | Section heading | 22 → 32px | `clamp(1.375rem, 1.196rem + 0.893vw, 2rem)` |
| `--text-h3` | Card heading | 18 → 22px | `clamp(1.125rem, 1.054rem + 0.357vw, 1.375rem)` |
| `--text-body` | Body | 16 → 18px | `clamp(1rem, 0.964rem + 0.179vw, 1.125rem)` |
| `--text-sm` | Supporting text | 15 → 16px | `clamp(0.9375rem, 0.92rem + 0.089vw, 1rem)` |
| `--text-xs` | Fine print | 12 → 13px | `clamp(0.75rem, 0.732rem + 0.089vw, 0.8125rem)` |
| `--text-ref` | Booking ref / plate display | 22 → 32px | `clamp(1.375rem, 1.196rem + 0.893vw, 2rem)` |

Typographic rules that scale with size:
-   Line height tightens as size grows: hero `1.05`, h1 `1.1`, h2 `1.2`, h3 `1.3`, body `1.6`.
-   Letter spacing tightens on display sizes: hero/h1 `-0.02em`, h2 `-0.01em`, body `0`.
-   Headings use `text-wrap: balance`; body paragraphs use `text-wrap: pretty`.
-   Measure is capped: `max-inline-size: 65ch` for prose, `40ch` for hero supporting copy.
-   Numerals in prices, durations, and timestamps use `font-variant-numeric: tabular-nums` so totals don't jitter while updating.

### Spacing, width, and shape

All layout spacing is fluid and token-driven. Components never hard-code px gaps; they reference these tokens.

| Token | Use | 320px → 1440px | Value |
| :--- | :--- | :--- | :--- |
| `--space-3xs` | Icon gaps, badge padding | 4px | `0.25rem` |
| `--space-2xs` | Label → input gap | 8px | `0.5rem` |
| `--space-xs` | Inline control gaps | 8 → 12px | `clamp(0.5rem, 0.429rem + 0.357vw, 0.75rem)` |
| `--space-s` | Card inner gaps, field stacks | 16 → 20px | `clamp(1rem, 0.929rem + 0.357vw, 1.25rem)` |
| `--space-m` | Card padding | 24 → 32px | `clamp(1.5rem, 1.357rem + 0.714vw, 2rem)` |
| `--space-l` | Grid gaps, group spacing | 32 → 48px | `clamp(2rem, 1.714rem + 1.429vw, 3rem)` |
| `--space-xl` | Between sub-sections | 48 → 80px | `clamp(3rem, 2.429rem + 2.857vw, 5rem)` |
| `--section-y` | Section block padding | 48 → 128px | `clamp(3rem, 1.571rem + 7.143vw, 8rem)` |
| `--gutter` | Page inline padding | 16 → 48px | `clamp(1rem, 0.429rem + 2.857vw, 3rem)` |
| `--radius-card` | Card radius | 12 → 16px | `clamp(0.75rem, 0.679rem + 0.357vw, 1rem)` |

Fixed (non-fluid) by design — these are ergonomic minimums, not visual choices:
-   Buttons and inputs: `min-block-size: 3rem` (48px); primary CTA `3.25rem` (52px).
-   Touch targets: `min-inline-size` and `min-block-size` of `2.75rem` (44px).
-   Form control font size: never below `1rem` (prevents iOS zoom-on-focus).
-   Borders: 1px solid neutral grey (`--border`); focus ring `2px` with `2px` offset.
-   Shadows: subtle and rare; prefer borders and surface contrast.

Widths:
-   Content container: `inline-size: min(100% - 2 * var(--gutter), 80rem)` (1280px cap), centered with `margin-inline: auto`.
-   Narrow container (checkout, auth, forms): `min(100% - 2 * var(--gutter), 36rem)`.
-   Prose container: `min(100% - 2 * var(--gutter), 65ch)`.

------------------------------------------------------------------------

## 3. Layout and responsive behavior

### Fluid-first, breakpoint-light approach

Layout adapts **continuously**, not in steps. Size and spacing come from `clamp()` tokens (section 2); column counts come from intrinsic grids and container queries. Viewport media queries are reserved for true shell changes (header nav ↔ `Sheet`, sidebar ↔ filter `Sheet`).

Order of preference when making something responsive:
1.  **Intrinsic sizing** — `clamp()`, `min()`, `max()`, `fit-content`, `ch` units. No query needed.
2.  **Intrinsic grids** — `repeat(auto-fit, minmax(min(100%, Xrem), 1fr))` reflows columns by available space.
3.  **Container queries** — components respond to *their slot width*, not the viewport, so the same `ParkingCard` works in a sidebar, a full-width list, or a modal.
4.  **Viewport media queries** — only for page-shell changes.

Reference shell breakpoints (Tailwind defaults, mobile-first): `sm 40rem`, `md 48rem`, `lg 64rem`, `xl 80rem`. Use `lg` as the single shell switch for header nav, filters sidebar, and checkout two-column.

Behavior across the range:
-   **Narrow (320–639px):** single column; stacked forms; full-width CTA; `--gutter` ≈ 16–24px.
-   **Mid (640–1023px):** intrinsic grids reach 2 columns; search form fields pair up (date + time side by side) via container query.
-   **Wide (1024px+):** shell switches (sidebar, sticky summary, inline nav); content capped at 80rem.
-   **Ultra-wide (1440px+):** all fluid tokens locked at max; extra space becomes margin, never stretched content.

### Core layout primitives

Define these once (CSS utilities or small components) and compose every page from them.

| Primitive | Purpose | Core CSS |
| :--- | :--- | :--- |
| `.container` | Centered, capped content | `inline-size: min(100% - 2 * var(--gutter), 80rem); margin-inline: auto;` |
| `.section` | Vertical rhythm | `padding-block: var(--section-y);` |
| `.stack` | Vertical flow with consistent gap | `display: flex; flex-direction: column; gap: var(--stack-gap, var(--space-s));` |
| `.cluster` | Wrapping inline group (badges, chips, actions) | `display: flex; flex-wrap: wrap; gap: var(--space-xs); align-items: center;` |
| `.auto-grid` | Card grids that reflow without queries | `display: grid; gap: var(--space-l); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--grid-min, 18rem)), 1fr));` |
| `.switcher` | Row ↔ stack at a content threshold | `display: flex; flex-wrap: wrap; gap: var(--space-l);` children `flex: 1 1 calc((var(--switch-at, 40rem) - 100%) * 999);` |
| `.sidebar-layout` | Sidebar + main that stacks when main gets too narrow | `display: flex; flex-wrap: wrap; gap: var(--space-l);` aside `flex: 1 1 var(--side, 16rem);` main `flex: 999 1 0; min-inline-size: 60%;` |
| `.cq` | Container-query host | `container-type: inline-size;` |

### Page-level fluid layouts

-   **Hero:** `.switcher` with `--switch-at: 56rem` — copy and booking card sit side by side once the hero is wide enough, stacking otherwise. Booking card `inline-size: min(100%, 28rem)`. Hero `min-block-size: min(88svh, 48rem)` (use `svh` so mobile browser chrome never clips the form).
-   **Trust strip / How it works / Services:** `.auto-grid` with `--grid-min: 15rem` / `18rem` / `20rem` respectively.
-   **Booking results:** `.sidebar-layout` with `--side: 16rem` at `lg+`; below `lg`, sidebar becomes a `Sheet`.
-   **Checkout:** `grid-template-columns: minmax(0, 1fr) clamp(20rem, 30vw, 24rem)` at `lg+` (≈65/35 split that never squashes the summary); summary `position: sticky; inset-block-start: calc(var(--header-h) + var(--space-s));`.
-   **Auth / lookup / plate / shuttle:** narrow container, centered; `margin-block: clamp(2rem, 8vh, 6rem)`.

### Component-level container queries

Components own their responsiveness via `@container`:

-   **Booking search form:** `< 28rem` stacked fields; `≥ 28rem` date + time pairs side by side; `≥ 52rem` all fields in one row (used on `/booking` inline summary bar).
-   **Parking result card:** `< 36rem` stacked (badges → rules → price + full-width CTA); `≥ 36rem` two-column grid `grid-template-columns: 1fr auto` with price/action column right-aligned; `≥ 52rem` rules move into a 2-column sub-grid.
-   **Booking summary:** `< 24rem` compact collapsible bar; `≥ 24rem` full itemized card.
-   **Quick actions bar (`/payment/success`):** `.cluster` that becomes a 3-column grid at `≥ 36rem`.
-   **SVG diagrams:** `inline-size: 100%; block-size: auto; max-inline-size: 40rem;` with `viewBox` set and `preserveAspectRatio="xMidYMid meet"`; labels use `font-size` in SVG user units, so they scale with the diagram.

### Viewport & safe-area rules

-   Use `svh`/`dvh` (not `vh`) for any full-height region; fall back to `vh` first in the cascade.
-   Respect notches and home indicators: `padding-inline: max(var(--gutter), env(safe-area-inset-left))` etc., and `padding-block-end: max(var(--space-s), env(safe-area-inset-bottom))` on any bottom-pinned bar. Requires `viewport-fit=cover` in the viewport meta.
-   Use logical properties (`inline-size`, `margin-inline`, `inset-block-start`) throughout.
-   `scroll-padding-top: calc(var(--header-h) + var(--space-s))` on `html`, so anchor jumps and focused fields never land under the sticky header.
-   Long references and plates: `overflow-wrap: anywhere` inside monospace blocks.

### Global shell

**Marketing and operational pages**
1. Site header.
2. Main content.
3. Footer.
4. Optional mobile booking CTA only when it does not cover form controls or important content.

**Unified Checkout (`/checkout`)**
1. Compact header with logo, "Back to results" link, and support link.
2. Progress indicator.
3. Main two-step accordion form (Details $\rightarrow$ Payment) and booking summary.
4. Policy/help links.
5. No full marketing navigation; reduce distractions and page reloads.

**Auth pages**
1. Compact brand header.
2. Centered form panel.
3. Minimal footer with relevant legal/help links.

### Header

Desktop:
- Logo/wordmark on the left.
- Primary navigation in the center or toward the right.
- Quick utility link for "Manage booking" or "Request shuttle".
- "Book parking" button on the right.

Mobile:
- Logo on the left.
- Quick "Shuttle" action and Menu button on the right.
- Navigation opens in a shadcn `Sheet`.
- Keep the header compact and avoid crowding.

Navigation suggestions:
- Services
- How it works
- Manage booking
- Call shuttle
- FAQ
- Contact
- Book parking

Only include links that lead to implemented pages.

### Footer

Use a dark or light neutral surface, depending on the page layout. Include:
- Brand and short description.
- Parking/service links.
- Quick self-serve links: Manage booking, Call shuttle, Plate lookup, Damage report.
- Customer support links and FAQ.
- Terms, privacy, cancellation policy.
- Actual contact information once confirmed.

Do not invent phone numbers, email addresses, physical addresses, or operating hours.

------------------------------------------------------------------------

## 4. Homepage layout

The homepage should let visitors search for parking without scrolling through a long brand introduction.

### Recommended section order

1.  Header.
2.  Hero and booking search.
3.  Quick utility bar for returning travelers ("Already parked? Request your shuttle or look up your plate").
4.  Trust/benefit strip.
5.  How it works.
6.  Parking/service options.
7.  Why choose GoPark.
8.  Customer reviews, if genuine reviews are available.
9.  FAQ preview.
10. Final booking CTA.
11. Footer.

### Hero section

**Purpose:** explain the service and begin the booking flow immediately.

Suggested copy:
- Eyebrow: "AIRPORT PARKING, SIMPLIFIED"
- Heading: "Park smart. Travel easy."
- Supporting text: "Arrange your airport parking before your trip and keep your travel plans organized."
- Primary CTA: "Find parking"

Layout:
- Desktop: headline and supporting copy on the left; booking form on the right.
- Mobile: headline and short description first, followed immediately by the booking form.
- Add a low-poly CSS/SVG decorative background behind the content, using pale-grey facets.
- Keep the booking form on a solid white surface with a border.

### Booking search form

Fields:
1. Airport/location.
2. Drop-off date and time.
3. Pick-up date and time.
4. Dynamic duration summary badge (e.g., "4 Days, 3 Hours of parking").
5. "Find parking" submit button.

UX rules & error prevention:
- Use visible labels.
- **Smart defaults:** if no dates are in the URL/session, default Drop-off to *Tomorrow at 09:00 AM* and Pick-up to *+3 days at 01:00 PM* using 15- or 30-minute time increments so users can test or adjust quickly.
- **Time-mistake helper copy:**
  - Below Drop-off: *"Tip: Select a time 2–3 hours before your flight departure."*
  - Below Pick-up: *"Tip: Add 45–60 minutes after landing for baggage claim."*
- **Midnight/Noon clarity:** clearly label `12:00 PM (Noon)` and `12:00 AM (Midnight)` in time selectors. If a user selects a time between `00:00` and `04:00`, show a subtle confirmation note verifying the exact night/morning.
- Prevent pick-up from being earlier than drop-off; automatically shift pick-up forward if the user moves drop-off past it.
- Display validation close to the relevant field.
- Preserve the search values in URL query parameters (`?airport=...&from=...&to=...`) so results can be bookmarked, shared, or refreshed without data loss.
- On mobile, stack fields vertically.
- Do not display a real airport as selected by default unless GoPark operates at only one airport or that is an intentional product decision.

### Trust/benefit strip

Use three or four concise benefits with monochrome icons, such as:
- Clear booking details & upfront total pricing.
- Easy online modifications if flights change.
- Fast mobile shuttle dispatch.
- Dedicated customer support.

Only make claims supported by actual operations. Avoid unverified phrases such as "24/7 monitored," "fully insured," or "guaranteed security."

### How it works

Three simple steps:
1. Choose your location and dates.
2. Compare options and reserve online (no account required).
3. Follow your confirmed parking and shuttle instructions.

Use numbered cards, small icons, and short copy. On mobile, stack the cards vertically.

### Services and benefits

Use a consistent grid of service cards. Each card contains:
- Monochrome icon or CSS/SVG placeholder.
- Service name.
- One or two lines of explanatory text.
- Key operational attributes (e.g., covered vs. uncovered, self-park vs. valet).
- Optional text link.

Possible services include long-term parking, covered parking, shuttle transfers, valet parking, or EV charging only if GoPark actually offers them.

### Reviews

Only render real, approved customer reviews. If reviews are not available, omit the section or use a neutral "What to expect" section instead. Do not invent testimonials, star ratings, or customer counts.

### FAQ preview and final CTA

- Show four to six common questions using an accordion.
- Link to the full FAQ page.
- End with a compact monochrome CTA panel and "Find parking" button.

------------------------------------------------------------------------

## 5. Booking results page --- `/booking`

**Purpose:** help customers compare options based on price, transfer time, and vehicle rules, then select a suitable parking space.

### Desktop layout

- Page heading and inline editable search summary bar at the top (allowing date/time updates without leaving the page).
- Results count and sort control.
- Narrow filters sidebar on the left.
- Results list in the main content area.

### Mobile layout

- Compact sticky or top search summary bar with an obvious "Edit dates" trigger (opens search editor in a `Sheet` or collapsible panel).
- Filters button and Sort control paired in a single utility row near the result count.
- Full-width result cards.
- Clear selection action on each card.
- Avoid a fixed bottom panel that obscures content or mobile browser controls.

### Parking result card

Travelers evaluate parking based on **time risk** and **vehicle rules** as much as price. Structure each card in this exact order for rapid 2-second scanning:

1. **Header & Decision Badges:**
   - Parking option name.
   - Standardized scannable badges at the top:
     - **Key policy:** `[Keep Your Keys]` vs. `[Valet Holds Keys]`
     - **Protection:** `[Covered]` vs. `[Open Air]`
     - **Transfer:** `[~8 min Shuttle • Every 15m]` or `[Walk to Terminal]`
2. **Operational & Vehicle Rules:**
   - **Recommended arrival buffer:** e.g., *"Arrive at lot at least 20 mins before you need to be at your terminal."*
   - **Vehicle size/height restrictions:** e.g., *"Max height: 2.1m (6'10\")"* or *"Fits standard SUVs & sedans."*
   - **Cancellation highlight:** e.g., *"Free cancellation up to 24h before drop-off"* (if applicable).
3. **Price & Action Area:**
   - Price per day (secondary text).
   - **Total price for the selected duration** (prominent primary text, including mandatory fees).
   - Expandable "Details & inclusions" drawer/accordion for map/directions preview and full restrictions.
   - Primary "Select parking" button (navigates directly to `/checkout`).

### Filters and sorting

Possible filters, depending on actual inventory:
- Price range.
- Parking type (Self-park / Keep keys vs. Valet).
- Covered / Uncovered.
- Shuttle / Walkable.
- Vehicle height clearance / Oversized vehicle support.
- Accessibility or EV charging, if available.

Sorting:
- Recommended.
- Lowest total price.
- Fastest terminal transfer time, if reliable data exists.

Do not show fake inventory, availability, distances, transfer times, or prices in the production UI. Use clearly labelled placeholders in design mockups.

### Empty and error states

- **No results:** explain that no matching options were found; if active filters caused the empty state, provide a one-click **"Reset filters"** button alongside the option to change dates.
- **Loading:** show skeleton cards with stable layout dimensions to prevent layout shift.
- **Search error:** preserve the search inputs and provide a retry action.
- **Expired availability:** ask the user to refresh results before proceeding.

------------------------------------------------------------------------

## 6. Unified Checkout & Payment page --- `/checkout`

**Purpose:** collect the minimum required customer/vehicle information and complete payment in a single, distraction-free flow without full-page reloads. *(Note: If `/payment` is accessed directly via a shared link or retry link, redirect or render Step 2 of `/checkout` directly).*

### Layout

Desktop:
- **Header:** Compact header with logo, "Back to parking options" link, and support link.
- **Main column (Left, ~65%):** Two-step sequential accordion:
  - **Step 1: Your Details & Vehicle**
  - **Step 2: Review & Payment**
- **Side column (Right, ~35%):** Sticky booking summary card showing selected lot, drop-off/pick-up timestamps, total duration, itemized price breakdown (base rate + taxes/fees), and key cancellation rules.

Mobile:
- Single column.
- Collapsible booking summary bar pinned at the top showing the selected lot name, dates, and **Total Price** (tapping expands full itemized breakdown).
- Two-step sequential accordion below.
- Never let a sticky CTA cover the last field or validation message.

### Progress indicator

Display a clear step sequence at the top:
1. Select Parking (Completed — clickable to return to `/booking`)
2. Details & Payment (Current)
3. Confirmation

### Step 1: Customer, Vehicle & Travel Details

Guest checkout is the default experience. Do not require account creation or login before checkout; provide an unobtrusive *"Already have an account? Sign in to autofill"* link at the top of Step 1.

**1. Contact details**
- Full name (`autocomplete="name"`).
- Email address (`type="email"`, `inputMode="email"` — helper text: *"We'll send your parking pass and receipt here"*).
- Mobile phone number (`type="tel"`, `inputMode="tel"` — helper text: *"Used only for shuttle dispatch updates and urgent lot alerts"*).

**2. Vehicle details**
- **Registration plate:** formatted with `autoCapitalize="characters"`, `spellCheck="false"`, and a monospace font.
- **"I don't know my plate yet" fallback:** include an explicit checkbox right below the plate input: **"I don't have my license plate yet / Driving a rental car."**
  - When checked, disable and mark the plate input as optional for now, and display a calm note: *"No problem. We'll email you a quick link to add your plate before you arrive."*
- Make/model and Color (only if operationally required; otherwise mark optional or collect later).

**3. Travel details (Optional unless operationally required)**
- Outbound/Return flight number or terminal (helper text: *"Optional — helps our team track flight delays"*).

**Step 1 Action:**
- Clicking **"Continue to payment"** validates Step 1 inline.
- Once valid, Step 1 smoothly collapses into a compact read-only summary card with an **"Edit"** button, and **Step 2: Payment** expands immediately below.

### Step 2: Payment & Policies

1. **Policies & Consent:**
   - Concise summary of cancellation, refund, and vehicle conditions.
   - Required consent checkbox (never pre-checked) only if legally or operationally necessary.
2. **Payment Method Selection:**
   - Rendered via the actual payment provider's secure embed/elements (e.g., Apple Pay / Google Pay express buttons at top, followed by Card or regional payment methods).
   - Do not collect or store raw card details outside the payment provider's compliant components.
3. **Final Price & Primary CTA:**
   - Clearly restate the final total amount and any applicable fees.
   - Full-width primary button: **"Pay [Total Amount] & Confirm Booking"**.

### Validation, Security & Error Recovery

- Validate fields on blur/submit and show concise inline errors with both an icon and `--destructive` styling.
- Retain all valid customer and vehicle entries if a payment error occurs.
- Disable duplicate submission while payment is processing and display a clear loading spinner and status text (*"Confirming your reservation..."*).
- If payment fails, keep the user on Step 2 with their details intact, explain the failure clearly, and allow immediate retry or payment method switching.
- Never navigate to `/payment/success` before the payment provider confirms success (or confirmed pending status).

------------------------------------------------------------------------

## 7. Payment success page --- `/payment/success`

**Purpose:** remove all arrival uncertainty, provide offline-ready passes for poor airport cell reception, and tell the customer exactly what to do on travel day.

### Section order

1. **Confirmation Banner:**
   - Semantic success icon and **"Booking confirmed"** heading (or clear **"Payment pending"** warning banner if asynchronous payment is still clearing).
   - Prominent **Booking Reference** in large monospace font with a one-tap **"Copy"** button.
2. **Offline-Ready Quick Actions Bar:**
   - **QR Code / Entry Barcode** (if facility uses automated scanners).
   - **"Add to Apple / Google Wallet"** or **"Download PDF Pass"** (critical for underground airport garages with weak cellular signal).
   - **"Add to Calendar"** (creates calendar event with lot address, recommended arrival time, and shuttle link).
3. **"What to Do on Arrival & Return" Checklist:**
   - **Step A (Drop-off):** Lot address, GPS navigation links (Google Maps / Apple Maps / Waze), high-contrast SVG entrance diagram, and entry instructions.
   - **Step B (Transfer to Terminal):** How and where to board the outbound shuttle.
   - **Step C (When You Land):** Direct link and instructions to use `/call-shuttle`.
4. **Reservation & Vehicle Summary:**
   - Drop-off and pick-up date/time.
   - Vehicle details — if the user checked *"I don't know my plate yet"* during checkout, highlight a prominent **"Add your license plate now"** action card here.
   - Payment summary and downloadable receipt link.
5. **Post-Purchase One-Click Account Creation (for Guest Checkouts):**
   - Since Name, Email, Phone, and Vehicle are already captured, show a lightweight card: *"Save this booking and your vehicle for 1-click checkout next time — just create a password."* (Requires only a single password input field).
6. **Self-Serve Management & Support:**
   - **"Manage or modify booking"** button (links to `/booking/manage`).
   - Customer support contact details.

------------------------------------------------------------------------

## 8. Manage booking page --- `/booking/manage`

**Purpose:** allow travelers to handle flight delays, trip extensions, license plate updates, and cancellations via self-service without waiting on customer support.

### Entry & Verification flow

1. If accessed via a tokenized link from confirmation email/SMS, load the booking directly.
2. If accessed publicly from the header/footer, show a clean lookup card requiring:
   - **Booking Reference** (monospace uppercase input).
   - **Email Address** used during booking.
   - Use generic error messages and rate limiting to prevent booking enumeration.

### Authenticated Booking Dashboard

Once verified, display:
1. **Current Reservation Status Badge:** `Confirmed`, `Active (In Lot)`, `Plate Required`, `Completed`, or `Cancelled`.
2. **Primary Self-Serve Actions:**
   - **Add / Update License Plate:** inline edit control for travelers who booked without a plate or switched to a rental car.
   - **Change Dates / Extend Parking (Flight Delay Flow):**
     - Lets the user adjust Drop-off or Pick-up date/time.
     - Automatically calculates and displays any price difference (additional charge or partial refund) before the user confirms the change.
   - **Request Pickup Shuttle:** prominent shortcut to `/call-shuttle` pre-filled with this booking's token.
   - **Resend Confirmation / Download Pass & Receipt.**
3. **Cancel Booking Flow:**
   - Secondary destructive button: **"Cancel booking"**.
   - Opens an `AlertDialog` that explicitly states the cancellation policy and the **exact refund amount** the customer will receive before they confirm cancellation.

------------------------------------------------------------------------

## 9. Damage report page --- `/damage-report`

**Purpose:** make it easy and calm for a customer standing near their vehicle to submit an accurate, well-documented report.

### Form sequence

1.  Booking reference or secure booking verification.
2.  Vehicle identification (pre-filled if verified via booking reference).
3.  Date/time the damage was noticed.
4.  **Interactive SVG Vehicle Zone Selector:**
    - Render a clean, low-poly/vector top-down diagram of a vehicle divided into tap targets (`Front Bumper`, `Hood`, `Driver Side`, `Passenger Side`, `Rear`, `Roof`, `Windshield/Glass`) alongside an accessible checkbox list so users can tap where the damage occurred.
5.  Damage type (Scratch/Scuff, Dent, Glass, Tire/Wheel, Other) and short description.
6.  **Mobile-Optimized Photo Upload:**
    - Support direct mobile camera capture (`accept="image/*" capture="environment"`) as well as gallery selection.
    - Prompt user with a helpful checklist: *(1) Close-up of damage, (2) Wide shot showing vehicle plate & surroundings*.
7.  Contact details confirmation.
8.  Submit report.
9.  Confirmation screen with **Case Reference Number**, summary of submitted details, and clear explanation of the review process (without promising unverified response times).

### UX requirements

-   Show upload constraints, thumbnail previews, and upload progress bars.
-   Automatically compress or handle large smartphone photos gracefully rather than failing silently.
-   Provide an accessible file picker and clear remove/replace controls.
-   Do not expose reports or personal data to unauthenticated users.

------------------------------------------------------------------------

## 10. Call shuttle page --- `/call-shuttle`

**Purpose:** help a tired traveler who just landed request a pickup shuttle with near-zero typing.

### Entry modes

- **Mode A: Pre-Authenticated Magic Link (Preferred):** Sent via SMS/Email on the traveler's return date (`/call-shuttle?token=...`). Skips manual verification and greets the user immediately: *"Welcome back, [Name]. Ready for pickup?"*
- **Mode B: Quick Lookup:** If visiting `/call-shuttle` directly, allow verification via Booking Reference OR License Plate + Last 4 digits of phone number/OTP.

### Section order

1.  Page heading: **"Request your shuttle"**.
2.  **Baggage Claim Gate Check:**
    - Prominently display a reminder checkbox or banner: *"Please request your shuttle only after you have collected your luggage and are walking to the pickup zone."*
3.  **Terminal & Pickup Door Selection:**
    - Clear visual selector for Terminal (`Terminal 1`, `Terminal 2`, etc.).
    - Immediately upon selecting a terminal, display **exact pickup zone instructions and a high-contrast SVG wayfinding diagram** (e.g., *"Exit Arrivals Level, cross to Island B, Signpost #4"*).
4.  Passenger count & accessibility/oversized luggage notes (simple +/- steppers or pill toggles).
5.  **"I'm at the pickup zone — Request Shuttle"** primary action.
6.  **Live Active Request Status Panel (Post-Submit):**
    - Shows current status (`Request Received` $\rightarrow$ `Shuttle Dispatched` $\rightarrow$ `Arriving Now`) with semantic status badges and timestamp.
    - Displays vehicle identification details for the shuttle (e.g., van description/number) if operationally available.
    - **Post-Request Self-Serve Controls:**
      - **"Change Terminal / Pickup Door"** button (in case the traveler walked out of a different exit).
      - **"Cancel Request"** button (with confirmation dialog, in case they took a taxi or found another ride).
7.  Direct support contact fallback.

### UX requirements

-   Prevent accidental duplicate requests.
-   Provide loading, accepted, unavailable, and failed states.
-   Display an estimated wait time only when backed by reliable operational data.
-   Provide a clear fallback instruction (e.g., dispatch phone number or scheduled frequency info) if on-demand shuttle dispatch is offline.

------------------------------------------------------------------------

## 11. Plate lookup page --- `/plate`

**Purpose:** provide a fast entry point at the lot or terminal for customers who remember their vehicle registration plate but don't have their booking email handy.

### Section order

1.  Compact GoPark header.
2.  Heading and short explanation.
3.  **License Plate Input:** large, uppercase monospace input (`autoCapitalize="characters"`, `spellCheck="false"`).
4.  **Lightweight Verification Step:** to protect privacy without requiring a forgotten booking reference, verify using **Last 4 digits of the phone number** on the booking or a quick **SMS/Email OTP**.
5.  Matching booking summary.
6.  Relevant quick actions: **Request Shuttle**, **View Directions/QR Pass**, or **Extend Parking**.
7.  Help link and error state.

### Privacy requirements

-   A registration plate alone must never expose personal information or full booking details.
-   Use strict rate limiting and abuse protection.
-   Do not reveal whether a plate is associated with a customer in a way that enables enumeration before the secondary verification step is completed.
-   Avoid logging unnecessary sensitive data.

------------------------------------------------------------------------

## 12. About page --- `/about`

Recommended order:
1. Intro heading and concise company description.
2. Mission and service approach.
3. How the parking operation works.
4. Verified security and operational practices.
5. Team/company information if available.
6. Customer support and booking CTA.

Use a split layout on desktop and a single column on mobile. Use CSS geometric motifs instead of photographs. Only publish verified company facts.

------------------------------------------------------------------------

## 13. Services page --- `/services`

Recommended order:
1. Page heading and short introduction.
2. Service cards with standardized operational badges (Covered/Uncovered, Keep Keys/Valet, Transfer type, Vehicle height clearance).
3. What is included with each service.
4. Important conditions and limitations.
5. How the service works.
6. FAQs.
7. Booking CTA.

Use a consistent card grid. Keep service names, inclusions, restrictions, and price information easy to scan. Hide or label unavailable services instead of presenting them as active offerings.

------------------------------------------------------------------------

## 14. FAQ page --- `/faq`

Recommended order:
1. Page heading and short intro.
2. Instant client-side search/filter input.
3. Category pill navigation.
4. Accordion groups.
5. Contact support CTA.

Suggested categories:
- Booking and payment.
- Arrival and departure.
- Parking and vehicle care.
- Shuttle service.
- Flight delays, changes, and cancellations.
- Damage reports.
- Account and privacy.

Use the shadcn `Accordion` component. Ensure keyboard operation, visible focus, and clear expanded/collapsed states. Keep each answer concise and link directly to self-serve tools (`/booking/manage`, `/call-shuttle`, `/damage-report`) when appropriate.

------------------------------------------------------------------------

## 15. Contact page --- `/contact`

Recommended order:
1. Heading and expected support routes.
2. **Urgent Operational Triage Banner:** direct travelers who are currently waiting for a shuttle or modifying an active booking to `/call-shuttle` or `/booking/manage` for immediate self-service.
3. Contact methods that are actually staffed.
4. Contact form.
5. Facility address/map only when confirmed.
6. Business hours, if confirmed.
7. FAQ and damage-report links.

Contact form fields may include name, email, booking reference (optional), topic, and message. Show submission progress, success, and error states. Do not invent contact details or imply 24/7 support without confirmation.

------------------------------------------------------------------------

## 16. Authentication pages

Suggested routes:
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/verify-email` or an OTP route if the authentication system supports it.

### Role of authentication in UX

- **Accounts are an optional convenience for repeat travelers, never a gatekeeper.**
- All core flows (booking, payment, managing a booking via reference, calling a shuttle, and reporting damage) must work seamlessly for guest users via booking reference + email/phone verification.
- Logged-in users benefit from saved vehicles (plates/models), saved contact details, and a central dashboard of past and upcoming trips.

### Layout & security

- Compact brand header and centered form card with a readable maximum width.
- Provide password visibility toggles (`Show/Hide`).
- Use clear validation and generic recovery responses to prevent account enumeration.
- Support password managers, passkeys, and OTP autofill (`autocomplete="one-time-code"`).
- Rate-limit sensitive actions and use secure server-side session handling.

------------------------------------------------------------------------

## 17. Component system

Use shadcn/ui primitives where they fit. Add custom components only when the product needs behavior or composition not supplied by the installed component set.

| Component/purpose | Recommended implementation |
| :--- | :--- |
| Site header | Custom composition with `Button`, `NavigationMenu`, and mobile `Sheet` |
| Mobile navigation | `Sheet` |
| Buttons | shadcn `Button` variants |
| Booking search form | `Form`, `Input`, `Label`, `Select`, `Popover`, `Calendar`, plus live duration badge |
| Date/time selection | `Calendar` plus accessible 15/30-min increment time controls with Noon/Midnight labels |
| Result cards | `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Badge`, and expandable `Collapsible` details |
| Filters | `Checkbox`, `RadioGroup`, `Select`, optional `Slider` |
| Unified Checkout steps | 2-step controlled accordion/stepper using semantic markup |
| Booking summary | Sticky desktop `Card` + mobile collapsible top bar |
| License plate input | Custom formatted `Input` (`uppercase`, `monospace`, wide tracking) + "Add later" `Checkbox` |
| FAQs | `Accordion` with search filter |
| Alerts & Banners | `Alert` using semantic `--destructive`, `--warning`, and `--success` tokens |
| Confirm destructive actions | `AlertDialog` (used for booking cancellation and shuttle cancellation) |
| Toast feedback | `Sonner` |
| Loading states | `Skeleton` |
| Status labels | `Badge`, always pairing color token with an icon and text label |
| Damage zone selector | Interactive inline SVG top-down vehicle map synced with accessible `Checkbox` controls |
| Damage photo uploads | Native file input (`capture="environment"`) with custom accessible preview & progress |
| Geometric surfaces | CSS utility classes or a small reusable component |

------------------------------------------------------------------------

## 18. Suggested Next.js project structure

Use the App Router and TypeScript. Route groups organize layouts cleanly without changing public URLs.

```text
gopark/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   ├── booking/
│   │   ├── page.tsx
│   │   └── manage/page.tsx
│   ├── checkout/page.tsx
│   ├── payment/
│   │   ├── page.tsx          # Redirects to or aliases /checkout Step 2
│   │   └── success/page.tsx
│   ├── damage-report/page.tsx
│   ├── call-shuttle/page.tsx
│   ├── plate/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── site-header.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── site-footer.tsx
│   │   └── checkout-header.tsx
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── booking-search-form.tsx
│   │   ├── returning-traveler-bar.tsx
│   │   ├── trust-strip.tsx
│   │   ├── how-it-works.tsx
│   │   ├── service-grid.tsx
│   │   └── faq-preview.tsx
│   ├── booking/
│   │   ├── booking-search-summary.tsx
│   │   ├── booking-filters.tsx
│   │   ├── parking-card.tsx
│   │   ├── checkout-accordion.tsx
│   │   ├── booking-summary.tsx
│   │   └── manage-booking-view.tsx
│   ├── operations/
│   │   ├── shuttle-request-card.tsx
│   │   ├── terminal-wayfinding-svg.tsx
│   │   ├── vehicle-damage-map-svg.tsx
│   │   └── license-plate-input.tsx
│   ├── low-poly/
│   │   └── geometric-surface.tsx
│   └── ui/
├── lib/
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── booking.ts
└── public/
```

No raster image assets are required. Keep `public/` empty unless non-image static files (such as wallet pass templates or downloadable PDF receipts) become necessary. Use CSS and inline SVG for geometric artwork and operational diagrams.

------------------------------------------------------------------------

## 19. CSS implementation notes

Use CSS variables as the single source of truth for the theme. Map these variables to the token names expected by the installed Tailwind/shadcn configuration.

### Fluid token foundation (`app/globals.css`)

```css
:root {
  /* Fluid type — 320px → 1440px */
  --text-hero: clamp(2.25rem, 1.821rem + 2.143vw, 3.75rem);
  --text-h1:   clamp(1.75rem, 1.464rem + 1.429vw, 2.75rem);
  --text-h2:   clamp(1.375rem, 1.196rem + 0.893vw, 2rem);
  --text-h3:   clamp(1.125rem, 1.054rem + 0.357vw, 1.375rem);
  --text-body: clamp(1rem, 0.964rem + 0.179vw, 1.125rem);
  --text-sm:   0.875rem;
  --text-xs:   clamp(0.75rem, 0.732rem + 0.089vw, 0.8125rem);
  --text-ref:  clamp(1.375rem, 1.196rem + 0.893vw, 2rem);

  /* Fluid space */
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs:  clamp(0.5rem, 0.429rem + 0.357vw, 0.75rem);
  --space-s:   clamp(1rem, 0.929rem + 0.357vw, 1.25rem);
  --space-m:   clamp(1.5rem, 1.357rem + 0.714vw, 2rem);
  --space-l:   clamp(2rem, 1.714rem + 1.429vw, 3rem);
  --space-xl:  clamp(3rem, 2.429rem + 2.857vw, 5rem);
  --section-y: clamp(3rem, 1.571rem + 7.143vw, 8rem);
  --gutter:    clamp(1rem, 0.429rem + 2.857vw, 3rem);

  /* Shape & shell */
  --radius:      0.75rem;
  --radius-card: clamp(0.75rem, 0.679rem + 0.357vw, 1rem);
  --control-h:   3rem;
  --cta-h:       3.25rem;
  --header-h:    clamp(3.5rem, 3.214rem + 1.429vw, 4.5rem);
  --container:   80rem;
  --container-narrow: 36rem;
}

html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-padding-top: calc(var(--header-h) + var(--space-s));
}
body {
  font-size: var(--text-body);
  line-height: 1.6;
  background: var(--background);
  color: var(--foreground);
}
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }

.container {
  inline-size: min(100% - 2 * var(--gutter), var(--container));
  margin-inline: auto;
}
.container-narrow {
  inline-size: min(100% - 2 * var(--gutter), var(--container-narrow));
  margin-inline: auto;
}
.section { padding-block: var(--section-y); }
.stack   { display: flex; flex-direction: column; gap: var(--stack-gap, var(--space-s)); }
.cluster { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-xs); }
.auto-grid {
  display: grid;
  gap: var(--space-l);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--grid-min, 18rem)), 1fr));
}
.switcher { display: flex; flex-wrap: wrap; gap: var(--space-l); }
.switcher > * { flex: 1 1 calc((var(--switch-at, 40rem) - 100%) * 999); }
.cq { container-type: inline-size; }

/* Example: parking card responds to its slot, not the viewport */
.parking-card { container: card / inline-size; }
@container card (min-width: 36rem) {
  .parking-card__body {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-m);
    align-items: end;
  }
}

.price-total {
  font-size: var(--text-h2);
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Tailwind v4 mapping — expose tokens as utilities so components use `text-h1`, `p-m`, `gap-l`, `px-gutter` instead of arbitrary values. Type tokens already live in Tailwind's `--text-*` namespace, so declare them **in `@theme`** (Tailwind emits them on `:root`) instead of in `:root` — re-mapping `--text-h1: var(--text-h1)` would be circular. Space tokens use a different name, so map them with `@theme inline`:

```css
@theme {
  --text-hero: clamp(2.25rem, 1.821rem + 2.143vw, 3.75rem);
  --text-hero--line-height: 1.05;
  --text-hero--letter-spacing: -0.02em;
  --text-h1: clamp(1.75rem, 1.464rem + 1.429vw, 2.75rem);
  --text-h1--line-height: 1.1;
  --text-h2: clamp(1.375rem, 1.196rem + 0.893vw, 2rem);
  --text-h2--line-height: 1.2;
  --text-h3: clamp(1.125rem, 1.054rem + 0.357vw, 1.375rem);
  --text-h3--line-height: 1.3;
  /* …remove the matching --text-* lines from :root above */
}

@theme inline {
  --spacing-xs: var(--space-xs);
  --spacing-s: var(--space-s);
  --spacing-m: var(--space-m);
  --spacing-l: var(--space-l);
  --spacing-xl: var(--space-xl);
  --spacing-gutter: var(--gutter);
  --spacing-section: var(--section-y);
  --radius-card: var(--radius-card);
}
```

Rules:
-   No arbitrary px values in components (`p-[22px]`, `text-[28px]`); add a token if a gap is missing.
-   No viewport-only `vw` font sizes; always clamp with a `rem` term.
-   Prefer `gap` over margins between siblings.
-   Prefer container queries (`@container`, Tailwind `@sm:`/`@md:`) over `md:`/`lg:` for anything inside a reusable component.

Example neutral geometric surface (scales with viewport so facets don't look tiny on wide screens):

```css
.poly-surface {
  background-color: #f5f5f5;
  background-image:
    linear-gradient(
      135deg,
      transparent 49.5%,
      #e5e5e5 50%,
      transparent 50.5%
    ),
    linear-gradient(
      35deg,
      transparent 49.5%,
      #ededed 50%,
      transparent 50.5%
    );
  background-size:
    clamp(56px, 4vw + 40px, 96px) clamp(56px, 4vw + 40px, 96px),
    clamp(84px, 6vw + 60px, 144px) clamp(84px, 6vw + 60px, 144px);
}

.plate-input {
  font-family: var(--font-geist-mono), monospace;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
}
```

Usage guidance:
- Apply the geometric pattern to decorative hero regions, section accents, or empty states.
- Avoid placing high-contrast geometry behind long text or form controls.
- Respect reduced-motion preferences; geometry should be static by default.
- Keep focus rings visible on every interactive control.
- Avoid low-contrast grey text for essential instructions.

------------------------------------------------------------------------

## 20. Interaction states required

Every interactive component must have designed states, not just a static default.

### Forms
- Default, Focused, Filled, Invalid (with icon + `--destructive`), Disabled, Submitting, Server error, Successful submission.

### Booking & Checkout
- No search entered (smart defaults shown).
- Invalid date range / Midnight warning note.
- Loading results (skeletons).
- Results available.
- No results (with "Reset filters" shortcut).
- Availability or price changed mid-session.
- Step 1 completed & collapsed / Step 2 expanded.
- License plate deferred ("Add later" checked).
- Session expired.

### Payment
- Ready, Processing (duplicate submit locked), Successful, Failed (preserving Step 1 data), Retry available, Payment pending.

### Manage Booking
- Unverified lookup, Verified active booking, Plate missing alert, Date modification price calculation preview, Cancellation refund calculation modal, Cancelled state.

### Shuttle
- Pre-authenticated via token vs. Manual lookup.
- Ready to request (with terminal wayfinding SVG shown).
- Request processing.
- Request active (`Received` $\rightarrow$ `Dispatched` $\rightarrow$ `Arriving`).
- Terminal changed mid-request.
- Request cancelled by user.
- Service unavailable / offline fallback.

### Damage Report
- Empty form, Interactive SVG zone selected, Photo upload in progress, Photo upload failed, Submitting, Report received with Case ID.

------------------------------------------------------------------------

## 21. Accessibility checklist

- Use semantic landmarks: `header`, `nav`, `main`, and `footer`.
- Maintain a logical heading hierarchy.
- Provide visible labels for every form field.
- Make all controls (including interactive SVG vehicle zones) keyboard accessible.
- Show visible focus indicators.
- Ensure dialogs and sheets manage focus correctly.
- Use accessible names for icon-only buttons.
- Announce form errors and live shuttle status updates using `aria-live` regions.
- Never use color as the only indicator of selection, error, warning, or success—always pair semantic tokens with icons and text.
- Ensure body text and badges meet WCAG AA contrast requirements.
- Support browser zoom and narrow viewports without horizontal scrolling.
- Respect `prefers-reduced-motion`.

------------------------------------------------------------------------

## 22. Responsive QA checklist

Test each page at narrow mobile (`320px–375px`), large mobile (`390px–430px`), tablet (`768px`), laptop (`1024px–1280px`), and wide desktop (`1440px+`) sizes.

Also drag-resize continuously from 320px to 1920px. Fluid layouts must never "pop" between sizes, and text must stay readable at 200% browser zoom.

Verify:
- No horizontal scroll at any width from 320px up (check `document.documentElement.scrollWidth === innerWidth`).
- Fluid tokens lock at their min below 320px and their max above 1440px.
- Components reflow based on their container: drop a `ParkingCard` into a narrow sidebar and confirm it uses its stacked layout.
- Full-height regions use `svh`/`dvh`; mobile browser chrome never hides CTAs.
- Bottom-pinned bars clear the iOS home indicator (`safe-area-inset-bottom`).
- Header and navigation do not overflow.
- Search fields stack cleanly on mobile and show the live duration summary badge.
- Date pickers and time dropdowns remain usable near screen edges.
- Booking cards display decision badges (`Keep Keys`, `Covered`, `Transfer Time`), total price, and CTA clearly without cramping.
- Filters work smoothly in a mobile sheet and include a quick reset.
- Unified Checkout accordion transitions smoothly between Step 1 and Step 2 without losing scroll position on mobile.
- Sticky actions never cover inputs or validation messages.
- Long booking references and vehicle plates wrap safely in monospace font.
- Confirmation passes and terminal wayfinding diagrams are legible on small screens in bright outdoor light.

------------------------------------------------------------------------

## 23. Recommended implementation order

1.  **Foundation:** install/configure shadcn/ui, set grayscale + semantic status tokens, establish typography (including monospace utility) and spacing.
2.  **Shared shell:** header (with quick shuttle/manage links), mobile navigation, footer, marketing layout, distraction-free checkout layout, auth layout.
3.  **Core homepage:** hero search form with smart defaults & duration badge, returning traveler bar, benefits, steps, service cards, FAQ preview, CTA.
4.  **Booking results (`/booking`):** editable search summary, filters, scannable result cards with operational badges, sort, empty/loading/error states.
5.  **Unified Checkout & Confirmation (`/checkout` & `/payment/success`):** 2-step accordion form, "Add plate later" option, sticky summary, payment states, offline-ready confirmation pass, post-purchase 1-click account creation.
6.  **Self-serve & operational pages:** Manage booking (`/booking/manage`), tokenized Call shuttle (`/call-shuttle`) with SVG terminal wayfinding, Plate lookup (`/plate`), and Damage report (`/damage-report`) with SVG vehicle map.
7.  **Informational pages:** About, Services, searchable FAQ, Contact with urgent operational triage.
8.  **Authentication:** login, registration, recovery, verification.
9.  **Responsive and accessibility QA:** keyboard, screen reader `aria-live` announcements, contrast, forms, all viewport sizes.

### Definition of done

A page is ready when:
- It follows the shared grayscale + semantic status token system.
- It has a responsive mobile layout tested down to `320px`.
- Its primary action is obvious and guest-friendly.
- All form controls have visible labels, appropriate mobile `inputMode` attributes, and inline validation states.
- Real-world travel edge cases (unknown plates, flight delays, terminal changes, weak cell coverage) are handled gracefully.
- Loading, empty, error, and success states are implemented.
- It uses no photography or raster stock images, relying on clean CSS geometry and functional inline SVGs.

------------------------------------------------------------------------

## 24. Final design principle

GoPark should feel geometric and distinctive around the edges, but effortless and reassuring at the point of action. Whether a traveler is comparing lots from their laptop or standing at a busy airport terminal curb in the rain, the interface must prioritize clarity, speed, and self-service above all else.