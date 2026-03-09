import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import type { Prospect } from '../../types'

interface TipsSheetProps {
  prospect: Prospect | null
  open: boolean
  onClose: () => void
}

export const TipsSheet = ({ prospect, open, onClose }: TipsSheetProps) => {
  const { deballeContent } = useApp()
  if (!prospect) {
    return null
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
              <h4 className="text-sm font-semibold">📋 POINTS À VÉRIFIER :</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                {deballeContent.pointsVerifier.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mt-3 rounded-2xl bg-[#1A1A1A] p-3">
              <h4 className="text-sm font-semibold">💬 DÉBALLE SOUPLE :</h4>
              <p className="mt-2 text-sm text-zinc-300">"{deballeContent.deballeSouple}"</p>
            </section>

            <section className="mt-3 rounded-2xl bg-[#1A1A1A] p-3">
              <h4 className="text-sm font-semibold">🔥 DÉBALLE AGRESSIVE :</h4>
              <p className="mt-2 text-sm text-zinc-300">"{deballeContent.deballeAgressive}"</p>
            </section>

            <section className="mt-3 rounded-2xl bg-[#1A1A1A] p-3">
              <h4 className="text-sm font-semibold">💡 CONSEILS PROSPECTION :</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-300">
                {deballeContent.conseilsProspection.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
