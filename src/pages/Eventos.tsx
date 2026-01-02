import { useEffect, useState } from 'react'
import { Hero } from '@/components/common/Hero'
import { Section } from '@/components/common/Section'
import { EventCard } from '@/components/common/EventCard'
import { supabase } from '@/services/supabase'

type Event = {
  id: string
  title: string
  description: string | null
  event_date: string
}

export default function Eventos() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true })

      if (!error && data) {
        setEvents(data)
      }

      setLoading(false)
    }

    fetchEvents()
  }, [])

  return (
    <>
      <Hero title="Eventos" subtitle="Conoce nuestras próximas actividades" />

      <Section>
        {loading && <p>Cargando eventos...</p>}

        {!loading && events.length === 0 && <p>No hay eventos programados.</p>}

        <div className="grid gap-4 md:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={new Date(event.event_date).toLocaleDateString()}
            />
          ))}
        </div>
      </Section>
    </>
  )
}
