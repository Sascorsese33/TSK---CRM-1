import { useApp } from '../context/AppContext'
import { prettyDuration } from '../lib/format'

export const TeamPage = () => {
  const { currentUser, users, calls, stats, prospects } = useApp()

  if (currentUser?.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4 text-sm text-zinc-300">
        Accès réservé aux admins / directeurs.
      </div>
    )
  }

  const totalCalls = calls.length
  const totalRdv = prospects.filter((prospect) => prospect.status === 'rdv').length
  const bestRate = Math.max(...stats.map((item) => Math.round((item.rdvCount / item.callsCount) * 100)))

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-2">
        <GlobalCard label="Total appels équipe" value={totalCalls} />
        <GlobalCard label="Total RDV" value={totalRdv} />
        <GlobalCard label="Best conversion rate" value={`${bestRate}%`} />
        <GlobalCard label="Revenue généré" value="31 200€" />
      </section>

      {users.map((user) => {
        const userCalls = calls.filter((call) => call.userId === user.id)
        const userStats = stats.find((item) => item.userId === user.id)
        return (
          <article key={user.id} className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full" />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-zinc-400">Rôle: {user.role}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <MiniStat label="Aujourd'hui" value={userStats?.callsCount ?? 0} />
              <MiniStat label="Cette semaine" value={(userStats?.callsCount ?? 0) * 2} />
              <MiniStat label="Ce mois" value={(userStats?.callsCount ?? 0) * 4} />
            </div>

            <p className="mt-3 text-sm text-zinc-300">
              Taux RDV: {Math.round(((userStats?.rdvCount ?? 0) / Math.max(userStats?.callsCount ?? 1, 1)) * 100)}%
            </p>

            <div className="mt-3 space-y-2">
              {userCalls.slice(0, 2).map((call) => (
                <div key={call.id} className="rounded-xl bg-[#0F0F0F] p-2">
                  <p className="text-xs text-zinc-400">{new Date(call.createdAt).toLocaleString('fr-FR')}</p>
                  <p className="text-sm text-zinc-300">{call.transcript}</p>
                  <p className="text-xs text-zinc-500">Durée: {prettyDuration(call.duration)}</p>
                  <audio controls className="mt-2 w-full">
                    <source src={call.recordingUrl} />
                  </audio>
                </div>
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}

const GlobalCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-3">
    <p className="text-xs text-zinc-400">{label}</p>
    <p className="mt-1 text-xl font-semibold">{value}</p>
  </div>
)

const MiniStat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-[#0F0F0F] p-2">
    <p className="text-xs text-zinc-400">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
)
