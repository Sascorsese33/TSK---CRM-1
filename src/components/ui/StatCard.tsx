import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: number | string
  color?: string
}

export const StatCard = ({ title, value, color = 'text-white' }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
  >
    <p className="text-sm text-zinc-400">{title}</p>
    <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
  </motion.div>
)
