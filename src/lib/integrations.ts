import type { ProspectExtraction } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const callProspectWithTwilio = async (phone: string) => {
  if (import.meta.env.VITE_TWILIO_CALL_ENDPOINT) {
    const response = await fetch(import.meta.env.VITE_TWILIO_CALL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    if (!response.ok) {
      throw new Error('Impossible de lancer l’appel Twilio.')
    }
    return response.json()
  }

  await delay(500)
  return { success: true, mode: 'demo', phone }
}

export const createGoogleCalendarAppointment = async (payload: {
  prospectName: string
  vehicle: string
  price: number
  datetime: string
  location?: string
}) => {
  if (import.meta.env.VITE_GOOGLE_CALENDAR_ENDPOINT) {
    const response = await fetch(import.meta.env.VITE_GOOGLE_CALENDAR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error('Synchronisation Google Calendar échouée.')
    }
    return response.json()
  }

  await delay(450)
  return { eventId: `demo_evt_${crypto.randomUUID()}`, mode: 'demo' }
}

export const analyzeScreenshotWithClaude = async (file: File): Promise<ProspectExtraction> => {
  if (import.meta.env.VITE_CLAUDE_VISION_ENDPOINT) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(import.meta.env.VITE_CLAUDE_VISION_ENDPOINT, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Analyse screenshot indisponible.')
    }

    return response.json() as Promise<ProspectExtraction>
  }

  await delay(900)
  const seed = file.name.toLowerCase()
  return {
    name: seed.includes('karim') ? 'Karim B.' : 'Prospect extrait',
    vehicle: seed.includes('golf') ? 'Golf 7 GTD' : 'BMW Série 3',
    price: seed.includes('golf') ? 17900 : 25400,
    city: seed.includes('lyon') ? 'Lyon' : 'Paris',
    phone: '0600000000',
  }
}

export const sendAppointmentReminderSms = async (payload: {
  firstName: string
  vehicle: string
  phone: string
}) => {
  if (import.meta.env.VITE_TWILIO_SMS_ENDPOINT) {
    const response = await fetch(import.meta.env.VITE_TWILIO_SMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error('Envoi SMS échoué.')
    }
    return response.json()
  }

  await delay(350)
  return {
    success: true,
    message: `Bonjour ${payload.firstName}, petit rappel pour votre RDV demain concernant votre ${payload.vehicle}. À demain ! — TransakPro`,
    mode: 'demo',
  }
}
