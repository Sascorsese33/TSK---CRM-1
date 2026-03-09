import { AnimatePresence, motion } from 'framer-motion'
import { Camera, PencilLine } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { analyzeScreenshotWithClaude } from '../../lib/integrations'
import type { ProspectExtraction } from '../../types'

interface AddProspectModalProps {
  open: boolean
  onClose: () => void
}

const emptyForm: ProspectExtraction = {
  name: '',
  vehicle: '',
  price: 0,
  city: '',
  phone: '',
}

export const AddProspectModal = ({ open, onClose }: AddProspectModalProps) => {
  const [mode, setMode] = useState<'menu' | 'screenshot' | 'manual'>('menu')
  const [loading, setLoading] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [form, setForm] = useState<ProspectExtraction>(emptyForm)
  const { addProspect, addOrUpdateProspect } = useApp()

  const resetAndClose = () => {
    setMode('menu')
    setForm(emptyForm)
    setProcessedCount(0)
    onClose()
  }

  const submitForm = () => {
    if (!form.name || !form.vehicle || !form.city || !form.phone) {
      return
    }
    addProspect(form)
    resetAndClose()
  }

  const onFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }
    setLoading(true)
    try {
      const extractedItems = await Promise.all(
        Array.from(files).map((file) => analyzeScreenshotWithClaude(file)),
      )
      extractedItems.forEach((extracted) => addOrUpdateProspect(extracted))
      setProcessedCount(extractedItems.length)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 p-4"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="mx-auto mt-16 max-w-md rounded-3xl border border-zinc-700 bg-[#141414] p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Ajouter un prospect</h3>
            {mode === 'menu' ? (
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setMode('screenshot')}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-zinc-700 bg-[#1A1A1A] p-4"
                >
                  <Camera className="text-[#FF6B35]" />
                  <div className="text-left">
                    <p className="font-medium">Analyser un screenshot</p>
                    <p className="text-xs text-zinc-400">Claude Vision pré-remplit le formulaire</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('manual')}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-zinc-700 bg-[#1A1A1A] p-4"
                >
                  <PencilLine className="text-[#FF6B35]" />
                  <div className="text-left">
                    <p className="font-medium">Saisie manuelle</p>
                    <p className="text-xs text-zinc-400">Nom, véhicule, prix, ville, téléphone</p>
                  </div>
                </button>
              </div>
            ) : null}

            {mode === 'screenshot' ? (
              <div className="mt-4 space-y-3">
                <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-600 bg-[#1A1A1A] p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => onFileSelect(event.target.files)}
                  />
                  <span>{loading ? 'Analyse en cours...' : 'Choisir une ou plusieurs captures d’écran'}</span>
                </label>
                {processedCount > 0 ? (
                  <p className="rounded-xl bg-[#0F0F0F] p-2 text-xs text-zinc-300">
                    {processedCount} screenshot(s) analysé(s) et prospects créés/mis à jour.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => setMode('menu')}
                  className="min-h-11 w-full rounded-xl border border-zinc-700"
                >
                  Retour
                </button>
              </div>
            ) : null}

            {mode === 'manual' ? (
              <div className="mt-4 space-y-3">
                <FormInput
                  label="Nom"
                  value={form.name}
                  onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                />
                <FormInput
                  label="Véhicule"
                  value={form.vehicle}
                  onChange={(value) => setForm((prev) => ({ ...prev, vehicle: value }))}
                />
                <FormInput
                  label="Prix"
                  value={String(form.price || '')}
                  onChange={(value) => setForm((prev) => ({ ...prev, price: Number(value) || 0 }))}
                />
                <FormInput
                  label="Ville"
                  value={form.city ?? ''}
                  onChange={(value) => setForm((prev) => ({ ...prev, city: value }))}
                />
                <FormInput
                  label="Téléphone"
                  value={form.phone}
                  onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                />
                <button
                  type="button"
                  onClick={submitForm}
                  className="min-h-11 w-full rounded-xl bg-[#FF6B35] font-medium"
                >
                  Ajouter le prospect
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

const FormInput = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => (
  <label className="block space-y-1 text-sm">
    <span className="text-zinc-300">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
    />
  </label>
)
