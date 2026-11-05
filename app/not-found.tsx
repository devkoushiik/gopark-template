import { CookieBanner } from "@/components/layout/cookie-banner"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { PlateOr404 } from "@/components/shuttle/plate-or-404"

// Unknown paths: either a /PLATE shuttle link or a real 404 (decided client-side, see PlateOr404)
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PlateOr404 />
      </main>
      <SiteFooter />
      <CookieBanner />
    </>
  )
}
