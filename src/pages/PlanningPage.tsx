import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'

type ViewMode = 'week' | 'day'

const toDayKey = (date: Date) => date.toISOString().slice(0, 10)

export const PlanningPage = () => {
  const { appointments, prospects } = useApp()
  const [view, setView] = useState<ViewMode>('week')
  const [selected, setSelected] = useState(toDayKey(new Date()))

  const weekDays = useMemo(() => {
    const start = new Date(selected)
    start.setDate(start.getDate() - start.getDay() + 1)
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(start)
      day.setDate(start.getDate() + index)
      return day
    })
  }, [selected])

  const events = appointments
    .map((appointment) => {
      const prospect = prospects.find((item) => item.id === appointment.prospectId)
      return { appointment, prospect }
    })
    .filter((item) => item.prospect)
    .sort(
      (left, right) =>
        new Date(left.appointment.datetime).getTime() - new Date(right.appointment.datetime).getTime(),
    )

  const filteredEvents =
    view === 'day'
      ? events.filter((item) => item.appointment.datetime.slice(0, 10) === selected)
      : events.filter((item) => weekDays.some((day) => item.appointment.datetime.slice(0, 10) === toDayKey(day)))

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView('week')}
            className={`min-h-11 flex-1 rounded-xl ${view === 'week' ? 'bg-[#FF6B35]' : 'border border-zinc-700'}`}
          >
            Vue semaine
          </button>
          <button
            type="button"
            onClick={() => setView('day')}
            className={`min-h-11 flex-1 rounded-xl ${view === 'day' ? 'bg-[#FF6B35]' : 'border border-zinc-700'}`}
          >
            Vue jour
          </button>
        </div>
        <input
          type="date"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
        />
      </section>

      {view === 'week' ? (
        <section className="grid grid-cols-7 gap-2 text-center text-xs">
          {weekDays.map((day) => {
            const dayKey = toDayKey(day)
            const dayEvents = events.filter((item) => item.appointment.datetime.slice(0, 10) === dayKey)
            return (
              <div key={dayKey} className="rounded-xl border border-zinc-800 bg-[#1A1A1A] p-2">
                <p className="text-zinc-400">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                <p>{day.getDate()}</p>
                <div className="mt-2 flex justify-center gap-1">
                  {dayEvents.map((item) => (
                    <span
                      key={item.appointment.id}
                      className={`h-2 w-2 rounded-full ${
                        item.prospect?.status === 'rdv' ? 'bg-[#22C55E]' : 'bg-[#F97316]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      ) : null}

      <section className="space-y-2">
        {filteredEvents.map((item) => (
          <article key={item.appointment.id} className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-3">
            <p className="font-medium">
              {item.prospect?.name} — {item.prospect?.vehicle}
            </p>
            <p className="text-sm text-zinc-400">
              {new Date(item.appointment.datetime).toLocaleString('fr-FR')}
            </p>
            <p className="text-xs text-zinc-500">Google event: {item.appointment.googleEventId ?? 'en cours'}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
