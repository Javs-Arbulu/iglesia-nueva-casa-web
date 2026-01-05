import { useState } from 'react'
import { supabase } from '@/services/supabase'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }])

    if (!error) {
      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        className="w-full border p-2 rounded"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      {success && (
        <p className="text-green-600">Mensaje enviado correctamente 🙌</p>
      )}
    </form>
  )
}
