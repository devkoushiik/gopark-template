import type { Metadata } from "next"
import Link from "next/link"
import { MailCheckIcon } from "lucide-react"

import { ResendVerification } from "@/components/auth/auth-forms"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = { title: "Verify your email | GoPark" }

export default function VerifyEmailPage() {
  return (
    <AuthShell
      media={{ type: "video", src: "/videos/hero.mp4", hdSrc: "/videos/hero-hd.mp4" }}
      caption="One last step."
      captionBody="Confirm your email and your account is ready to use."
      title="Check your inbox"
      description="We sent a confirmation link to your email. Open it to activate your account."
      footer={
        <>
          Wrong address?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">Sign up again</Link>
        </>
      }
    >
      <div className="stack [--stack-gap:var(--space-l)]">
        <span className="grid size-16 place-items-center rounded-2xl bg-brand-soft text-primary">
          <MailCheckIcon aria-hidden className="size-8" />
        </span>
        <ResendVerification />
      </div>
    </AuthShell>
  )
}
