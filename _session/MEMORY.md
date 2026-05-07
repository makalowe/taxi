# Session Taxi Mons — Mémoire

Créé le : 2026-05-07
Dernière mise à jour : 2026-05-07

---

## 1. Contexte du projet

- **Projet** : Taxi Mons — Application de gestion de flotte de taxis en temps réel
- **Localisation** : `C:\Users\MIMBI\OneDrive\Bureau\taxi`
- **Stack technique** :
  - **Frontend** : HTML/CSS/JS statique (dashboard web), React Native (apps mobiles)
  - **Backend** : Node.js (Express + Socket.IO) sur port 3002
  - **Base de données** : PostgreSQL + Redis
  - **Carte** : Leaflet.js (OpenStreetMap)
  - **Déploiement** : Vercel (static)

---

## 2. Historique de la session (07/05/2026)

### Étape 1 : Ouverture du dashboard Vercel
- Accès au dashboard Vercel : https://vercel.com/dashboard
- Projet Vercel : `taxi-mons` (lié au repo GitHub `makalowe/taxi`)

### Étape 2 : Compréhension du projet
- Structure du projet explorée :
  - `backend/` — Serveur Node.js + Socket.IO
  - `deploy/dashboard/` — Dashboard web déployable sur Vercel
  - `photo-écran/` — Maquettes/screenshots du design
  - `Project_OS/` — Documents d'organisation du projet
  - `taxi_dashboard_template.html` — Template "TaxiOps Fleet"
  - `taxi_fleet_dashboard.html` — Template "FleetTaxi Pro"

### Étape 3 : Analyse du design cible
- L'utilisateur a montré 2 screenshots :
  1. `taxi_manager_dashboard_pc.png` — Design full-width, barre foncée en haut/bas
  2. `taxi_viktor_manager_pc.png` — Design avec sidebar foncée à gauche (210px)

- Analyse pixel par pixel avec Python (Pillow) :
  - Image 1 : Pas de sidebar, barre nav foncée en haut (~40px), barre status en bas (~24px), fond beige clair
  - Image 2 : Sidebar foncée 210px (#0c0f14), accent jaune/or dans la sidebar, fond beige clair

- **Choix de l'utilisateur** : Design avec sidebar foncée (Viktor)

### Étape 4 : Transformation du dashboard
- Fichier modifié : `deploy/dashboard/index.html`
- Changements :
  - ✅ Sidebar foncée 220px (fond `#0c0f14`) collée à gauche
  - ✅ Logo Taxi Mons avec icône jaune/or en haut de la sidebar
  - ✅ Navigation latérale avec 4 onglets : Flotte, Revenus, Chauffeurs, Bilan
  - ✅ Indicateur de connexion en bas de la sidebar
  - ✅ Contenu beige clair à droite
  - ✅ Accents dorés (`#d98d00`, `#FAC775`) sur les boutons et éléments actifs
  - ✅ Carte Leaflet, KPI, formulaire de réservation, flux de course
  - ✅ Socket.IO temps réel conservé
  - ✅ Responsive design

### Étape 5 : Déploiement sur Vercel
- Commande : `npx vercel --prod --yes`
- Résultat : ✅ Déploiement réussi !
- **URL production** : https://taxi-mons.vercel.app
- Projet Vercel : `makalowes-projects/taxi-mons`

---

## 3. Structure des dossiers clés

```
C:\Users\MIMBI\OneDrive\Bureau\taxi\
├── backend/                  # Backend Node.js (Express + Socket.IO)
│   ├── src/
│   │   ├── server.js         # Serveur principal (port 3002)
│   │   ├── config.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── socket/
│   └── package.json
├── deploy/
│   └── dashboard/            # Dashboard Vercel
│       ├── index.html        # Dashboard avec sidebar foncée (MODIFIÉ)
│       ├── vercel.json       # Config Vercel (static)
│       ├── DEPLOY.md
│       └── .vercel/project.json
├── photo-écran/              # Maquettes et screenshots
│   ├── taxi_manager_dashboard_pc.png
│   ├── taxi_viktor_manager_pc.png
│   ├── taxi_client_dashboard_photo.png
│   ├── taxi_driver_dashboard_photo.png
│   └── taxi_viktor_*.png
├── Project_OS/               # Organisation du projet
├── _session/                 # Mémoire de session (ce fichier)
└── taxi_*.html               # Templates divers
```

---

## 4. Design système (défini pour le dashboard)

```css
/* Sidebar */
--sidebar-bg: #0c0f14;
--sidebar-hover: #1a1f28;
--sidebar-active: #252b38;
--sidebar-w: 220px;

/* Accents */
--color-accent: #d98d00;        /* Doré */
--color-accent-light: #FAC775;  /* Jaune clair */

/* Fond */
--color-bg: #f4efe6;            /* Beige */
--color-card: #ffffff;
--color-card-alt: #faf7f2;

/* Statuts */
--color-green: #3B6D11;
--color-green-bg: #EAF3DE;
--color-blue: #185FA5;
--color-blue-bg: #E6F1FB;
--color-amber: #854F0B;
--color-amber-bg: #FAEEDA;
--color-red: #A32D2D;
--color-red-bg: #FCEBEB;
```

---

## 5. Prochaines étapes possibles

- [ ] Lancer le backend Node.js pour données temps réel
- [ ] Connecter une vraie base de données PostgreSQL
- [ ] Développer les apps mobiles (React Native)
- [ ] Ajouter l'authentification
- [ ] Améliorer les graphiques de revenus
- [ ] Ajouter des alertes et notifications
- [ ] Internationalisation (EN/NL)

---

## 6. Commandes utiles

```bash
# Déploiement Vercel
cd C:\Users\MIMBI\OneDrive\Bureau\taxi\deploy\dashboard
npx vercel --prod

# Backend
cd C:\Users\MIMBI\OneDrive\Bureau\taxi\backend
npm start

# Git
cd C:\Users\MIMBI\OneDrive\Bureau\taxi
git add .
git commit -m "message"
git push
```
