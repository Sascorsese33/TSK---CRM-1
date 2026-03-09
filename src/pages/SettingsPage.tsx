import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { isSupabaseConfigured } from '../lib/supabase'

const envKeys = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_TWILIO_CALL_ENDPOINT',
  'VITE_TWILIO_SMS_ENDPOINT',
  'VITE_GOOGLE_CALENDAR_ENDPOINT',
  'VITE_CLAUDE_VISION_ENDPOINT',
]

export const SettingsPage = () => {
  const { currentUser } = useApp()

  const envState = useMemo(
    () =>
      envKeys.map((key) => ({
        key,
        enabled: Boolean(import.meta.env[key]),
      })),
    [],
  )

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Compte</h3>
        <p className="mt-2 text-sm text-zinc-300">Utilisateur: {currentUser?.name}</p>
        <p className="text-sm text-zinc-400">Rôle: {currentUser?.role}</p>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">Intégrations</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="rounded-xl bg-[#0F0F0F] p-2">
            Supabase: {isSupabaseConfigured ? '✅ connecté' : '⚠️ mode démo'}
          </li>
          {envState.map((item) => (
            <li key={item.key} className="rounded-xl bg-[#0F0F0F] p-2">
              {item.key}: {item.enabled ? '✅ configuré' : '⚠️ non défini'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
