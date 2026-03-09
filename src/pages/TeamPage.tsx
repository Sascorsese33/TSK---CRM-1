import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { prettyDuration } from '../lib/format'

export const TeamPage = () => {
  const {
    currentUser,
    users,
    calls,
    stats,
    prospects,
    appointments,
    toggleTrainingCall,
    deballeContent,
    updateDeballeContent,
    garages,
    updateGarage,
  } = useApp()
  const [openUserId, setOpenUserId] = useState<string | null>(users[0]?.id ?? null)
  const [deballeDraft, setDeballeDraft] = useState({
    souple: deballeContent.deballeSouple,
    agressive: deballeContent.deballeAgressive,
  })

  if (currentUser?.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4 text-sm text-zinc-300">
        Accès réservé aux admins / directeurs.
      </div>
    )
  }

  const totalCalls = calls.length
  const totalRdv = appointments.filter((appointment) => appointment.outcome === 'confirmed').length
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
        const userProspects = prospects.filter((prospect) => prospect.assignedTo === user.id)
        const rdvPris = userProspects.filter((prospect) => prospect.status === 'rdv').length
        const aRappeler = userProspects.filter((prospect) => prospect.status === 'callback').length
        const pasPris = userProspects.filter((prospect) => prospect.status === 'refus').length
        const evolutionData = Array.from({ length: 5 }).map((_, index) => ({
          x: index,
          y: (userStats?.rdvCount ?? 1) + index * (index % 2 === 0 ? 1 : -1) + 2,
        }))
        return (
          <article key={user.id} className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
            <button
              type="button"
              onClick={() => setOpenUserId((prev) => (prev === user.id ? null : user.id))}
              className="flex min-h-11 w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full" />
                <div className="text-left">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-zinc-400">Rôle: {user.role}</p>
                </div>
              </div>
              <span className="text-xs text-zinc-500">{openUserId === user.id ? 'Masquer' : 'Voir'}</span>
            </button>

            {openUserId === user.id ? (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <MiniStat label="Aujourd'hui" value={userStats?.callsCount ?? 0} />
                  <MiniStat label="Cette semaine" value={(userStats?.callsCount ?? 0) * 2} />
                  <MiniStat label="Ce mois" value={(userStats?.callsCount ?? 0) * 4} />
                </div>
                <p className="text-sm text-zinc-300">
                  Taux de conversion %:{' '}
                  {Math.round(((userStats?.rdvCount ?? 0) / Math.max(userStats?.callsCount ?? 1, 1)) * 100)}%
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <MiniColorStat label="RDV pris" value={rdvPris} color="text-[#22C55E]" />
                  <MiniColorStat label="À rappeler" value={aRappeler} color="text-[#F97316]" />
                  <MiniColorStat label="Pas pris" value={pasPris} color="text-[#EF4444]" />
                </div>
                <MonthlyChart points={evolutionData} />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Réécouter derniers appels</p>
                  {userCalls.slice(0, 3).map((call) => (
                    <div key={call.id} className="rounded-xl bg-[#0F0F0F] p-2">
                      <p className="text-xs text-zinc-400">{new Date(call.createdAt).toLocaleString('fr-FR')}</p>
                      <p className="text-sm text-zinc-300">{call.transcript}</p>
                      <p className="text-xs text-zinc-500">Durée: {prettyDuration(call.duration)}</p>
                      <audio controls className="mt-2 w-full">
                        <source src={call.recordingUrl} />
                      </audio>
                      <button
                        type="button"
                        onClick={() => toggleTrainingCall(call.id)}
                        className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 text-xs"
                      >
                        {call.isTraining ? 'Retirer des appels formation' : 'Ajouter aux appels formation'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        )
      })}

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Modifier Déballe pour les nuls (admin)</h3>
        <textarea
          value={deballeDraft.souple}
          onChange={(event) => setDeballeDraft((prev) => ({ ...prev, souple: event.target.value }))}
          className="mt-3 min-h-24 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] p-3 text-sm"
        />
        <textarea
          value={deballeDraft.agressive}
          onChange={(event) => setDeballeDraft((prev) => ({ ...prev, agressive: event.target.value }))}
          className="mt-2 min-h-24 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] p-3 text-sm"
        />
        <button
          type="button"
          onClick={() =>
            updateDeballeContent({
              ...deballeContent,
              deballeSouple: deballeDraft.souple,
              deballeAgressive: deballeDraft.agressive,
            })
          }
          className="mt-2 min-h-11 w-full rounded-xl bg-[#FF6B35] font-medium"
        >
          Enregistrer les déballes
        </button>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Éditer les adresses garages (admin)</h3>
        <div className="mt-3 space-y-2">
          {garages.map((garage) => (
            <GarageEditor key={garage.id} name={garage.name} address={garage.address} phone={garage.phone} onSave={(input) => updateGarage(garage.id, input)} />
          ))}
        </div>
      </section>
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

const MiniColorStat = ({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) => (
  <div className="rounded-xl bg-[#0F0F0F] p-2">
    <p className="text-xs text-zinc-400">{label}</p>
    <p className={`font-semibold ${color}`}>{value}</p>
  </div>
)

const MonthlyChart = ({ points }: { points: { x: number; y: number }[] }) => {
  const max = Math.max(...points.map((point) => point.y), 1)
  const min = Math.min(...points.map((point) => point.y), 0)
  const normalized = useMemo(
    () =>
      points
        .map((point, index) => {
          const x = (index / Math.max(points.length - 1, 1)) * 100
          const y = 100 - ((point.y - min) / Math.max(max - min, 1)) * 100
          return `${x},${y}`
        })
        .join(' '),
    [points, max, min],
  )

  return (
    <div className="rounded-xl bg-[#0F0F0F] p-2">
      <p className="text-xs text-zinc-400">Évolution mensuelle</p>
      <svg viewBox="0 0 100 100" className="mt-2 h-20 w-full">
        <polyline fill="none" stroke="#FF6B35" strokeWidth="3" points={normalized} />
      </svg>
    </div>
  )
}

const GarageEditor = ({
  name,
  address,
  phone,
  onSave,
}: {
  name: string
  address: string
  phone: string
  onSave: (input: { name: string; address: string; phone: string }) => void
}) => {
  const [draft, setDraft] = useState({ name, address, phone })
  return (
    <div className="rounded-xl bg-[#0F0F0F] p-2">
      <input
        value={draft.name}
        onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
        className="min-h-11 w-full rounded-xl border border-zinc-700 bg-transparent px-3 text-sm"
      />
      <input
        value={draft.address}
        onChange={(event) => setDraft((prev) => ({ ...prev, address: event.target.value }))}
        className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 bg-transparent px-3 text-sm"
      />
      <input
        value={draft.phone}
        onChange={(event) => setDraft((prev) => ({ ...prev, phone: event.target.value }))}
        placeholder="Téléphone"
        className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 bg-transparent px-3 text-sm"
      />
      <button
        type="button"
        onClick={() => onSave(draft)}
        className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 text-sm"
      >
        Sauvegarder
      </button>
    </div>
  )
}
