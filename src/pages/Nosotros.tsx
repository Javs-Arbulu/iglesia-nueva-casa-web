import { Hero } from '@/components/common/Hero'
import { Section } from '@/components/common/Section'

export default function Nosotros() {
  return (
    <>
      <Hero
        title="Sobre Nosotros"
        subtitle="Nuestra misión, visión y valores"
      />

      <Section>
        <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
        <p className="text-muted-foreground">
          Guiar a las personas a conocer a Dios, crecer en su fe y vivir una
          vida transformada por el evangelio.
        </p>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold mb-4">Nuestra Visión</h2>
        <p className="text-muted-foreground">
          Ser una iglesia que impacta vidas, familias y comunidades con amor,
          servicio y verdad.
        </p>
      </Section>
    </>
  )
}
