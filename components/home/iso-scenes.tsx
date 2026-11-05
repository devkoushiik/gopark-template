import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Tiny isometric toolkit. World: x → right-down, y → left-down, z → up */
/* ------------------------------------------------------------------ */
const C = 0.866
const OX = 100
const OY = 44

const pt = (x: number, y: number, z: number) => `${(x - y) * C + OX},${(x + y) * 0.5 - z + OY}`

type BoxProps = {
  x: number
  y: number
  z?: number
  w: number
  d: number
  h: number
  top: string
  left: string
  right: string
  className?: string
  style?: React.CSSProperties
}

/** Solid box: top face + the two visible side faces. */
function Box({ x, y, z = 0, w, d, h, top, left, right, className, style }: BoxProps) {
  const t = z + h
  return (
    <g className={className} style={style}>
      <polygon fill={left} points={[pt(x, y + d, z), pt(x + w, y + d, z), pt(x + w, y + d, t), pt(x, y + d, t)].join(" ")} />
      <polygon fill={right} points={[pt(x + w, y, z), pt(x + w, y + d, z), pt(x + w, y + d, t), pt(x + w, y, t)].join(" ")} />
      <polygon fill={top} points={[pt(x, y, t), pt(x + w, y, t), pt(x + w, y + d, t), pt(x, y + d, t)].join(" ")} />
    </g>
  )
}

/** Flat artwork mapped onto a horizontal plane at height z (draw in world x/y units). */
function TopFace({ z, children }: { z: number; children: React.ReactNode }) {
  return <g transform={`matrix(${C} 0.5 ${-C} 0.5 ${OX} ${OY - z})`}>{children}</g>
}

/** Flat artwork mapped onto a front (+y) wall at depth y0, top edge at height z
 *  (draw with u → world x, v → downward from the top edge). */
function FrontFace({ y0, z, children }: { y0: number; z: number; children: React.ReactNode }) {
  return <g transform={`matrix(${C} 0.5 0 1 ${OX - y0 * C} ${OY + y0 * 0.5 - z})`}>{children}</g>
}

function Scene({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="12 10 186 144" role="img" aria-label={label} className={cn("h-auto w-full max-w-[15rem] overflow-visible", className)}>
      <g className="iso-float">{children}</g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Pick: calendar block, drop-off + pick-up days rise, range lit    */
/* ------------------------------------------------------------------ */
export function IsoCalendar({ className }: { className?: string }) {
  const cols = 4
  const rows = 3
  const size = 15
  const gap = 5
  const x0 = 8
  const y0 = 30
  // drop-off = (0,1), pick-up = (3,1), range between on the same row
  const isEnd = (c: number, r: number) => r === 1 && (c === 0 || c === 3)
  const inRange = (c: number, r: number) => r === 1 && c > 0 && c < 3

  return (
    <Scene label="Calendar with drop-off and pick-up dates selected" className={className}>
      <Box x={0} y={0} w={94} d={94} h={10} top="#ffffff" left="#bcd0ff" right="#93b4ff" />
      {/* binder header */}
      <Box x={0} y={0} z={10} w={94} d={20} h={5} top="#dbe6ff" left="#93b4ff" right="#6f98ff" />
      <Box x={22} y={6} z={15} w={6} d={6} h={9} top="#ffffff" left="#c9d6f5" right="#e3eaf9" />
      <Box x={66} y={6} z={15} w={6} d={6} h={9} top="#ffffff" left="#c9d6f5" right="#e3eaf9" />
      {/* stay range band under the middle row */}
      <TopFace z={10.2}>
        <rect x={x0} y={y0 + (size + gap)} width={cols * size + (cols - 1) * gap} height={size} rx={3} fill="#c7d8ff" />
      </TopFace>
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const x = x0 + c * (size + gap)
          const y = y0 + r * (size + gap)
          if (isEnd(c, r)) {
            return (
              <Box
                key={`${c}-${r}`}
                x={x}
                y={y}
                z={10}
                w={size}
                d={size}
                h={7}
                top="#2563eb"
                left="#3b74f0"
                right="#1d4ed8"
                className="iso-bob"
                style={{ animationDelay: c === 0 ? "0s" : "0.6s" }}
              />
            )
          }
          if (inRange(c, r)) return null
          return (
            <Box key={`${c}-${r}`} x={x} y={y} z={10} w={size} d={size} h={2} top="#f1f5ff" left="#c7d8ff" right="#dbe6ff" />
          )
        }),
      )}
    </Scene>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Book: booking card, detail lines fill in, confirmation pops      */
