import type { Appointment, CallRecord, DailyStat, Prospect, Tip, User } from '../types'

const now = new Date()

const isoOffset = (days: number, hours = 10) => {
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  date.setHours(hours, 0, 0, 0)
  return date.toISOString()
}

export const users: User[] = [
  {
    id: 'u1',
    name: 'Amine',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
  },
  {
    id: 'u2',
    name: 'Sofia',
    role: 'prospector',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
  },
  {
    id: 'u3',
    name: 'Yanis',
    role: 'prospector',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
  },
]

export const prospects: Prospect[] = [
  {
    id: 'p1',
    name: 'Karim B.',
    vehicle: 'Audi RS3 Sportback',
    price: 46990,
    city: 'Lyon',
    phone: '0601020304',
    photoUrl:
      'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'rdv',
    assignedTo: 'u2',
    createdAt: isoOffset(-2),
    notes: 'Très intéressé, financement déjà validé.',
  },
  {
    id: 'p2',
    name: 'Nadia T.',
    vehicle: 'Golf 7 GTD',
    price: 17900,
    city: 'Marseille',
    phone: '0601112233',
    photoUrl:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'callback',
    callbackAt: isoOffset(0, 16),
    assignedTo: 'u2',
    createdAt: isoOffset(-1),
    notes: 'Demande un rappel après 16h.',
  },
  {
    id: 'p3',
    name: 'Mehdi C.',
    vehicle: 'Fiat Doblo Cargo',
    price: 12400,
    city: 'Toulouse',
    phone: '0609988776',
    photoUrl:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'waiting',
    assignedTo: 'u3',
    createdAt: isoOffset(-1),
    notes: 'Attente du numéro via conversation LBC.',
  },
  {
    id: 'p4',
    name: 'Ines R.',
    vehicle: 'BMW Série 3 320d',
    price: 25500,
    city: 'Lille',
    phone: '0676767676',
    photoUrl:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'refus',
    assignedTo: 'u3',
    createdAt: isoOffset(-3),
    notes: 'Refus pour budget insuffisant.',
  },
  {
    id: 'p5',
    name: 'Paul D.',
    vehicle: 'Peugeot 308 GT',
    price: 20990,
    city: 'Nantes',
    phone: '0655001111',
    photoUrl:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'ready',
    assignedTo: 'u2',
    createdAt: isoOffset(0, 9),
    notes: 'Numéro obtenu ce matin.',
  },
  {
    id: 'p6',
    name: 'Lea M.',
    vehicle: 'Renault Clio V',
    price: 14990,
    city: 'Bordeaux',
    phone: '0671002200',
    photoUrl:
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'callback',
    callbackAt: isoOffset(0, 18),
    assignedTo: 'u1',
    createdAt: isoOffset(-2),
    notes: 'Souhaite comparer avec une autre offre.',
  },
  {
    id: 'p7',
    name: 'Rachid A.',
    vehicle: 'Mercedes Classe A',
    price: 28900,
    city: 'Paris',
    phone: '0603030303',
    photoUrl:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'rdv',
    assignedTo: 'u1',
    createdAt: isoOffset(-1),
    notes: 'RDV confirmé concession mardi.',
  },
  {
    id: 'p8',
    name: 'Clara E.',
    vehicle: 'Citroen C3',
    price: 10900,
    city: 'Nice',
    phone: '0604040404',
    photoUrl:
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'waiting',
    assignedTo: 'u2',
    createdAt: isoOffset(0, 11),
    notes: 'Conversation active mais sans numéro.',
  },
  {
    id: 'p9',
    name: 'Jules H.',
    vehicle: 'Volkswagen Tiguan',
    price: 33900,
    city: 'Strasbourg',
    phone: '0605050505',
    photoUrl:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'ready',
    assignedTo: 'u3',
    createdAt: isoOffset(-4),
    notes: 'Prêt à être appelé cet après-midi.',
  },
  {
    id: 'p10',
    name: 'Maya S.',
    vehicle: 'Tesla Model 3',
    price: 37900,
    city: 'Montpellier',
    phone: '0606060606',
    photoUrl:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=700&fit=crop',
    lbcUrl: 'https://www.leboncoin.fr',
    status: 'refus',
    assignedTo: 'u1',
    createdAt: isoOffset(-5),
    notes: 'A acheté un autre véhicule.',
  },
]

export const calls: CallRecord[] = [
  {
    id: 'c1',
    prospectId: 'p1',
    userId: 'u2',
    duration: 428,
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    transcript: 'Client confiant. RDV confirmé vendredi 14h.',
    createdAt: isoOffset(0, 10),
  },
  {
    id: 'c2',
    prospectId: 'p4',
    userId: 'u3',
    duration: 201,
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    transcript: 'Objection budget forte. Refus exprimé.',
    createdAt: isoOffset(-1, 13),
  },
  {
    id: 'c3',
    prospectId: 'p6',
    userId: 'u1',
    duration: 316,
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    transcript: 'À rappeler ce soir après comparaison.',
    createdAt: isoOffset(0, 9),
  },
  {
    id: 'c4',
    prospectId: 'p7',
    userId: 'u1',
    duration: 502,
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    transcript: 'RDV client et reprise véhicule évoquée.',
    createdAt: isoOffset(-1, 15),
  },
  {
    id: 'c5',
    prospectId: 'p9',
    userId: 'u3',
    duration: 255,
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    transcript: 'Numéro obtenu, appel de qualification OK.',
    createdAt: isoOffset(0, 11),
  },
]

export const appointments: Appointment[] = [
  {
    id: 'a1',
    prospectId: 'p1',
    userId: 'u2',
    datetime: isoOffset(1, 14),
    googleEventId: 'gcal_evt_1',
    smsSent: false,
  },
  {
    id: 'a2',
    prospectId: 'p7',
    userId: 'u1',
    datetime: isoOffset(2, 11),
    googleEventId: 'gcal_evt_2',
    smsSent: false,
  },
]

export const tips: Tip[] = [
  {
    id: 't1',
    vehicleType: 'Sportive',
    content: {
      pointsForts: ['Historique limpide', 'Performances premium', 'Entretien à jour'],
      objections: ['Consommation', 'Coût assurance'],
      script:
        'Mettez en avant le plaisir de conduite et la valeur de revente, puis rassurez sur la traçabilité.',
    },
    createdBy: 'u1',
  },
  {
    id: 't2',
    vehicleType: 'Utilitaire',
    content: {
      pointsForts: ['Volume de chargement', 'Fiabilité mécanique', 'TVA récupérable'],
      objections: ['Kilométrage', 'État carrosserie'],
      script:
        'Commencez par l’usage pro du client puis reliez chaque point fort à ses contraintes métier.',
    },
    createdBy: 'u1',
  },
]

export const stats: DailyStat[] = [
  { id: 's1', userId: 'u1', date: now.toISOString().slice(0, 10), callsCount: 12, rdvCount: 3 },
  { id: 's2', userId: 'u2', date: now.toISOString().slice(0, 10), callsCount: 19, rdvCount: 5 },
  { id: 's3', userId: 'u3', date: now.toISOString().slice(0, 10), callsCount: 15, rdvCount: 2 },
]
