import type { Metadata } from "next"

import { CallShuttle } from "@/components/shuttle/call-shuttle"

export const metadata: Metadata = {
  title: "Call the shuttle | GoPark",
  description: "Back at Fiumicino? Call the free GoPark shuttle to take you to your car.",
}

export default function CallShuttlePage() {
  return <CallShuttle />
}
