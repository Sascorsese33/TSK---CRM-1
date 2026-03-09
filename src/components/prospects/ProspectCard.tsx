import { motion } from 'framer-motion'
import { EllipsisVertical, MessageSquare, Phone, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { statusColor, statusOrder } from '../../lib/status'
import type { Prospect, ProspectStatus } from '../../types'
import { StatusBadge } from '../ui/StatusBadge'

interface ProspectCardProps {
  prospect: Prospect
  isCalling: boolean
  onCall: (prospect: Prospect) => void
  onOpenTips: (prospect: Prospect) => void
  onOpenDetails: (prospect: Prospect) => void
  onStatusSwipe: (prospectId: string, nextStatus: ProspectStatus) => void
}

export const ProspectCard = ({
  prospect,
  isCalling,
  onCall,
  onOpenTips,
  onOpenDetails,
  onStatusSwipe,
}: ProspectCardProps) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX)
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) {
      return
    }
    const distance = touchStartX - event.changedTouches[0].clientX
    if (distance > 60) {
      const currentIndex = statusOrder.indexOf(prospect.status)
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
      onStatusSwipe(prospect.id, nextStatus)
    }
    setTouchStartX(null)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#1A1A1A]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${statusColor[prospect.status]}`} />
      <button
        type="button"
        onClick={() => onOpenDetails(prospect)}
        className="flex w-full gap-3 p-3 text-left"
      >
        <img
          src={prospect.photoUrl}
          alt={prospect.vehicle}
          className="h-20 w-24 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{prospect.name}</p>
          <p className="truncate text-sm text-zinc-300">{prospect.vehicle}</p>
          <p className="text-sm text-zinc-400">
            {prospect.price.toLocaleString('fr-FR')}€ • {prospect.city}
          </p>
          <div className="mt-2">
            <StatusBadge status={prospect.status} callbackAt={prospect.callbackAt} />
          </div>
          {prospect.specialTag ? (
            <p className="mt-1 text-xs font-medium text-[#F97316]">{prospect.specialTag}</p>
          ) : null}
        </div>
      </button>

      <div className="grid grid-cols-4 gap-2 border-t border-zinc-800 px-3 py-2">
        <IconButton
          icon={<Phone size={16} />}
          label="Appeler"
          onClick={() => onCall(prospect)}
          className={isCalling ? 'animate-pulse border-[#FF6B35] text-[#FF6B35]' : ''}
        />
        <IconButton
          icon={<MessageSquare size={16} />}
          label="LBC"
          onClick={() => window.open(prospect.lbcUrl, '_blank', 'noopener,noreferrer')}
        />
        <IconButton
          icon={<Sparkles size={16} />}
          label="Déballe"
          onClick={() => onOpenTips(prospect)}
        />
        <IconButton
          icon={<EllipsisVertical size={16} />}
          label="Options"
          onClick={() => onOpenDetails(prospect)}
        />
      </div>
    </motion.article>
  )
}

const IconButton = ({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  className?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex min-h-11 items-center justify-center gap-1 rounded-xl border border-zinc-700 text-xs text-zinc-200 transition hover:border-zinc-500 ${className ?? ''}`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
)
