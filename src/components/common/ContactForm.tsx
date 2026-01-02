import { useState } from 'react'
import { supabase } from '@/services/supabase'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }])
        .select()

      if (error) {
        setError(error.message || 'Error al enviar el mensaje')
      } else {
        setSuccess(true)
        setName('')
        setEmail('')
        setMessage('')
      }
    } catch (err: any) {
      setError('Error inesperado al enviar el mensaje')
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
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      {success && (
        <p className="text-green-600">Mensaje enviado correctamente 🙌</p>
      )}

      {error && <p className="text-red-600">Error: {error}</p>}
    </form>
  )
}
