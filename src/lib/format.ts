import { format, formatDistanceToNowStrict, isSameDay, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatLongDate = (date: Date | string) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'EEEE d MMMM yyyy', { locale: fr })

export const formatHour = (date: string) => format(parseISO(date), 'HH:mm')

export const isToday = (date: string) => isSameDay(parseISO(date), new Date())

export const prettyDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remain = seconds % 60
  return `${minutes}m ${remain.toString().padStart(2, '0')}s`
}

export const since = (date: string) =>
  formatDistanceToNowStrict(parseISO(date), { addSuffix: true, locale: fr })
