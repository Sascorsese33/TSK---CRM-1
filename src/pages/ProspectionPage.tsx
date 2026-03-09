import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AddProspectModal } from '../components/prospects/AddProspectModal'
import { ProspectCard } from '../components/prospects/ProspectCard'
import { ProspectDetailModal } from '../components/prospects/ProspectDetailModal'
import { TipsSheet } from '../components/prospects/TipsSheet'
import { useApp } from '../context/AppContext'
import { callProspectWithTwilio } from '../lib/integrations'
import type { Prospect } from '../types'

const dateToInput = (date: Date) => date.toISOString().slice(0, 10)

export const ProspectionPage = () => {
  const { prospects, updateProspectStatus } = useApp()
  const [selectedDate, setSelectedDate] = useState(dateToInput(new Date()))
  const [detailProspect, setDetailProspect] = useState<Prospect | null>(null)
  const [tipProspect, setTipProspect] = useState<Prospect | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [pulling, setPulling] = useState(false)
  const [callingProspectId, setCallingProspectId] = useState<string | null>(null)

  const dayProspects = useMemo(
    () =>
      prospects.filter(
        (prospect) => prospect.createdAt.slice(0, 10) === selectedDate || prospect.callbackAt?.slice(0, 10) === selectedDate,
      ),
    [prospects, selectedDate],
  )

  const shiftDate = (delta: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + delta)
    setSelectedDate(dateToInput(date))
  }

  const handleCall = async (prospect: Prospect) => {
    setCallingProspectId(prospect.id)
    try {
      await callProspectWithTwilio(prospect.phone)
    } finally {
      setCallingProspectId(null)
    }
  }

  const fakePullToRefresh = () => {
    setPulling(true)
    setTimeout(() => {
      setPulling(false)
      setRefreshKey((prev) => prev + 1)
    }, 600)
  }

  return (
    <div className="space-y-4" key={refreshKey}>
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-3">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Tableau journalier</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftDate(-1)}
            className="min-h-11 rounded-xl border border-zinc-700 px-3"
          >
            ←
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="min-h-11 flex-1 rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
          />
          <button
            type="button"
            onClick={() => shiftDate(1)}
            className="min-h-11 rounded-xl border border-zinc-700 px-3"
          >
            →
          </button>
        </div>
        <button
          type="button"
          onClick={fakePullToRefresh}
          className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 text-sm text-zinc-300"
        >
          {pulling ? 'Actualisation...' : 'Tirer pour rafraîchir'}
        </button>
      </section>

      <AnimatePresence>
        {dayProspects.map((prospect) => (
          <ProspectCard
            key={prospect.id}
            prospect={prospect}
            isCalling={callingProspectId === prospect.id}
            onCall={handleCall}
            onOpenDetails={setDetailProspect}
            onOpenTips={setTipProspect}
            onStatusSwipe={(prospectId, status) => updateProspectStatus(prospectId, status)}
          />
        ))}
      </AnimatePresence>

      {dayProspects.length === 0 ? (
        <p className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4 text-sm text-zinc-400">
          Aucun prospect pour cette date.
        </p>
      ) : null}

      <motion.button
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#FF6B35] shadow-[0_10px_30px_rgba(255,107,53,0.45)] md:bottom-8"
      >
        <Plus />
      </motion.button>

      <ProspectDetailModal
        key={detailProspect?.id ?? 'detail-empty'}
        open={Boolean(detailProspect)}
        prospect={detailProspect}
        onClose={() => setDetailProspect(null)}
      />
      <TipsSheet open={Boolean(tipProspect)} prospect={tipProspect} onClose={() => setTipProspect(null)} />
      <AddProspectModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}
