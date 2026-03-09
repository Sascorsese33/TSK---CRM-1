export type UserRole = 'admin' | 'prospector'

export type ProspectStatus = 'rdv' | 'refus' | 'callback' | 'ready' | 'waiting'

export interface User {
  id: string
  name: string
  role: UserRole
  avatar: string
}

export interface Prospect {
  id: string
  name: string
  vehicle: string
  price: number
  city: string
  phone: string
  photoUrl: string
  lbcUrl: string
  status: ProspectStatus
  callbackAt?: string
  assignedTo: string
  createdAt: string
  notes: string
}

export interface CallRecord {
  id: string
  prospectId: string
  userId: string
  duration: number
  recordingUrl: string
  transcript: string
  createdAt: string
}

export interface Appointment {
  id: string
  prospectId: string
  userId: string
  datetime: string
  googleEventId?: string
  smsSent: boolean
}

export interface Tip {
  id: string
  vehicleType: string
  content: {
    pointsForts: string[]
    objections: string[]
    script: string
  }
  createdBy: string
}

export interface DailyStat {
  id: string
  userId: string
  date: string
  callsCount: number
  rdvCount: number
}

export interface ProspectExtraction {
  name: string
  vehicle: string
  price: number
  city: string
  phone: string
}
