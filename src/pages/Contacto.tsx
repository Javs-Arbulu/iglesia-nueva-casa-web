import { Hero } from '@/components/common/Hero'
import { Section } from '@/components/common/Section'
import { ContactForm } from '@/components/common/ContactForm'

export default function Contacto() {
  return (
    <>
      <Hero title="Contacto" subtitle="Estamos aquí para escucharte" />

      <Section>
        <ContactForm />
      </Section>
    </>
  )
}
