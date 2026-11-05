import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  id: string
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({ id, eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <header className={cn("stack max-w-[48rem] [--stack-gap:var(--space-xs)]", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="text-h2 font-semibold">
        {title}
      </h2>
      {description && <p className="measure text-muted-foreground">{description}</p>}
    </header>
  )
}