/* ------------------------------------------------------------------ */
export function IsoBookingCard({ className }: { className?: string }) {
  return (
    <Scene label="Booking card with details filling in and a confirmation check" className={className}>
      {/* shadow */}
      <TopFace z={0}>
        <rect x={6} y={10} width={100} height={66} rx={8} fill="rgb(37 99 235 / 0.45)" />
      </TopFace>
      <Box x={0} y={4} z={8} w={100} d={66} h={6} top="#ffffff" left="#2563eb" right="#1d4ed8" />
      <TopFace z={14.1}>
        {/* avatar */}
        <circle cx={20} cy={24} r={10} fill="#2563eb" />
        <circle cx={20} cy={21} r={3.6} fill="#ffffff" />
        <path d="M13 30 a7 6 0 0 1 14 0" fill="#ffffff" />
        {/* detail lines fill in */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={38}
            y={14 + i * 9}
            width={i === 2 ? 34 : 52}
            height={4.5}
            rx={2.25}
            fill={i === 0 ? "#1d4ed8" : "#bcd0ff"}
            className="iso-grow"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
        {/* plate field */}
        <rect x={10} y={46} width={80} height={14} rx={3} fill="#eef2fb" />
        <rect x={16} y={51} width={30} height={4} rx={2} fill="#2563eb" />
      </TopFace>
      {/* confirmation coin */}
      <g className="iso-pop">
        <Box x={74} y={-6} z={26} w={20} d={20} h={5} top="#ffffff" left="#bcd0ff" right="#93b4ff" />
        <TopFace z={31.1}>
          <path d="M79 4 l4 4 l8 -8" transform="translate(0 0)" fill="none" stroke="#2563eb" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </TopFace>
      </g>
    </Scene>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Park: car park with bays + P sign, car drives into its bay       */
/* ------------------------------------------------------------------ */
export function IsoParking({ className }: { className?: string }) {
  return (
    <Scene label="Car driving into a parking bay" className={className}>
      <Box x={0} y={0} w={110} d={96} h={6} top="#ffffff" left="#93b4ff" right="#6f98ff" />
      <TopFace z={6.1}>
        {/* bays */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={8 + i * 28} y={8} width={2.2} height={40} fill="#93b4ff" />
        ))}
        {/* lane dashes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={8 + i * 20} y={70} width={10} height={2.2} rx={1.1} fill="#c7d8ff" />
        ))}
        {/* target bay highlight */}
        <rect x={39} y={10} width={24} height={36} rx={2} fill="#2563eb" opacity={0.1} />
      </TopFace>
      {/* P sign */}
      <Box x={98} y={10} z={6} w={3} d={3} h={34} top="#93b4ff" left="#6f98ff" right="#4f7ff5" />
      <Box x={90} y={11} z={36} w={18} d={2} h={18} top="#1d4ed8" left="#2563eb" right="#1e40af" />
      <FrontFace y0={13} z={54}>
        <text x={99} y={13.5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#ffffff">
          P
        </text>
      </FrontFace>
      {/* car drives in along -y into the bay */}
      <g className="iso-drive">
        <Box x={41} y={14} z={6} w={20} d={30} h={8} top="#2563eb" left="#1d4ed8" right="#1e40af" />
        <Box x={43} y={22} z={14} w={16} d={14} h={6} top="#ffffff" left="#93c5fd" right="#bfdbfe" />
      </g>
    </Scene>
  )
}

/* ================================================================== */
/* Arrival guide scenes                                               */
/* ================================================================== */
const SLAB = { top: "#ffffff", left: "#bcd0ff", right: "#93b4ff" }
const CAR = { top: "#2563eb", left: "#1d4ed8", right: "#1e40af" }
const GLASS = { top: "#ffffff", left: "#93c5fd", right: "#bfdbfe" }

/** Simple car: body + glass cabin. */
function Car({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <>
      <Box x={x} y={y} z={z} w={20} d={30} h={8} {...CAR} />
      <Box x={x + 2} y={y + 8} z={z + 8} w={16} d={14} h={6} {...GLASS} />
    </>
  )
}

/* 1. Pull up & unload: car under the shelter, suitcase bobbing */
export function IsoUnload({ className }: { className?: string }) {
  return (
    <Scene label="Car parked under the reception shelter with luggage unloaded" className={className}>
      <Box x={0} y={0} w={100} d={96} h={5} {...SLAB} />
      <Car x={34} y={26} z={5} />
      {/* shelter posts + roof over the back half */}
      {[
        [4, 4],
        [92, 4],
      ].map(([x, y]) => (
        <Box key={`${x}`} x={x} y={y} z={5} w={4} d={4} h={26} top="#93b4ff" left="#6f98ff" right="#4f7ff5" />
      ))}
      <Box x={0} y={0} z={31} w={100} d={46} h={3} top="#dbe6ff" left="#93b4ff" right="#6f98ff" />
      {/* suitcase with handle */}
      <g className="iso-bob">
        <Box x={64} y={62} z={5} w={12} d={7} h={15} top="#ffffff" left="#bcd0ff" right="#93b4ff" />
        <Box x={68} y={64} z={20} w={4} d={2} h={4} top="#1d4ed8" left="#1e40af" right="#1d4ed8" />
      </g>
    </Scene>
  )
}

/* 2. Check in: reception booth, confirmation envelope pops up */
export function IsoCheckIn({ className }: { className?: string }) {
  return (
    <Scene label="Reception booth with a confirmation email arriving" className={className}>
      <Box x={0} y={0} w={100} d={96} h={5} {...SLAB} />
      <Box x={14} y={22} z={5} w={46} d={40} h={34} top="#dbe6ff" left="#ffffff" right="#bcd0ff" />
      {/* lit window on the front wall */}
      <FrontFace y0={62} z={39}>
        <rect x={20} y={6} width={34} height={14} rx={2} fill="#2563eb" />
        <rect x={20} y={23} width={34} height={3} rx={1.5} fill="#93b4ff" />
      </FrontFace>
      {/* envelope */}
      <g className="iso-pop">
        <Box x={56} y={0} z={46} w={34} d={22} h={3} top="#ffffff" left="#bcd0ff" right="#93b4ff" />
        <TopFace z={49.1}>
          <path d="M57 1 L73 12 L89 1" fill="none" stroke="#2563eb" strokeWidth={1.8} strokeLinejoin="round" />
        </TopFace>
      </g>
    </Scene>
  )
}

/* 3. Wait for an attendant: attendant guides the car into its bay */
export function IsoAttendant({ className }: { className?: string }) {
  return (
    <Scene label="Attendant guiding a car into its parking row" className={className}>
      <Box x={0} y={0} w={110} d={96} h={5} {...SLAB} />
      <TopFace z={5.1}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={10 + i * 28} y={8} width={2.2} height={42} fill="#93b4ff" />
        ))}
        {/* guide arrow into the bay */}
        <path d="M27 80 L27 58 M21 64 L27 56 L33 64" fill="none" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </TopFace>
      <g className="iso-drive">
        <Car x={16} y={12} z={5} />
      </g>
      {/* attendant: body + head */}
      <Box x={74} y={52} z={5} w={9} d={9} h={20} top="#1d4ed8" left="#2563eb" right="#1e40af" />
      <Box x={75.5} y={53.5} z={25} w={6} d={6} h={6} top="#ffffff" left="#dbe6ff" right="#bcd0ff" />
    </Scene>
  )
}

