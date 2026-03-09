import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Prospect } from '../../types'

interface RdvConfirmationModalProps {
  open: boolean
  prospect: Prospect | null
  onClose: () => void
}

const toDateTimeInput = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}`
}

export const RdvConfirmationModal = ({ open, prospect, onClose }: RdvConfirmationModalProps) => {
  const { garages, currentUser, scheduleAppointment } = useApp()
  const [dateTime, setDateTime] = useState(toDateTimeInput(new Date()))
  const [garageId, setGarageId] = useState(garages[0]?.id ?? '')
  const [copied, setCopied] = useState(false)

  const selectedGarage = garages.find((garage) => garage.id === garageId) ?? garages[0]
  const formattedDate = useMemo(
    () => new Date(dateTime).toLocaleDateString('fr-FR'),
    [dateTime],
  )
  const formattedHour = useMemo(
    () => new Date(dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    [dateTime],
  )

  const message = useMemo(
    () =>
      `Bonjour, suite à notre échange notre rendez vous est à ${formattedHour} le ${formattedDate} au garage Transakauto :

${selectedGarage?.address ?? ''}

Pensez à prévoir les factures d'entretiens et la carte grise de la voiture. Le top serait que le véhicule soit un minimum propre car nous seront amenés à prendre une trentaines de photos.

En vous souhaitant une agréable fin de journée.

${currentUser?.name ?? ''}
Transakauto`,
    [formattedHour, formattedDate, selectedGarage?.address, currentUser?.name],
  )

  if (!prospect) {
    return null
  }

  const onCopy = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const onSms = () => {
    const encoded = encodeURIComponent(message)
    window.location.href = `sms:${prospect.phone}&body=${encoded}`
  }

  const onConfirm = async () => {
    await scheduleAppointment(prospect.id, new Date(dateTime).toISOString(), false, selectedGarage?.address)
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 25, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="mx-auto mt-10 max-h-[90vh] max-w-lg overflow-y-auto rounded-3xl border border-zinc-700 bg-[#141414] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Confirmation RDV — {prospect.name}</h3>
            <div className="mt-3 space-y-3">
              <label className="block text-sm">
                <span className="text-zinc-400">Date / heure du RDV</span>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(event) => setDateTime(event.target.value)}
                  className="mt-1 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
                />
              </label>

              <label className="block text-sm">
                <span className="text-zinc-400">Garage</span>
                <select
                  value={garageId}
                  onChange={(event) => setGarageId(event.target.value)}
                  className="mt-1 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
                >
                  {garages.map((garage) => (
                    <option key={garage.id} value={garage.id}>
                      {garage.name} — {garage.address}
                    </option>
                  ))}
                </select>
              </label>

              <textarea
                value={message}
                readOnly
                className="min-h-72 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] p-3 text-sm text-zinc-200"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="min-h-11 rounded-xl border border-zinc-700 text-sm"
                >
                  {copied ? 'Copié !' : 'Copier le message'}
                </button>
                <button
                  type="button"
                  onClick={onSms}
                  className="min-h-11 rounded-xl bg-[#22C55E] text-sm font-medium"
                >
                  Envoyer par SMS
                </button>
              </div>
              <button
                type="button"
                onClick={onConfirm}
                className="min-h-11 w-full rounded-xl bg-[#FF6B35] font-medium"
              >
                Valider le RDV
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
