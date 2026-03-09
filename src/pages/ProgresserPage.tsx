import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { prettyDuration } from '../lib/format'

type DeballeTab = 'souple' | 'agressive' | 'conseils'

export const ProgresserPage = () => {
  const { calls, currentUser, prospects, deballeContent } = useApp()
  const [tab, setTab] = useState<DeballeTab>('souple')
  const [openFaq, setOpenFaq] = useState<string | null>('sell')

  const myCalls = useMemo(
    () => calls.filter((call) => call.userId === currentUser?.id),
    [calls, currentUser?.id],
  )
  const trainingCalls = useMemo(() => calls.filter((call) => call.isTraining), [calls])

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Réécouter mes appels</h3>
        <div className="mt-3 space-y-2">
          {myCalls.map((call) => {
            const prospect = prospects.find((item) => item.id === call.prospectId)
            return (
              <article key={call.id} className="rounded-xl bg-[#0F0F0F] p-3">
                <p className="font-medium">
                  {prospect?.name} — {prospect?.vehicle}
                </p>
                <p className="text-xs text-zinc-400">
                  {new Date(call.createdAt).toLocaleString('fr-FR')} • {prettyDuration(call.duration)}
                </p>
                <audio controls className="mt-2 w-full">
                  <source src={call.recordingUrl} />
                </audio>
                <p className="mt-2 text-sm text-zinc-300">{call.transcript}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">⭐ Sélectionnés par l'Admin</h3>
        <div className="mt-3 space-y-2">
          {trainingCalls.map((call) => {
            const prospect = prospects.find((item) => item.id === call.prospectId)
            return (
              <article key={call.id} className="rounded-xl bg-[#0F0F0F] p-3">
                <p className="font-medium">
                  {prospect?.name} — {prospect?.vehicle}
                </p>
                <p className="text-xs text-zinc-400">{prettyDuration(call.duration)}</p>
                <audio controls className="mt-2 w-full">
                  <source src={call.recordingUrl} />
                </audio>
                <p className="mt-2 text-sm text-zinc-300">{call.transcript}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Déballes écrites</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <TabButton active={tab === 'souple'} onClick={() => setTab('souple')}>
            Souple
          </TabButton>
          <TabButton active={tab === 'agressive'} onClick={() => setTab('agressive')}>
            Agressive
          </TabButton>
          <TabButton active={tab === 'conseils'} onClick={() => setTab('conseils')}>
            Conseils
          </TabButton>
        </div>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl bg-[#0F0F0F] p-3 text-sm text-zinc-200"
        >
          {tab === 'souple' ? deballeContent.deballeSouple : null}
          {tab === 'agressive' ? deballeContent.deballeAgressive : null}
          {tab === 'conseils' ? (
            <ul className="list-disc pl-5">
              {deballeContent.conseilsProspection.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </motion.div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Connaître les voitures</h3>
        <div className="mt-3 space-y-2">
          <FaqItem
            open={openFaq === 'sell'}
            question="❓ Ce qui se vend le mieux ?"
            answer="Les berlines pas chères restent très demandées, notamment les Peugeot, Renault et Citroën diesel sous 15 000€. Les véhicules sportifs type GTI, RS, ST ont aussi une forte demande. Enfin les 7 places familiaux comme Scenic, 5008, Zafira partent très vite."
            onToggle={() => setOpenFaq((prev) => (prev === 'sell' ? null : 'sell'))}
          />
          <FaqItem
            open={openFaq === 'engine'}
            question="❓ Quels sont les moteurs à problème ?"
            answer="Les moteurs PureTech de chez Peugeot et Citroën (1.0, 1.2 essence) sont connus pour des problèmes de courroie de distribution et de consommation d'huile. Il faut toujours vérifier l'entretien complet au téléphone avec le client et s'assurer que la courroie de distribution a bien été faite."
            onToggle={() => setOpenFaq((prev) => (prev === 'engine' ? null : 'engine'))}
          />
        </div>
      </section>
    </div>
  )
}

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-11 rounded-xl ${active ? 'bg-[#FF6B35]' : 'border border-zinc-700 text-zinc-300'}`}
  >
    {children}
  </button>
)

const FaqItem = ({
  open,
  question,
  answer,
  onToggle,
}: {
  open: boolean
  question: string
  answer: string
  onToggle: () => void
}) => (
  <article className="rounded-xl bg-[#0F0F0F]">
    <button type="button" onClick={onToggle} className="flex min-h-11 w-full items-center justify-between px-3">
      <span className="text-left text-sm">{question}</span>
      <ChevronDown size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
    </button>
    {open ? <p className="px-3 pb-3 text-sm text-zinc-300">{answer}</p> : null}
  </article>
)