/* 4. Photos, video & keys: car framed by markers, camera flashes */
export function IsoPhotos({ className }: { className?: string }) {
  return (
    <Scene label="Camera taking photos of a parked car" className={className}>
      <Box x={0} y={0} w={104} d={96} h={5} {...SLAB} />
      <TopFace z={5.1}>
        {/* corner frame markers around the car */}
        <path d="M22 12 h-8 v8 M58 12 h8 v8 M22 70 h-8 v-8 M58 70 h8 v-8" fill="none" stroke="#2563eb" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </TopFace>
      <Car x={30} y={26} z={5} />
      {/* hovering camera with lens */}
      <Box x={70} y={60} z={34} w={22} d={12} h={14} top="#ffffff" left="#bcd0ff" right="#93b4ff" />
      <FrontFace y0={72} z={48}>
        <circle cx={81} cy={7} r={4.5} fill="#2563eb" />
        <circle cx={81} cy={7} r={2} fill="#ffffff" />
      </FrontFace>
      {/* flash */}
      <g className="iso-pop">
        <TopFace z={48.2}>
          <circle cx={74} cy={63} r={6} fill="#ffffff" opacity={0.9} />
        </TopFace>
      </g>
    </Scene>
  )
}

/* ================================================================== */
/* Row rules: stall with the car parked forward or reversed           */
/* ================================================================== */

