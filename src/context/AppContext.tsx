/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { appointments as seedAppointments, calls as seedCalls, prospects as seedProspects, stats as seedStats, tips as seedTips, users as seedUsers } from '../data/mockData'
import { defaultDeballeContent, defaultGarages } from '../data/staticContent'
import { createGoogleCalendarAppointment, sendAppointmentReminderSms } from '../lib/integrations'
import type {
  Appointment,
  AppointmentOutcome,
  CallRecord,
  DeballeContent,
  DailyStat,
  Garage,
  Prospect,
  ProspectExtraction,
  ProspectStatus,
  Tip,
  User,
} from '../types'

interface AppContextValue {
  users: User[]
  currentUser: User | null
  prospects: Prospect[]
  calls: CallRecord[]
  appointments: Appointment[]
  tips: Tip[]
  stats: DailyStat[]
  garages: Garage[]
  deballeContent: DeballeContent
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addProspect: (input: ProspectExtraction) => void
  addOrUpdateProspect: (input: ProspectExtraction) => void
  updateProspectStatus: (
    prospectId: string,
    status: ProspectStatus,
    callbackAt?: string,
    specialTag?: string,
  ) => void
  updateProspectNotes: (prospectId: string, notes: string) => void
  scheduleAppointment: (
    prospectId: string,
    datetime: string,
    withSms: boolean,
    location?: string,
  ) => Promise<void>
  updateAppointmentOutcome: (appointmentId: string, outcome: AppointmentOutcome) => void
  scheduleNoShowCallback: (appointmentId: string, callbackAt: string) => void
  toggleTrainingCall: (callId: string) => void
  updateGarage: (garageId: string, input: Pick<Garage, 'name' | 'address' | 'phone'>) => void
  updateDeballeContent: (input: DeballeContent) => void
  updateTip: (tipId: string, content: Tip['content']) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users] = useState(seedUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(seedUsers[0])
  const [prospects, setProspects] = useState(seedProspects)
  const [calls, setCalls] = useState(seedCalls)
  const [appointments, setAppointments] = useState(seedAppointments)
  const [tips, setTips] = useState(seedTips)
  const [stats] = useState(seedStats)
  const [garages, setGarages] = useState(defaultGarages)
  const [deballeContent, setDeballeContent] = useState(defaultDeballeContent)

  const login = async (email: string, password: string) => {
    if (!password) {
      return false
    }
    const isAdmin = email.toLowerCase().includes('admin')
    const match = users.find((user) => (isAdmin ? user.role === 'admin' : user.role === 'prospector'))
    setCurrentUser(match ?? null)
    return Boolean(match)
  }

  const logout = () => setCurrentUser(null)

  const addProspect = (input: ProspectExtraction) => {
    addOrUpdateProspect(input)
  }

  const addOrUpdateProspect = (input: ProspectExtraction) => {
    if (!currentUser) {
      return
    }

    const city = input.city || 'Non renseignée'
    setProspects((prev) => {
      const existingByPhone = prev.find((prospect) => prospect.phone === input.phone)
      const existingByIdentity = prev.find(
        (prospect) =>
          prospect.name.toLowerCase() === input.name.toLowerCase() &&
          prospect.vehicle.toLowerCase() === input.vehicle.toLowerCase(),
      )
      const existing = existingByPhone ?? existingByIdentity

      if (existing) {
        return prev.map((prospect) =>
          prospect.id === existing.id
            ? {
                ...prospect,
                name: input.name || prospect.name,
                vehicle: input.vehicle || prospect.vehicle,
                price: input.price || prospect.price,
                phone: input.phone || prospect.phone,
                city,
              }
            : prospect,
        )
      }

      const next: Prospect = {
        id: crypto.randomUUID(),
        ...input,
        city,
        photoUrl:
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=700&fit=crop',
        lbcUrl: 'https://www.leboncoin.fr',
        status: 'ready',
        assignedTo: currentUser.id,
        createdAt: new Date().toISOString(),
        notes: 'Nouveau prospect ajouté manuellement.',
      }

      return [next, ...prev]
    })
  }

  const updateProspectStatus = (
    prospectId: string,
    status: ProspectStatus,
    callbackAt?: string,
    specialTag?: string,
  ) => {
    setProspects((prev) =>
      prev.map((prospect) =>
        prospect.id === prospectId
          ? {
              ...prospect,
              status,
              callbackAt: status === 'callback' ? callbackAt : undefined,
              specialTag,
            }
          : prospect,
      ),
    )
  }

  const updateProspectNotes = (prospectId: string, notes: string) => {
    setProspects((prev) =>
      prev.map((prospect) => (prospect.id === prospectId ? { ...prospect, notes } : prospect)),
    )
  }

  const scheduleAppointment = async (
    prospectId: string,
    datetime: string,
    withSms: boolean,
    location?: string,
  ) => {
    if (!currentUser) {
      return
    }

    const prospect = prospects.find((item) => item.id === prospectId)
    if (!prospect) {
      return
    }

    const calendar = await createGoogleCalendarAppointment({
      prospectName: prospect.name,
      vehicle: prospect.vehicle,
      price: prospect.price,
      datetime,
      location,
    })

    const createdAppointment: Appointment = {
      id: crypto.randomUUID(),
      prospectId,
      userId: currentUser.id,
      datetime,
      googleEventId: String(calendar.eventId),
      smsSent: false,
      outcome: 'confirmed',
    }

    setAppointments((prev) => [createdAppointment, ...prev])
    updateProspectStatus(prospectId, 'rdv')

    if (withSms) {
      await sendAppointmentReminderSms({
        firstName: prospect.name.split(' ')[0],
        vehicle: prospect.vehicle,
        phone: prospect.phone,
      })

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === createdAppointment.id
            ? { ...appointment, smsSent: true }
            : appointment,
        ),
      )
    }
  }

  const updateTip = (tipId: string, content: Tip['content']) => {
    setTips((prev) => prev.map((tip) => (tip.id === tipId ? { ...tip, content } : tip)))
  }

  const updateAppointmentOutcome = (appointmentId: string, outcome: AppointmentOutcome) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, outcome } : appointment,
      ),
    )
  }

  const scheduleNoShowCallback = (appointmentId: string, callbackAt: string) => {
    const appointment = appointments.find((item) => item.id === appointmentId)
    if (!appointment) {
      return
    }

    updateProspectStatus(appointment.prospectId, 'callback', callbackAt, 'Pas venu — à rappeler')
    updateAppointmentOutcome(appointmentId, 'no_show')
  }

  const toggleTrainingCall = (callId: string) => {
    setCalls((prev) =>
      prev.map((call) => (call.id === callId ? { ...call, isTraining: !call.isTraining } : call)),
    )
  }

  const updateGarage = (garageId: string, input: Pick<Garage, 'name' | 'address' | 'phone'>) => {
    setGarages((prev) =>
      prev.map((garage) => (garage.id === garageId ? { ...garage, ...input } : garage)),
    )
  }

  const updateDeballeContent = (input: DeballeContent) => {
    setDeballeContent(input)
  }

  const value: AppContextValue = {
    users,
    currentUser,
    prospects,
    calls,
    appointments,
    tips,
    stats,
    garages,
    deballeContent,
    login,
    logout,
    addProspect,
    addOrUpdateProspect,
    updateProspectStatus,
    updateProspectNotes,
    scheduleAppointment,
    updateAppointmentOutcome,
    scheduleNoShowCallback,
    toggleTrainingCall,
    updateGarage,
    updateDeballeContent,
    updateTip,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used inside AppProvider')
  }
  return context
}
