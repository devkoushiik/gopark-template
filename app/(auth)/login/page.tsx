import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/components/auth/auth-forms"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = { title: "Log in | GoPark" }

export default function LoginPage() {
  return (
    <AuthShell
      media={{ type: "video", src: "/videos/hero.mp4", hdSrc: "/videos/hero-hd.mp4" }}
      caption="Welcome back."
      captionBody="Your bookings, receipts and shuttle calls, all in one place."
      title="Log in"
      description="Manage your bookings at Fiumicino."
      footer={
        <>
          New to GoPark?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">Create an account</Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