/** Flat artwork mapped onto a side (+x) wall at x0 (draw with u → world y, v → -z). */
function SideFace({ x0, children }: { x0: number; children: React.ReactNode }) {
  return <g transform={`matrix(${-C} 0.5 0 1 ${OX + x0 * C} ${OY + x0 * 0.5})`}>{children}</g>
}

type Shade = { top: string; slope: string; end: string; side: string }

/** Extrudes a (y, z) side profile along x from x0 to x1: visible faces + the +x cap. */
function Extrude({ x0, x1, profile, shade }: { x0: number; x1: number; profile: [number, number][]; shade: Shade }) {
  // make the profile counter-clockwise in (y, z) so edge normals point outward
  const area = profile.reduce((s, [y, z], i) => {
    const [y2, z2] = profile[(i + 1) % profile.length]
    return s + (y * z2 - y2 * z)
  }, 0)
  const pts = area < 0 ? [...profile].reverse() : profile
  const faces = pts.map(([y1, z1], i) => {
    const [y2, z2] = pts[(i + 1) % pts.length]
    const len = Math.hypot(y2 - y1, z2 - z1) || 1
    const ny = (z2 - z1) / len
    const nz = -(y2 - y1) / len
    if (ny + nz <= 0.01) return null
    const fill = nz > 0.95 ? shade.top : ny > 0.95 ? shade.end : shade.slope
    return (
      <polygon
        key={i}
        fill={fill}
        points={[pt(x0, y1, z1), pt(x1, y1, z1), pt(x1, y2, z2), pt(x0, y2, z2)].join(" ")}
      />
    )
  })
  return (
    <>
      {faces}
      <polygon fill={shade.side} points={pts.map(([y, z]) => pt(x1, y, z)).join(" ")} />
    </>
  )
}

const PAINT: Shade = { top: "#3b74f0", slope: "#2f66e3", end: "#1d4ed8", side: "#1e40af" }
const CABIN: Shade = { top: "#f1f5ff", slope: "#0f172a", end: "#1e293b", side: "#172554" }

function Wheel({ y, z }: { y: number; z: number }) {
  return (
    <>
      <circle cx={y} cy={-z} r={4.6} fill="#0b0f19" />
      <circle cx={y} cy={-z} r={2.7} fill="#cbd5e1" />
      <circle cx={y} cy={-z} r={1.9} fill="#94a3b8" />
      <circle cx={y} cy={-z} r={0.8} fill="#e2e8f0" />
    </>
  )
}

/** Hatchback with a real silhouette: sloped bonnet, raked windscreen, roof, rear glass,
 *  round wheels with rims, side windows, and lights/plate on the visible end.
 *  `front` = which end faces the back of the stall ("north" = low y). */
