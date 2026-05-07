---
name: taxi-mons
description: Projet Taxi Mons - Gestion de flotte de taxis en temps réel. Dashboard web, backend Node.js/Socket.IO, déploiement Vercel. Design sidebar foncée + accents dorés.
---

# Taxi Mons — Référence du projet

## Structure du projet

```
C:\Users\MIMBI\OneDrive\Bureau\taxi\
├── backend/                  # Backend Node.js (Express + Socket.IO)
│   ├── src/
│   │   ├── server.js         # Serveur principal (port 3002)
│   │   ├── config.js
│   │   ├── routes/           # auth.js, rides.js, vehicles.js
│   │   ├── services/         # dispatch.js, pricing.js, simulation.js
│   │   ├── middleware/       # auth.js
│   │   ├── socket/           # index.js
│   │   └── data/             # state.js, vehicles.js
│   └── package.json
├── deploy/
│   └── dashboard/            # Dashboard Vercel
│       ├── index.html        # Dashboard avec sidebar foncée
│       ├── vercel.json
│       └── .vercel/project.json
├── photo-écran/              # Maquettes ignorées par git
├── Project_OS/               # Organisation du projet
├── _session/MEMORY.md        # Mémoire de session
└── .pi/skills/taxi-mons/     # Ce skill
```

## Design système

```css
/* Sidebar */
--sidebar-bg: #0c0f14;
--sidebar-hover: #1a1f28;
--sidebar-active: #252b38;
--sidebar-w: 220px;

/* Accents */
--color-accent: #d98d00;
--color-accent-light: #FAC775;

/* Fond */
--color-bg: #f4efe6;
--color-card: #ffffff;
--color-card-alt: #faf7f2;

/* Statuts */
--color-green: #3B6D11;
--color-blue: #185FA5;
--color-amber: #854F0B;
--color-red: #A32D2D;
```

## URLs

- **Dashboard production** : https://taxi-mons.vercel.app
- **Dashboard Vercel** : https://vercel.com/makalowes-projects/taxi-mons
- **GitHub** : https://github.com/makalowe/taxi

## Commandes

```bash
# Déploiement Vercel
cd deploy/dashboard && npx vercel --prod

# Backend local
cd backend && npm start     # Port 3002

# Git
git add -A && git commit -m "message" && git push

# Analyser une image (Python)
python -c "from PIL import Image; img = Image.open('chemin.png'); print(img.size)"
```

## Pages du dashboard

1. **Flotte** — Carte Leaflet + liste véhicules + réservation + flux course
2. **Revenus** — Graphique barres + liste revenus par véhicule
3. **Chauffeurs** — Cartes profils chauffeurs
4. **Bilan** — Récapitulatif complet avec fetch API

## Connexion temps réel

- Socket.IO sur `http://localhost:3002`
- Events : `fleet:init`, `fleet:update`, `kpis:update`, `ride:new`, `ride:accepted`
