import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatLongDate, isToday } from '../lib/format'
import { StatCard } from '../components/ui/StatCard'

export const DashboardPage = () => {
  const { currentUser, prospects, stats, users } = useApp()
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today')

  const todayProspects = useMemo(
    () => prospects.filter((prospect) => isToday(prospect.createdAt)),
    [prospects],
  )
  const rdvCount = todayProspects.filter((prospect) => prospect.status === 'rdv').length
  const refusCount = todayProspects.filter((prospect) => prospect.status === 'refus').length
  const callbackCount = prospects.filter(
    (prospect) => prospect.status === 'callback' && prospect.callbackAt && isToday(prospect.callbackAt),
  ).length

  const myStat = stats.find((item) => item.userId === currentUser?.id) ?? stats[0]
  const myRate = Math.round(((myStat?.rdvCount ?? 0) / Math.max(myStat?.callsCount ?? 1, 1)) * 100)
  const revenueMonth = (myStat?.rdvCount ?? 0) * 450
  const soldVehicles = myStat?.rdvCount ?? 0
  const rdvCurrent = myStat?.rdvCount ?? 0

  const ranking = [...stats]
    .map((entry) => {
      const multiplier = range === 'today' ? 1 : range === 'week' ? 4 : 9
      return {
        ...entry,
        callsCount: entry.callsCount * multiplier,
        rdvCount: entry.rdvCount * multiplier,
      }
    })
    .sort((left, right) => right.rdvCount - left.rdvCount)
    .map((item, index) => ({
      ...item,
      user: users.find((user) => user.id === item.userId),
      rank: index + 1,
    }))

  const milestones = [
    { label: '🎯 Palier 1', target: 20, reward: '30€' },
    { label: '🎯 Palier 2', target: 40, reward: '60€' },
    { label: '🎯 Palier 3', target: 60, reward: '100€' },
    { label: '💰 Palier 4', target: 100, reward: '200€' },
  ]

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4"
      >
        <h2 className="text-xl font-semibold">Bonjour {currentUser?.name ?? 'Thymon'} 👋</h2>
        <p className="text-sm text-zinc-400">{formatLongDate(new Date())}</p>
      </motion.section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard title="Appels aujourd'hui" value={todayProspects.length} />
        <StatCard title="RDV pris" value={rdvCount} color="text-[#22C55E]" />
        <StatCard title="Refus" value={refusCount} color="text-[#EF4444]" />
        <StatCard title="À rappeler" value={callbackCount} color="text-[#F97316]" />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Mes stats</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <InlineStat label="Appels ce mois" value={myStat?.callsCount ?? 0} />
          <InlineStat label="Taux RDV %" value={`${myRate}%`} />
          <InlineStat label="Meilleur jour record" value="8 RDV" />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Primes</h3>
        <div className="mt-3 space-y-3">
          {milestones.map((milestone) => {
            const ratio = Math.min((rdvCurrent / milestone.target) * 100, 100)
            const remaining = Math.max(milestone.target - rdvCurrent, 0)
            return (
              <div key={milestone.label} className="rounded-xl bg-[#0F0F0F] p-3">
                <p className="text-sm">
                  {milestone.label}: {milestone.target} RDV → {milestone.reward}
                </p>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ratio}%` }}
                    transition={{ duration: 0.65 }}
                    className="h-full bg-[#FF6B35]"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-400">Plus que {remaining} RDV pour débloquer !</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Argent généré ce mois 🔥</h3>
        <p className="mt-2 text-4xl font-bold text-[#22C55E]">{revenueMonth.toLocaleString('fr-FR')}€</p>
        <p className="mt-1 text-sm text-zinc-400">{soldVehicles} véhicules vendus ce mois</p>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Top prospecteurs</h3>
          <div className="flex gap-1 rounded-xl border border-zinc-700 p-1 text-xs">
            <button
              type="button"
              onClick={() => setRange('today')}
              className={`rounded-lg px-2 py-1 ${range === 'today' ? 'bg-[#FF6B35]' : ''}`}
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => setRange('week')}
              className={`rounded-lg px-2 py-1 ${range === 'week' ? 'bg-[#FF6B35]' : ''}`}
            >
              Hebdo
            </button>
            <button
              type="button"
              onClick={() => setRange('month')}
              className={`rounded-lg px-2 py-1 ${range === 'month' ? 'bg-[#FF6B35]' : ''}`}
            >
              Mensuel
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {ranking.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#0F0F0F] p-3">
              <div className="flex items-center gap-2">
                <p>{item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}</p>
                <img src={item.user?.avatar} alt={item.user?.name} className="h-8 w-8 rounded-full object-cover" />
                <p>{item.user?.name}</p>
              </div>
              <p className="text-zinc-400">
                {item.callsCount} appels — {item.rdvCount} RDV
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const InlineStat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-xl bg-[#0F0F0F] p-2">
    <p className="text-xs text-zinc-500">{label}</p>
    <p className="mt-1 font-semibold">{value}</p>
  </div>
)
