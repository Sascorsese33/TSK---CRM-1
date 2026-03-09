import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { callProspectWithTwilio } from '../lib/integrations'
import { hasCallablePhoneStatus } from '../lib/status'

type SortMode = 'recent' | 'city'

export const CallsPage = () => {
  const { prospects } = useApp()
  const [sortMode, setSortMode] = useState<SortMode>('recent')
  const [callingId, setCallingId] = useState<string | null>(null)

  const callableProspects = useMemo(() => {
    const base = prospects.filter(
      (prospect) => Boolean(prospect.phone) && hasCallablePhoneStatus(prospect.status),
    )
    if (sortMode === 'city') {
      return [...base].sort((left, right) => left.city.localeCompare(right.city))
    }
    return [...base].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
  }, [prospects, sortMode])

  const onCall = async (id: string, phone: string) => {
    setCallingId(id)
    try {
      await callProspectWithTwilio(phone)
    } finally {
      setCallingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSortMode('recent')}
            className={`min-h-11 rounded-xl text-sm ${sortMode === 'recent' ? 'bg-[#FF6B35]' : 'border border-zinc-700'}`}
          >
            Récents
          </button>
          <button
            type="button"
            onClick={() => setSortMode('city')}
            className={`min-h-11 rounded-xl text-sm ${sortMode === 'city' ? 'bg-[#FF6B35]' : 'border border-zinc-700'}`}
          >
            Par ville
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#1A1A1A]">
        {callableProspects.map((prospect, index) => (
          <motion.article
            key={prospect.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex min-h-14 items-center gap-3 px-3 ${index !== callableProspects.length - 1 ? 'border-b border-zinc-800' : ''}`}
          >
            <button
              type="button"
              onClick={() => window.open(prospect.lbcUrl, '_blank', 'noopener,noreferrer')}
              className="rounded-lg"
            >
              <img src={prospect.photoUrl} alt={prospect.vehicle} className="h-10 w-10 rounded-lg object-cover" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{prospect.vehicle}</p>
              <p className="truncate text-xs text-zinc-400">{prospect.city}</p>
            </div>
            <button
              type="button"
              onClick={() => onCall(prospect.id, prospect.phone)}
              className={`min-h-11 rounded-full px-4 text-sm font-medium ${
                callingId === prospect.id ? 'animate-pulse bg-[#22C55E]/40' : 'bg-[#22C55E]'
              }`}
            >
              Appeler
            </button>
          </motion.article>
        ))}
      </section>

      {callableProspects.length === 0 ? (
        <p className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4 text-sm text-zinc-500">
          Aucun prospect appelable pour l’instant.
        </p>
      ) : null}
    </div>
  )
}
