import type { Metadata } from "next"
import Link from "next/link"

import { ResetPasswordForm } from "@/components/auth/auth-forms"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = { title: "Reset password | GoPark" }

export default function ResetPasswordPage() {
  return (
    <AuthShell
      media={{ type: "video", src: "/videos/hero.mp4", hdSrc: "/videos/hero-hd.mp4" }}
      caption="Almost there."
      captionBody="Choose a new password and you're back in."
      title="Set a new password"
      description="Use at least 8 characters."
      footer={
        <>
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Back to log in</Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  )
}
