const HistorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">
              Nuestra Historia
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Todo comenzó en una{' '}
              <span className="text-cyan-400">pequeña sala.</span>
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Hace 10 años, un grupo de 15 personas se reunió en un sueño: crear
              una iglesia que fuera diferente, donde cada persona pudiera
              sentirse en casa y experimentar el amor de Dios sin barreras.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Creemos que la iglesia no es un evento al que asistes, sino una
              familia a la que perteneces. Nuestra historia es el reflejo de que
              juntos podemos lograr lo imposible.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800"
              alt="Reunión pequeña"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HistorySection
