import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
}

export function Section({ children }: SectionProps) {
  return <section className="container mx-auto px-4 py-12">{children}</section>
}
