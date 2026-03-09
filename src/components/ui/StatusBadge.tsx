import clsx from 'clsx'
import { statusColor, statusEmoji, statusLabel } from '../../lib/status'
import type { ProspectStatus } from '../../types'

interface StatusBadgeProps {
  status: ProspectStatus
  callbackAt?: string
}

export const StatusBadge = ({ status, callbackAt }: StatusBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white',
      statusColor[status],
    )}
  >
    <span>{statusEmoji[status]}</span>
    <span>{statusLabel[status]}</span>
    {status === 'callback' && callbackAt ? <span>{new Date(callbackAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span> : null}
  </span>
)
