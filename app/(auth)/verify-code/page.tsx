import type { Metadata } from "next"
import Link from "next/link"

import { VerifyCodeForm } from "@/components/auth/auth-forms"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = { title: "Enter your code | GoPark" }

export default function VerifyCodePage() {
  return (
    <AuthShell
      media={{ type: "video", src: "/videos/hero.mp4", hdSrc: "/videos/hero-hd.mp4" }}
      caption="One last step."
      captionBody="Enter the code we emailed you and your account is ready."
      title="Enter your code"
      description="We sent a 6-digit code to your email. It expires in 10 minutes."
      footer={
        <>
          Wrong address?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">Sign up again</Link>
        </>
      }
    >
      <VerifyCodeForm />
    </AuthShell>
  )
}
