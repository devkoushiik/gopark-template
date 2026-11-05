import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * Brand logo. `tone` picks the file for the background it sits on:
 * "dark" text for light surfaces (header, mobile nav), "light" text for dark ones (footer).
 */
export function Logo({
  tone = "dark",
  size = "md",
  className,
}: {
  tone?: "dark" | "light"
  /** sm for the header bar, md elsewhere */
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label="GoPark home">
      <Image
        src={tone === "light" ? "/brand/web_logo_light.png" : "/brand/web_logo_dark.png"}
        alt=""
        width={759}
        height={160}
        priority
        className={size === "sm" ? "h-[1.625rem] w-auto" : "h-8 w-auto"}
      />
    </Link>
  )
}
