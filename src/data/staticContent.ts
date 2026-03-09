import type { DeballeContent, Garage } from '../types'

export const defaultGarages: Garage[] = [
  {
    id: 'g1',
    name: 'Transakauto Eysines',
    address: '50 Av. René Antoune, 33200 Eysines',
    phone: '',
  },
  {
    id: 'g2',
    name: 'Transakauto Carbon Blanc',
    address: '3 Rue des Frères Lumières, 33560 Carbon Blanc',
    phone: '',
  },
  {
    id: 'g3',
    name: 'Transakauto Anglet',
    address: "14 rue de l'Industrie, 64600 Anglet",
    phone: '',
  },
  {
    id: 'g4',
    name: 'Transakauto Bidart',
    address: '70 rue de Bassilour, 64210 Bidart (Waze: Village Artisan de Bidart)',
    phone: '',
  },
  {
    id: 'g5',
    name: 'Transakauto Cap Breton',
    address: '153 Zone Artisanale du Housquit, 40530 Labenne',
    phone: '',
  },
]

export const defaultDeballeContent: DeballeContent = {
  pointsVerifier: [
    "Facture d'entretien",
    'Carrosserie en bon état global',
    'Courroie de distribution 10 ans / 80 000 KM',
  ],
  deballeSouple:
    "On a de la demande sur toutes les berlines de chez Peugeot à moins de 15 000€ en Diesel. On aimerait diffuser votre voiture dans les 250 agences en France.",
  deballeAgressive:
    "On a vendu une Peugeot 308 avant hier à l'agence, elle était comme vous en Diesel à moins de 15 000€. Nous avons diffusé la voiture dans toute nos agences et on avait reçu entre 10 et 15 appels. La voiture s'est très bien vendue donc nous en cherchons une autre à proposer à nos clients et la votre correspond totalement ! Est elle bien entretenue ?",
  conseilsProspection: [
    'Avoir le sourire au téléphone',
    'Rester toujours poli et professionnel',
    'Croire en ses arguments',
  ],
}
