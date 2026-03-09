import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'

export const PerformancesPage = () => {
  const { stats, users, currentUser } = useApp()
  const [mode, setMode] = useState<'weekly' | 'monthly'>('weekly')
  const myStat = stats.find((item) => item.userId === currentUser?.id) ?? stats[0]
  const rdvCurrent = myStat?.rdvCount ?? 0

  const leaderboard = useMemo(
    () =>
      [...stats]
        .sort((left, right) => right.rdvCount - left.rdvCount)
        .map((item) => ({ ...item, user: users.find((user) => user.id === item.userId) })),
    [stats, users],
  )

  const milestones = [
    { label: 'Palier 1', target: 20, reward: '30€' },
    { label: 'Palier 2', target: 40, reward: '60€' },
    { label: 'Palier 3', target: 60, reward: '100€' },
    { label: 'Palier 4', target: 100, reward: '200€' },
  ]

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Mes stats</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <MetricCard label="Appels ce mois" value={myStat?.callsCount ?? 0} />
          <MetricCard
            label="Taux RDV"
            value={`${Math.round(((myStat?.rdvCount ?? 0) / Math.max(myStat?.callsCount ?? 1, 1)) * 100)}%`}
          />
          <MetricCard label="Meilleur jour" value="8 RDV" />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Primes</h3>
        <div className="mt-3 space-y-3">
          {milestones.map((milestone) => {
            const ratio = Math.min((rdvCurrent / milestone.target) * 100, 100)
            const remaining = Math.max(milestone.target - rdvCurrent, 0)
            const unlocked = remaining === 0
            return (
              <div key={milestone.label} className="rounded-xl bg-[#0F0F0F] p-3">
                <p className="text-sm">
                  🎯 {milestone.label}: {milestone.target} RDV → {milestone.reward} {unlocked ? '💰' : ''}
                </p>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ratio}%` }}
                    transition={{ duration: 0.7 }}
                    className="h-full bg-[#FF6B35]"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  {unlocked ? 'Palier débloqué !' : `Plus que ${remaining} RDV pour débloquer !`}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Leaderboard équipe</h3>
          <div className="flex gap-1 rounded-xl border border-zinc-700 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMode('weekly')}
              className={`rounded-lg px-2 py-1 ${mode === 'weekly' ? 'bg-[#FF6B35]' : ''}`}
            >
              Hebdo
            </button>
            <button
              type="button"
              onClick={() => setMode('monthly')}
              className={`rounded-lg px-2 py-1 ${mode === 'monthly' ? 'bg-[#FF6B35]' : ''}`}
            >
              Mensuel
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between rounded-xl bg-[#0F0F0F] p-3"
            >
              <div className="flex items-center gap-2">
                <span>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                <img src={entry.user?.avatar} alt={entry.user?.name} className="h-8 w-8 rounded-full" />
                <span>{entry.user?.name}</span>
              </div>
              <span className="text-sm text-zinc-400">{entry.rdvCount} RDV</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

const MetricCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-xl bg-[#0F0F0F] p-2">
    <p className="text-xs text-zinc-400">{label}</p>
    <p className="mt-1 text-base font-semibold">{value}</p>
  </div>
)
