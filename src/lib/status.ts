import type { ProspectStatus } from '../types'

export const statusLabel: Record<ProspectStatus, string> = {
  rdv: 'RDV pris',
  refus: 'Refus',
  callback: 'À rappeler',
  ready: 'Numéro obtenu',
  waiting: 'En attente',
}

export const statusEmoji: Record<ProspectStatus, string> = {
  rdv: '🟢',
  refus: '🔴',
  callback: '🟠',
  ready: '🔵',
  waiting: '⚪',
}

export const statusColor: Record<ProspectStatus, string> = {
  rdv: 'bg-[#22C55E]',
  refus: 'bg-[#EF4444]',
  callback: 'bg-[#F97316]',
  ready: 'bg-sky-500',
  waiting: 'bg-zinc-500',
}

export const statusOrder: ProspectStatus[] = ['rdv', 'callback', 'ready', 'waiting', 'refus']
