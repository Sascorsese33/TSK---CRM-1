import { AnimatePresence, motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Prospect, ProspectStatus } from '../../types'
import { StatusBadge } from '../ui/StatusBadge'

interface ProspectDetailModalProps {
  prospect: Prospect | null
  open: boolean
  onClose: () => void
  onStatusChange: (prospect: Prospect, status: ProspectStatus, callbackAt?: string) => void
}

const statusChoices: { value: ProspectStatus; label: string; color: string }[] = [
  { value: 'rdv', label: 'RDV pris', color: 'bg-[#22C55E]' },
  { value: 'refus', label: 'Refus', color: 'bg-[#EF4444]' },
  { value: 'callback', label: 'À rappeler', color: 'bg-[#F97316]' },
  { value: 'ready', label: 'Numéro obtenu', color: 'bg-sky-500' },
  { value: 'waiting', label: 'En attente', color: 'bg-zinc-600' },
]

export const ProspectDetailModal = ({
  prospect,
  open,
  onClose,
  onStatusChange,
}: ProspectDetailModalProps) => {
  const { calls, updateProspectNotes, scheduleAppointment } = useApp()
  const [callbackAt, setCallbackAt] = useState('')
  const [rdvAt, setRdvAt] = useState('')
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [notes, setNotes] = useState(prospect?.notes ?? '')

  const prospectCalls = useMemo(
    () => calls.filter((call) => call.prospectId === prospect?.id),
    [calls, prospect?.id],
  )

  if (!prospect) {
    return null
  }

  const saveNotes = () => updateProspectNotes(prospect.id, notes)

  const handleStatusChange = (status: ProspectStatus) => {
    if (status === 'callback') {
      onStatusChange(
        prospect,
        status,
        callbackAt ? new Date(callbackAt).toISOString() : new Date().toISOString(),
      )
      return
    }
    onStatusChange(prospect, status)
  }

  const saveRdv = async () => {
    if (!rdvAt) {
      return
    }
    await scheduleAppointment(prospect.id, new Date(rdvAt).toISOString(), smsEnabled)
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 p-2"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 25, opacity: 0 }}
            className="mx-auto max-h-[95vh] max-w-xl overflow-y-auto rounded-3xl border border-zinc-700 bg-[#141414]"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={prospect.photoUrl} alt={prospect.vehicle} className="h-52 w-full object-cover" />
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-xl font-semibold">{prospect.name}</h3>
                <p className="text-sm text-zinc-300">{prospect.vehicle}</p>
                <p className="text-sm text-zinc-400">
                  {prospect.price.toLocaleString('fr-FR')}€ • {prospect.city}
                </p>
                <div className="mt-2">
                  <StatusBadge status={prospect.status} callbackAt={prospect.callbackAt} />
                </div>
              </div>

              <section className="rounded-2xl bg-[#1A1A1A] p-3">
                <h4 className="font-medium">Timeline interactions</h4>
                <ul className="mt-2 space-y-2 text-sm text-zinc-300">
                  {prospectCalls.length === 0 ? (
                    <li className="text-zinc-500">Aucun appel enregistré.</li>
                  ) : (
                    prospectCalls.map((call) => (
                      <li key={call.id} className="rounded-xl bg-[#0F0F0F] p-2">
                        <p>{new Date(call.createdAt).toLocaleString('fr-FR')}</p>
                        <p className="text-zinc-400">{call.transcript}</p>
                      </li>
                    ))
                  )}
                </ul>
              </section>

              <section className="rounded-2xl bg-[#1A1A1A] p-3">
                <h4 className="font-medium">Enregistrements d'appels</h4>
                <div className="mt-2 space-y-2">
                  {prospectCalls.map((call) => (
                    <div key={call.id} className="rounded-xl bg-[#0F0F0F] p-2">
                      <p className="text-xs text-zinc-400">
                        {new Date(call.createdAt).toLocaleString('fr-FR')}
                      </p>
                      <audio controls className="mt-2 w-full">
                        <source src={call.recordingUrl} />
                      </audio>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                        <PlayCircle size={14} />
                        <span>Lecture disponible</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-[#1A1A1A] p-3">
                <h4 className="font-medium">Notes (texte ou vocal)</h4>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-2 min-h-24 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] p-3 text-sm"
                />
                <button
                  type="button"
                  onClick={saveNotes}
                  className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700"
                >
                  Sauvegarder la note
                </button>
              </section>

              <section className="rounded-2xl bg-[#1A1A1A] p-3">
                <h4 className="font-medium">Sélecteur de statut</h4>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {statusChoices.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleStatusChange(status.value)}
                      className={`${status.color} min-h-11 rounded-xl px-2 text-sm font-medium`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="text-xs text-zinc-400">Si "À rappeler"</label>
                  <input
                    type="datetime-local"
                    value={callbackAt}
                    onChange={(event) => setCallbackAt(event.target.value)}
                    className="mt-1 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
                  />
                </div>
              </section>

              <section className="rounded-2xl bg-[#1A1A1A] p-3">
                <h4 className="font-medium">Programmer un RDV (Google Calendar)</h4>
                <input
                  type="datetime-local"
                  value={rdvAt}
                  onChange={(event) => setRdvAt(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
                />
                <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(event) => setSmsEnabled(event.target.checked)}
                  />
                  Envoyer un SMS de rappel la veille
                </label>
                <button
                  type="button"
                  onClick={saveRdv}
                  className="mt-2 min-h-11 w-full rounded-xl bg-[#FF6B35] font-medium"
                >
                  Créer le RDV et synchroniser
                </button>
              </section>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
