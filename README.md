# TransakPro CRM (PWA)

Application CRM mobile-first en français pour la prospection automobile.

## Stack

- React + TypeScript + Tailwind CSS
- Framer Motion
- Supabase (client prêt à brancher)
- Twilio (appel/SMS via endpoints)
- Google Calendar API (via endpoint serveur)
- Claude Vision (analyse screenshot via endpoint serveur)
- PWA (vite-plugin-pwa)

## Démarrage local

```bash
npm install
npm run dev
```

## Variables d'environnement

Copier `.env.example` vers `.env` puis compléter :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TWILIO_CALL_ENDPOINT`
- `VITE_TWILIO_SMS_ENDPOINT`
- `VITE_GOOGLE_CALENDAR_ENDPOINT`
- `VITE_CLAUDE_VISION_ENDPOINT`

Sans variables, l'application fonctionne en mode démo avec données factices.

## Pages incluses

- Vue d'ensemble (dashboard)
- Prospection (tableau journalier + swipe statut + ajout prospect)
- Appels (liste + filtres + audio + résumé)
- Planning (jour/semaine + événements RDV)
- Performances (gamification + leaderboard)
- Équipe (admin seulement)
- Paramètres (état des intégrations)

## Déploiement Vercel

1. Importer le repo dans Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. Configurer les variables d'environnement Vite
