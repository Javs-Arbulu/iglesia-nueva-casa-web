export function ContactForm() {
  return (
    <form className="space-y-4 max-w-md">
      <input type="text" placeholder="Nombre" className="w-full border p-2" />
      <input type="email" placeholder="Email" className="w-full border p-2" />
      <textarea placeholder="Mensaje" className="w-full border p-2" rows={4} />
      <button type="submit" className="border px-4 py-2">
        Enviar
      </button>
    </form>
  )
}
