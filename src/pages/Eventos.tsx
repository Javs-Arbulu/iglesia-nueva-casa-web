import { Hero } from '@/components/common/Hero'
import { Section } from '@/components/common/Section'
import { EventCard } from '@/components/common/EventCard'

export default function Eventos() {
  return (
    <>
      <Hero title="Eventos" subtitle="Conoce nuestras próximas actividades" />

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          <EventCard title="Servicio Dominical" date="Domingo 10:00 AM" />
          <EventCard title="Reunión de Jóvenes" date="Viernes 7:00 PM" />
          <EventCard title="Estudio Bíblico" date="Miércoles 8:00 PM" />
          <EventCard title="Ayuno y Oración" date="Sábado 6:00 AM" />
        </div>
      </Section>
    </>
  )
}
