import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { prettyDuration, since } from '../lib/format'

type FilterRange = 'today' | 'week' | 'month'

export const CallsPage = () => {
  const { calls, prospects, users } = useApp()
  const [range, setRange] = useState<FilterRange>('today')
  const [userFilter, setUserFilter] = useState('all')

  const filteredCalls = useMemo(() => {
    const now = new Date()
    const day = 24 * 60 * 60 * 1000
    const maxAge = range === 'today' ? day : range === 'week' ? day * 7 : day * 31

    return calls
      .filter((call) => now.getTime() - new Date(call.createdAt).getTime() <= maxAge)
      .filter((call) => userFilter === 'all' || call.userId === userFilter)
  }, [calls, range, userFilter])

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-3">
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as FilterRange[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={`min-h-11 flex-1 rounded-xl text-sm ${
                range === value ? 'bg-[#FF6B35] text-white' : 'border border-zinc-700 text-zinc-300'
              }`}
            >
              {value === 'today' ? "Aujourd'hui" : value === 'week' ? 'Semaine' : 'Mois'}
            </button>
          ))}
        </div>
        <select
          value={userFilter}
          onChange={(event) => setUserFilter(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
        >
          <option value="all">Tous les prospecteurs</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </section>

      {filteredCalls.map((call) => {
        const prospect = prospects.find((item) => item.id === call.prospectId)
        return (
          <article key={call.id} className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{prospect?.name}</p>
                <p className="text-sm text-zinc-400">{prospect?.vehicle}</p>
                <p className="text-xs text-zinc-500">{since(call.createdAt)}</p>
              </div>
              <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                {prettyDuration(call.duration)}
              </span>
            </div>

            <audio controls className="mt-3 w-full">
              <source src={call.recordingUrl} />
            </audio>
            <p className="mt-2 rounded-xl bg-[#0F0F0F] p-2 text-sm text-zinc-300">{call.transcript}</p>
            <p className="mt-2 text-xs text-zinc-500">Statut: {prospect?.status ?? 'n/a'}</p>
          </article>
        )
      })}
    </div>
  )
}
