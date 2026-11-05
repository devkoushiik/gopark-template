/** Oversized brand name pinned behind the footer: as the page scrolls to the end,
 *  the footer content slides up and uncovers it (curtain reveal, pure CSS).
 *  The clip-path wrapper limits the fixed layer to this block's own box. */
export function FooterWordmark() {
  return (
    <div
      aria-hidden
      className="relative h-[calc(clamp(7rem,22vw,20rem)+1.5rem)] select-none [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
    >
      <div className="safe-bottom fixed inset-x-0 bottom-0 flex h-[calc(clamp(7rem,22vw,20rem)+1.5rem)] flex-col overflow-hidden bg-black">
        <p className="mt-auto text-center bg-gradient-to-b from-primary via-primary/60 to-black bg-clip-text text-[clamp(5rem,22vw,20rem)] leading-[0.85] font-bold tracking-tighter text-transparent">
          GoPark
        </p>
      </div>
    </div>
  )
}
