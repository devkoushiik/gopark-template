import type { Metadata } from "next"
import Link from "next/link"

import { SignupForm } from "@/components/auth/auth-forms"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = { title: "Create account | GoPark" }

export default function SignupPage() {
  return (
    <AuthShell
      media={{ type: "video", src: "/videos/hero.mp4", hdSrc: "/videos/hero-hd.mp4" }}
      caption="Park once, travel easy."
      captionBody="An account keeps every booking and receipt together. Booking without one still works."
      title="Create your account"
      description="It takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Log in</Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  )
}
