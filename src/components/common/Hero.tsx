interface HeroProps {
  title: string
  subtitle?: string
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </section>
  )
}
