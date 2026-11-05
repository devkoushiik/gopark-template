import type { Metadata } from "next"
import Link from "next/link"

import { ForgotPasswordForm } from "@/components/auth/auth-forms"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = { title: "Forgot password | GoPark" }

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      media={{ type: "video", src: "/videos/hero.mp4", hdSrc: "/videos/hero-hd.mp4" }}
      caption="It happens to everyone."
      captionBody="We'll send a code to reset your password in a moment."
      title="Forgot your password?"
      description="Enter the email you signed up with and we'll send you a 6-digit code."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Back to log in</Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
