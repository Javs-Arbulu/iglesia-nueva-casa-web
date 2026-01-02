interface EventCardProps {
  title: string
  date: string
}

export function EventCard({ title, date }: EventCardProps) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
  )
}
