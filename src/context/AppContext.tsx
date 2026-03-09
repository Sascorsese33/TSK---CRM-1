/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { appointments as seedAppointments, calls as seedCalls, prospects as seedProspects, stats as seedStats, tips as seedTips, users as seedUsers } from '../data/mockData'
import { createGoogleCalendarAppointment, sendAppointmentReminderSms } from '../lib/integrations'
import type {
  Appointment,
  CallRecord,
  DailyStat,
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
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addProspect: (input: ProspectExtraction) => void
  updateProspectStatus: (prospectId: string, status: ProspectStatus, callbackAt?: string) => void
  updateProspectNotes: (prospectId: string, notes: string) => void
  scheduleAppointment: (prospectId: string, datetime: string, withSms: boolean) => Promise<void>
  updateTip: (tipId: string, content: Tip['content']) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users] = useState(seedUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(seedUsers[0])
  const [prospects, setProspects] = useState(seedProspects)
  const [calls] = useState(seedCalls)
  const [appointments, setAppointments] = useState(seedAppointments)
  const [tips, setTips] = useState(seedTips)
  const [stats] = useState(seedStats)

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
    if (!currentUser) {
      return
    }

    const next: Prospect = {
      id: crypto.randomUUID(),
      ...input,
      photoUrl:
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=700&fit=crop',
      lbcUrl: 'https://www.leboncoin.fr',
      status: 'ready',
      assignedTo: currentUser.id,
      createdAt: new Date().toISOString(),
      notes: 'Nouveau prospect ajouté manuellement.',
    }

    setProspects((prev) => [next, ...prev])
  }

  const updateProspectStatus = (prospectId: string, status: ProspectStatus, callbackAt?: string) => {
    setProspects((prev) =>
      prev.map((prospect) =>
        prospect.id === prospectId
          ? {
              ...prospect,
              status,
              callbackAt: status === 'callback' ? callbackAt : undefined,
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

  const scheduleAppointment = async (prospectId: string, datetime: string, withSms: boolean) => {
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
    })

    const createdAppointment: Appointment = {
      id: crypto.randomUUID(),
      prospectId,
      userId: currentUser.id,
      datetime,
      googleEventId: String(calendar.eventId),
      smsSent: false,
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

  const value: AppContextValue = {
    users,
    currentUser,
    prospects,
    calls,
    appointments,
    tips,
    stats,
    login,
    logout,
    addProspect,
    updateProspectStatus,
    updateProspectNotes,
    scheduleAppointment,
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
