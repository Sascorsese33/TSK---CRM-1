import { motion } from 'framer-motion'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export const LoginPage = () => {
  const { login } = useApp()
  const [email, setEmail] = useState('admin@transakpro.fr')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ok = await login(email, password)
    if (!ok) {
      setError('Email ou mot de passe invalide.')
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#0F0F0F] p-4">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#141414] p-6"
      >
        <h1 className="text-2xl font-semibold">
          Transak<span className="text-[#FF6B35]">Pro</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">Connexion CRM prospection auto</p>

        <div className="mt-6 space-y-3">
          <label className="block text-sm">
            <span className="text-zinc-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
            />
          </label>
          <label className="block text-sm">
            <span className="text-zinc-300">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
            />
          </label>
        </div>

        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

        <button type="submit" className="mt-5 min-h-11 w-full rounded-xl bg-[#FF6B35] font-medium">
          Se connecter
        </button>
      </motion.form>
    </div>
  )
}
