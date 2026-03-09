import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { formatHour, formatLongDate, isToday } from '../lib/format'
import { StatCard } from '../components/ui/StatCard'

export const DashboardPage = () => {
  const { currentUser, prospects, stats, users } = useApp()

  const todayProspects = useMemo(
    () => prospects.filter((prospect) => isToday(prospect.createdAt)),
    [prospects],
  )
  const rdvCount = todayProspects.filter((prospect) => prospect.status === 'rdv').length
  const refusCount = todayProspects.filter((prospect) => prospect.status === 'refus').length
  const callbackCount = prospects.filter(
    (prospect) => prospect.status === 'callback' && prospect.callbackAt && isToday(prospect.callbackAt),
  ).length

  const ranking = [...stats]
    .sort((left, right) => right.callsCount - left.callsCount)
    .slice(0, 3)
    .map((item, index) => ({
      ...item,
      user: users.find((user) => user.id === item.userId),
      rank: index + 1,
    }))

  const reminders = prospects
    .filter((prospect) => prospect.status === 'callback' && prospect.callbackAt && isToday(prospect.callbackAt))
    .sort((left, right) => new Date(left.callbackAt!).getTime() - new Date(right.callbackAt!).getTime())

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4"
      >
        <h2 className="text-xl font-semibold">Bonjour {currentUser?.name} 👋</h2>
        <p className="text-sm text-zinc-400">{formatLongDate(new Date())}</p>
      </motion.section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard title="Appels aujourd'hui" value={todayProspects.length} />
        <StatCard title="RDV pris" value={rdvCount} color="text-[#22C55E]" />
        <StatCard title="Refus" value={refusCount} color="text-[#EF4444]" />
        <StatCard title="À rappeler" value={callbackCount} color="text-[#F97316]" />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Top prospecteurs aujourd'hui</h3>
        <div className="mt-3 space-y-2 text-sm">
          {ranking.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#0F0F0F] p-3">
              <p>
                {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'} {item.user?.name}
              </p>
              <p className="text-zinc-400">
                {item.callsCount} appels — {item.rdvCount} RDV
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Mes rappels du jour</h3>
        <div className="mt-3 space-y-2">
          {reminders.length === 0 ? (
            <p className="text-sm text-zinc-500">Aucun rappel planifié aujourd'hui.</p>
          ) : (
            reminders.map((prospect) => (
              <div key={prospect.id} className="rounded-xl border border-[#F97316]/40 bg-[#F97316]/10 p-3">
                <p className="font-medium">
                  {prospect.name} — {prospect.vehicle}
                </p>
                <p className="text-sm text-zinc-300">
                  {formatHour(prospect.callbackAt!)} • {prospect.city}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