function DetailedCar({ x, y, z, front }: { x: number; y: number; z: number; front: "north" | "south" }) {
  const w = 26
  const L = 44
  const north = front === "north"
  // profile drawn nose-at-0; mirrored when the nose points south
  const fy = (v: number) => y + (north ? v : L - v)
  const P = (list: [number, number][]) => list.map(([v, h]) => [fy(v), z + h] as [number, number])
  const body = P([[1, 3.5], [43, 3.5], [44, 6], [44, 13], [17, 12.5], [2, 10.5], [0, 7]])
  const cabin = P([[17.5, 12.5], [42, 13], [39.5, 19.5], [27, 20.5], [24.5, 20.5]])
  const wheelsAt = [fy(9), fy(35)]
  return (
    <>
      {/* contact shadow */}
      <TopFace z={z + 0.05}>
        <rect x={x - 2} y={y - 1} width={w + 5} height={L + 3} rx={8} fill="#0b1220" opacity={0.22} />
      </TopFace>
      {/* far-side wheels peek out under the body */}
      <SideFace x0={x + 1}>
        {wheelsAt.map((wy) => <Wheel key={wy} y={wy} z={z + 4.6} />)}
      </SideFace>
      <Extrude x0={x} x1={x + w} profile={body} shade={PAINT} />
      <Extrude x0={x + 2} x1={x + w - 2} profile={cabin} shade={CABIN} />
      <SideFace x0={x + w}>
        {/* shoulder highlight + door shut line + handle */}
        <line x1={fy(3)} y1={-(z + 10.8)} x2={fy(43)} y2={-(z + 12.2)} stroke="#60a5fa" strokeWidth={0.5} opacity={0.7} />
        <line x1={fy(27)} y1={-(z + 4.5)} x2={fy(27)} y2={-(z + 12.6)} stroke="#172554" strokeWidth={0.4} />
        <rect x={fy(north ? 30 : 33)} y={-(z + 11)} width={3} height={0.8} rx={0.4} fill="#93c5fd" />
        {/* wheel arches + wheels */}
        {wheelsAt.map((wy) => (
          <g key={wy}>
            <circle cx={wy} cy={-(z + 4.6)} r={5.6} fill="#0b1220" />
            <Wheel y={wy} z={z + 4.6} />
          </g>
        ))}
      </SideFace>
      {/* side glass on the cabin cap: B-pillar + reflection */}
      <SideFace x0={x + w - 2}>
        <line x1={fy(28)} y1={-(z + 13)} x2={fy(28)} y2={-(z + 20.3)} stroke="#1e40af" strokeWidth={1.2} />
        <path
          d={`M${fy(21)} ${-(z + 13.2)} L${fy(24)} ${-(z + 18)} L${fy(25.5)} ${-(z + 18)} L${fy(22.5)} ${-(z + 13.2)} Z`}
          fill="#ffffff"
          opacity={0.18}
        />
      </SideFace>
      {/* visible end face details */}
      {north ? (
        <FrontFace y0={y + L} z={z + 13}>
          {/* rear: tail lights, plate, bumper */}
          <rect x={x + 1} y={1} width={5} height={2} rx={0.8} fill="#ef4444" />
          <rect x={x + w - 6} y={1} width={5} height={2} rx={0.8} fill="#ef4444" />
          <rect x={x + 6} y={1.6} width={w - 12} height={0.7} fill="#7f1d1d" />
          <rect x={x + w / 2 - 4.5} y={3.6} width={9} height={2.6} rx={0.5} fill="#ffffff" />
          <rect x={x + 1} y={7} width={w - 2} height={1.6} rx={0.6} fill="#172554" />
        </FrontFace>
      ) : (
        <FrontFace y0={y + L} z={z + 10.5}>
          {/* front: headlights, grille, bumper */}
          <rect x={x + 1.5} y={0.6} width={6} height={1.8} rx={0.9} fill="#fef3c7" />
          <rect x={x + w - 7.5} y={0.6} width={6} height={1.8} rx={0.9} fill="#fef3c7" />
          <rect x={x + 9} y={0.9} width={w - 18} height={2.6} rx={0.8} fill="#0b0f19" opacity={0.8} />
          <rect x={x + 1} y={4.6} width={w - 2} height={1.4} rx={0.6} fill="#172554" />
        </FrontFace>
      )}
    </>
  )
}

export function IsoStall({ mode, className }: { mode: "forward" | "reverse"; className?: string }) {
  const forward = mode === "forward"
  return (
    <Scene label={forward ? "Car parked nose-first in its stall" : "Car reversed into its stall"} className={className}>
      <Box x={0} y={0} w={100} d={96} h={5} {...SLAB} />
      {/* back of stall */}
      <Box x={10} y={0} z={5} w={80} d={4} h={10} top="#1d4ed8" left="#2563eb" right="#1e40af" />
      <TopFace z={5.1}>
        {/* stall lines */}
        <rect x={24} y={6} width={2.2} height={52} fill="#93b4ff" />
        <rect x={74} y={6} width={2.2} height={52} fill="#93b4ff" />
        {/* lane edge */}
        <rect x={6} y={66} width={88} height={1.6} fill="#bcd0ff" />
        {/* entry direction: always into the stall (toward the back) */}
        <path d="M50 92 L50 74 M43 81 L50 72 L57 81" fill="none" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </TopFace>
      <g className="iso-drive">
        <DetailedCar x={37} y={10} z={5} front={forward ? "north" : "south"} />
      </g>
    </Scene>
  )
}
