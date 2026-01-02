import { EventCard } from '@/components/common/EventCard'
import { Hero } from '@/components/common/Hero'
import { Section } from '@/components/common/Section'

export default function Home() {
  return (
    <>
      <Hero
        title="Bienvenidos a Iglesia Nueva Casa"
        subtitle="Un lugar para crecer, servir y vivir la fe en comunidad"
      />

      <Section>
        <h2 className="text-2xl font-semibold mb-4">Bienvenidos</h2>
        <p className="text-muted-foreground">
          Somos una comunidad cristiana comprometida con compartir el amor de
          Dios y acompañarte en tu caminar espiritual.
        </p>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold mb-6">Próximos eventos</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <EventCard title="Servicio Dominical" date="Domingo 10:00 AM" />
          <EventCard title="Reunión de Jóvenes" date="Viernes 7:00 PM" />
          <EventCard title="Estudio Bíblico" date="Miércoles 8:00 PM" />
        </div>
      </Section>
    </>
  )
}
