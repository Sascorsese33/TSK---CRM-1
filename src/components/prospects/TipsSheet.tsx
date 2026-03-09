import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Prospect } from '../../types'

interface TipsSheetProps {
  prospect: Prospect | null
  open: boolean
  onClose: () => void
}

const getVehicleType = (vehicle: string) => {
  if (vehicle.toLowerCase().includes('rs3') || vehicle.toLowerCase().includes('bmw')) {
    return 'Sportive'
  }
  if (vehicle.toLowerCase().includes('doblo')) {
    return 'Utilitaire'
  }
  return 'Sportive'
}

export const TipsSheet = ({ prospect, open, onClose }: TipsSheetProps) => {
  const { tips, currentUser, updateTip } = useApp()
  const [draftScript, setDraftScript] = useState('')

  const tip = useMemo(() => {
    if (!prospect) {
      return null
    }
    const match = tips.find((item) => item.vehicleType === getVehicleType(prospect.vehicle))
    if (match) {
      return match
    }
    return tips[0]
  }, [prospect, tips])

  if (!tip) {
    return null
  }

  const saveScript = () => {
    updateTip(tip.id, { ...tip.content, script: draftScript || tip.content.script })
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-zinc-700 bg-[#141414] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Déballe pour les nuls</h3>
            <p className="mt-1 text-sm text-zinc-400">{prospect?.vehicle}</p>

            <section className="mt-4 rounded-2xl bg-[#1A1A1A] p-3">
              <h4 className="text-sm font-semibold">💡 Points forts à mentionner</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                {tip.content.pointsForts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mt-3 rounded-2xl bg-[#1A1A1A] p-3">
              <h4 className="text-sm font-semibold">⚠️ Objections fréquentes</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                {tip.content.objections.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mt-3 rounded-2xl bg-[#1A1A1A] p-3">
              <h4 className="text-sm font-semibold">📝 Script d'appel suggéré</h4>
              <p className="mt-2 text-sm text-zinc-300">{tip.content.script}</p>
            </section>

            {currentUser?.role === 'admin' ? (
              <div className="mt-4 space-y-2">
                <textarea
                  value={draftScript}
                  onChange={(event) => setDraftScript(event.target.value)}
                  placeholder="Modifier le script pour ce type de véhicule..."
                  className="min-h-24 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] p-3 text-sm"
                />
                <button
                  type="button"
                  onClick={saveScript}
                  className="min-h-11 w-full rounded-xl bg-[#FF6B35] font-medium text-white"
                >
                  Enregistrer (admin)
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
