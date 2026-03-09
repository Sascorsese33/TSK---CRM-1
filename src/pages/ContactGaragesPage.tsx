import { useState } from 'react'
import { useApp } from '../context/AppContext'

export const ContactGaragesPage = () => {
  const { garages, updateGarage, currentUser } = useApp()
  const [drafts, setDrafts] = useState<Record<string, { name: string; address: string; phone: string }>>({})

  const isAdmin = currentUser?.role === 'admin'

  return (
    <div className="space-y-3">
      {garages.map((garage) => {
        const draft = drafts[garage.id] ?? garage
        return (
          <article key={garage.id} className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
            {isAdmin ? (
              <div className="space-y-2">
                <FormInput
                  label="Garage"
                  value={draft.name}
                  onChange={(value) =>
                    setDrafts((prev) => ({ ...prev, [garage.id]: { ...draft, name: value } }))
                  }
                />
                <FormInput
                  label="Adresse complète"
                  value={draft.address}
                  onChange={(value) =>
                    setDrafts((prev) => ({ ...prev, [garage.id]: { ...draft, address: value } }))
                  }
                />
                <FormInput
                  label="Téléphone"
                  value={draft.phone}
                  onChange={(value) =>
                    setDrafts((prev) => ({ ...prev, [garage.id]: { ...draft, phone: value } }))
                  }
                />
                <button
                  type="button"
                  onClick={() => updateGarage(garage.id, draft)}
                  className="min-h-11 w-full rounded-xl bg-[#FF6B35] text-sm font-medium"
                >
                  Enregistrer (admin)
                </button>
              </div>
            ) : (
              <>
                <p className="font-semibold">{garage.name}</p>
                <p className="mt-1 text-sm text-zinc-300">{garage.address}</p>
                <p className="mt-1 text-sm text-zinc-400">Téléphone: {garage.phone || 'à renseigner'}</p>
              </>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={garage.phone ? `tel:${garage.phone}` : undefined}
                className={`grid min-h-11 place-items-center rounded-xl text-sm ${
                  garage.phone ? 'bg-[#22C55E] text-white' : 'border border-zinc-700 text-zinc-500'
                }`}
              >
                Appeler
              </a>
              <a
                href={`https://maps.apple.com/?q=${encodeURIComponent(garage.address)}`}
                target="_blank"
                rel="noreferrer"
                className="grid min-h-11 place-items-center rounded-xl border border-zinc-700 text-sm"
              >
                Itinéraire
              </a>
            </div>
          </article>
        )
      })}
    </div>
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
  <label className="block text-sm">
    <span className="text-zinc-400">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
    />
  </label>
)
