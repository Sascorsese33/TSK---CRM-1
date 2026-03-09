import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import type { AppointmentOutcome } from '../types'

type ViewMode = 'week' | 'day'

const toDayKey = (date: Date) => date.toISOString().slice(0, 10)

export const PlanningPage = () => {
  const { appointments, prospects, updateAppointmentOutcome, scheduleNoShowCallback } = useApp()
  const [view, setView] = useState<ViewMode>('week')
  const [selected, setSelected] = useState(toDayKey(new Date()))
  const [openedCallbackPicker, setOpenedCallbackPicker] = useState<string | null>(null)
  const [callbackDate, setCallbackDate] = useState('')

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

  const outcomeColor: Record<AppointmentOutcome, string> = {
    confirmed: 'bg-violet-500',
    bad_condition: 'bg-yellow-400',
    no_show: 'bg-red-500',
  }

  const outcomeLabel: Record<AppointmentOutcome, string> = {
    confirmed: '🟣 RDV validé',
    bad_condition: '🟡 Véhicule en mauvais état',
    no_show: '🔴 Client pas venu',
  }

  const onScheduleNoShowCallback = (appointmentId: string) => {
    if (!callbackDate) {
      return
    }
    scheduleNoShowCallback(appointmentId, new Date(callbackDate).toISOString())
    setOpenedCallbackPicker(null)
    setCallbackDate('')
  }

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
                      className={`h-2.5 w-2.5 rounded-full ${outcomeColor[item.appointment.outcome]}`}
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
            <p className="mt-1 text-xs text-zinc-300">{outcomeLabel[item.appointment.outcome]}</p>
            <p className="text-xs text-zinc-500">Google event: {item.appointment.googleEventId ?? 'en cours'}</p>
            <select
              value={item.appointment.outcome}
              onChange={(event) =>
                updateAppointmentOutcome(item.appointment.id, event.target.value as AppointmentOutcome)
              }
              className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3 text-sm"
            >
              <option value="confirmed">🟣 RDV validé</option>
              <option value="bad_condition">🟡 Véhicule en mauvais état</option>
              <option value="no_show">🔴 Client pas venu</option>
            </select>

            {item.appointment.outcome === 'no_show' ? (
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    setOpenedCallbackPicker((prev) => (prev === item.appointment.id ? null : item.appointment.id))
                  }
                  className="min-h-11 w-full rounded-xl border border-red-500/50 text-sm text-red-300"
                >
                  Programmer un rappel
                </button>
                {openedCallbackPicker === item.appointment.id ? (
                  <div className="rounded-xl bg-[#0F0F0F] p-2">
                    <input
                      type="datetime-local"
                      value={callbackDate}
                      onChange={(event) => setCallbackDate(event.target.value)}
                      className="min-h-11 w-full rounded-xl border border-zinc-700 bg-transparent px-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => onScheduleNoShowCallback(item.appointment.id)}
                      className="mt-2 min-h-11 w-full rounded-xl bg-[#FF6B35] text-sm font-medium"
                    >
                      Ajouter en prospection
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  )
}
