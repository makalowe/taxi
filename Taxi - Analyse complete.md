# Taxi MVP — Analyse complète

**Date** : 2026-05-06
**Statut** : Phase design & architecture (pré-MVP)
**Tags** : #projet #taxi #react-native #nodejs #architecture

---

## 1. Vision

Application de **réservation de taxis** pour la région de **Mons, Belgique**. Le projet couvre 3 applications connectées en temps réel : une app client, une app chauffeur, et un dashboard gestionnaire. L'objectif est de gérer une flotte de 10 véhicules avec dispatch automatique, suivi GPS live, et réservation immédiate ou planifiée.

---

## 2. État actuel du projet

> ⚠️ **Stade : pré-MVP** — Le projet est actuellement au stade de **conception et prototypage**.
>
> Ce qui existe :
> - ✅ **Architecture complète** documentée dans 2 SVG
> - ✅ **Maquette HTML** du dashboard flotte (2 versions : FleetTaxi Pro et TaxiOps)
> - ✅ **Captures d'écran** des maquettes d'écrans (client, chauffeur, manager)
> - ❌ **Aucun code backend** écrit
> - ❌ **Aucune application mobile** développée
> - ❌ **Aucune base de données** déployée

---

## 3. Architecture cible (3 couches)

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. COUCHE APPLICATIONS (React Native / React)                      │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │  App Client      │  │  App Chauffeur  │  │  Dashboard Manager  │ │
│  │  (React Native)  │  │  (React Native) │  │  (React.js)         │ │
│  │                  │  │                  │  │                     │ │
│  │  • Commander     │  │  • Accepter/     │  │  • Vue flotte live  │ │
│  │  • Planifier     │  │    refuser       │  │  • Override dispatch│ │
│  │  • Voir ETA      │  │  • GPS live     │  │  • KPIs, alertes    │ │
│  │  • Paiement      │  │  • Start/stop   │  │  • Rapports         │ │
│  └────────┬─────────┘  └────────┬────────┘  └──────────┬──────────┘ │
└───────────┼─────────────────────┼──────────────────────┼────────────┘
            │                     │                      │
            │            HTTPS API (JWT)                  │
            ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. COUCHE BACKEND (Node.js)                                        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ API Gateway  │  │ Dispatch     │  │ Socket.io    │              │
│  │ + Auth JWT   │──│ Service      │──│ Hub (live)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Ride Service │  │ Pricing      │  │ Notification │              │
│  │ (statuts,    │  │ Service      │  │ Service (FCM)│              │
│  │ réservations)│  │ (tarifs)     │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │ Reporting    │  │ Admin        │                                │
│  │ Service      │  │ Override     │                                │
│  └──────────────┘  └──────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. DONNÉES & SERVICES EXTERNES                                     │
│                                                                     │
│  ┌─────────────────┐  ┌────────────┐  ┌──────────┐  ┌───────────┐  │
│  │ PostgreSQL      │  │   Redis    │  │ Google   │  │ Firebase  │  │
│  │ (source of      │  │ (positions │  │ Maps API │  │ FCM       │  │
│  │  truth)         │  │  GPS live, │  │ (routing,│  │ (push     │  │
│  │ users, drivers, │  │  cache     │  │  ETA,    │  │  notifs)  │  │
│  │ vehicles, rides │  │  ETA)      │  │  matrix) │  │           │  │
│  └─────────────────┘  └────────────┘  └──────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Flux de fonctionnement

```
1. CLIENT commande une course (app)
        │
        ▼
2. API Gateway authentifie (JWT)
        │
        ▼
3. Dispatch Service trouve le taxi le plus proche (Redis GPS)
        │
        ▼
4. Notification push au chauffeur (Firebase FCM)
        │
        ├──➤ Accepté → Client notifié + ETA
        │
        └──➤ Refusé → Dispatch cherche suivant
        │
        ▼
5. Chauffeur en course → GPS live (Socket.io) → Client voit ETA
        │
        ▼
6. Course terminée → Pricing calculé → Paiement
        │
        ▼
7. Reporting mis à jour (PostgreSQL)
```

---

## 5. Fichiers du projet

| Fichier | Rôle |
|---|---|
| **`taxi_mvp_architecture.svg`** | Architecture 3 couches complète (1200×760) |
| **`taxi_app_architecture.svg`** | Architecture applicative détaillée (680×620) |
| **`taxi_mvp_architecture_preview.html`** | Visualisation SVG dans le navigateur |
| **`taxi_dashboard_template.html`** | Dashboard manager **TaxiOps** (design épuré, thème beige/or) |
| **`taxi_fleet_dashboard.html`** | Dashboard manager **FleetTaxi Pro** (design moderne, thème blanc/bleu) |

### Captures d'écran (dossier `photo-écran/`)
| Fichier | Contenu |
|---|---|
| `taxi_viktor_architecture_globale.png` | Architecture globale |
| `taxi_viktor_client.png` | Maquette app client |
| `taxi_viktor_driver.png` | Maquette app chauffeur |
| `taxi_viktor_manager_pc.png` | Maquette dashboard manager |
| `taxi_viktor_flux_course.png` | Diagramme flux course |
| `taxi_client_dashboard_photo.png` | Capture app client |
| `taxi_driver_dashboard_photo.png` | Capture app chauffeur |
| `taxi_manager_dashboard_pc.png` | Capture dashboard manager |

---

## 6. Dashboard Flotte — Détail des 2 versions

### Version A : TaxiOps (`taxi_dashboard_template.html`)
- **Thème** : Beige/chaud, fond #f4efe6, accent or #ffb703
- **Layout** : Barre du haut (brand + zone + sync + alertes) → KPI 5 cartes → 2 colonnes (carte + alertes) → 2 colonnes (flotte + revenus)
- **Contenu** :
  - 5 KPI : véhicules actifs, en course, disponibles, maintenance, revenus jour
  - Carte placeholder (Google Maps API + Socket.io)
  - Alertes : TX-07 hors service, TX-04 maintenance, 4 courses en attente
  - Liste flotte (4 véhicules avec statut)
  - Mini chart revenus 7 jours (barres CSS)
- **Données simulées** : statiques en HTML

### Version B : FleetTaxi Pro (`taxi_fleet_dashboard.html`)
- **Thème** : Blanc/gris, design system avancé (variables CSS complètes)
- **Layout** : Header + onglets (Flotte / Revenus / Chauffeurs) → KPI 5 cartes → Grille véhicules cliquables → Panneau détail → Graphique
- **Contenu** :
  - 5 KPI dynamiques (JS)
  - 10 véhicules simulés avec données réalistes
  - Filtres : Tous / En course / Disponibles / Maintenance / Hors service
  - Panneau détail (clic sur véhicule → historique courses, stats)
  - Graphique revenus (barres verticales)
  - Onglet Chauffeurs (grille avec stats individuelles)
  - Barres de carburant (vert/orange/rouge)
- **Données simulées** : JSON en JS (10 véhicules, historiques)
- **Interactions** : clic → détail, filtres, onglets, tri

### Fonctionnalités communes
- ✅ Design responsive
- ✅ KPI temps réel
- ✅ Statuts véhicules (en course, disponible, maintenance, hors service)
- ✅ Barres de progression (carburant, revenus)
- ✅ Palette de couleurs métier (vert = ok, orange = attention, rouge = problème)

---

## 7. Stack technique cible

| Technologie | Usage |
|---|---|
| **React Native** | App Client + App Chauffeur (iOS & Android) |
| **React.js** | Dashboard Gestionnaire (web) |
| **Node.js** | Backend API (Express ou Fastify) |
| **TypeScript** | Langage backend |
| **PostgreSQL** | Base de données principale (utilisateurs, courses, véhicules) |
| **Redis** | Positions GPS live, cache ETA, présence chauffeurs |
| **Socket.io** | Communication temps réel (GPS, statuts) |
| **Google Maps API** | Géocodage, routage, calcul ETA, distance matrix |
| **Firebase FCM** | Notifications push mobiles |
| **JWT** | Authentification (RBAC : client, chauffeur, admin) |
| **Docker** | Conteneurisation |

---

## 8. Points forts

### Architecture
- Architecture 3 couches claire et bien documentée (SVG)
- Microservices backend bien découpés (8 services)
- Temps réel via Socket.io + Redis (GPS, ETA)
- Stack complète et cohérente (React Native + Node.js + PostgreSQL + Redis)

### Dashboard
- **FleetTaxi Pro** est très avancé pour un prototype : 10 véhicules simulés, filtres, panneau détail, graphiques, 3 onglets
- Design system complet (variables CSS, palettes métier)
- Données réalistes (immatriculations, noms, kilométrages, revenus)
- Expérience fluide : clic → détail, filtres, animation hover

### Préparation
- Architecture pensée avant de coder (bonne pratique)
- SVG visuels prêts pour documentation ou pitch
- Maquettes fonctionnelles (pas juste du design statique)

---

## 9. Problèmes identifiés & améliorations

### 🔴 Critique (bloquant pour le MVP)

| Problème | Solution |
|---|---|
| **Aucun code backend écrit** | Backend = 80% du travail. Commencer par l'API Gateway + Auth |
| **Aucune app mobile développée** | React Native = le plus long. Commencer par le dashboard web |
| **Aucune BDD déployée** | PostgreSQL + Redis en Docker dès le jour 1 |
| **Pas d'API Google Maps configurée** | Créer un projet Google Cloud + activer Maps API + clé API |

### 🟡 Forte priorité

| Problème | Solution |
|---|---|
| **2 dashboards concurrents** (TaxiOps + FleetTaxi Pro) | Choisir **FleetTaxi Pro** (plus complet), jeter TaxiOps |
| **Dashboard 100% statique** (données en dur) | Connecter à une vraie API REST + Socket.io |
| **Carte placeholder** | Intégrer Google Maps React component |
| **Pas d'authentification** | Ajouter JWT + login (client, chauffeur, admin) |
| **Pas de dispatch automatique** | Logique métier : trouver le taxi le plus proche (formule Haversine) |

### 🟢 Priorité moyenne

| Problème | Solution |
|---|---|
| **Pas de gestion des erreurs** (véhicule HS, pas de chauffeur dispo) | Ajouter des états d'erreur dans le flux |
| **Pricing non défini** | Algo : distance × taux + temps d'attente + forfait prise en charge |
| **Pas de paiement intégré** | Stripe Connect ou paiement cash/TPE (comme spécifié dans l'archi) |
| **Pas de notifications push** | Firebase FCM à configurer |
| **Pas de réservation planifiée** | Ajouter un champ `scheduled_at` dans les courses |

---

## 10. Plan d'exécution recommandé

### Phase 1 — Backend Foundation (semaine 1-2)
| Jour | Action |
|---|---|
| J1-2 | Docker : PostgreSQL + Redis + Node.js API |
| J3-4 | API Gateway + Auth JWT (register, login, RBAC) |
| J5-6 | Ride Service (CRUD courses, statuts) |
| J7 | Dispatch Service (algo distance + disponibilité) |
| J8 | Socket.io Hub (positions GPS + notifications) |

### Phase 2 — Dashboard web (semaine 3)
| Jour | Action |
|---|---|
| J9 | Projet React (Vite) + connexion API |
| J10 | Carte Google Maps + marqueurs temps réel |
| J11 | KPI dynamiques + graphiques |
| J12-13 | Filtres, tri, détails, actions manuelles (override dispatch) |

### Phase 3 — Applications mobiles (semaine 4-6)
| Jour | Action |
|---|---|
| J14-15 | App Client React Native (commander, voir ETA, paiement) |
| J16-18 | App Chauffeur React Native (accepter, GPS live, terminer) |
| J19-20 | Notifications push (FCM) pour les deux apps |
| J21 | Tests intégration + beta avec 5 vrais chauffeurs |

---

## 11. Dashboard FleetTaxi Pro — Spécifications détaillées

### KPI
| Métrique | Formule |
|---|---|
| Actifs aujourd'hui | `COUNT(vehicules WHERE statut != 'hors-service')` |
| En course | `COUNT(courses WHERE statut = 'en_cours')` |
| En maintenance | `COUNT(vehicules WHERE statut = 'maintenance')` |
| Revenus du jour | `SUM(courses WHERE date = today)` |
| Courses totales | `COUNT(courses WHERE date = today)` |

### Statuts véhicules
| Statut | Couleur | Action possible |
|---|---|---|
| 🟢 Disponible | `#185FA5` (bleu) | Assigner une course |
| 🟡 En course | `#3B6D11` (vert) | Voir détails |
| 🟠 Maintenance | `#854F0B` (orange) | Voir rapport |
| 🔴 Hors service | `#A32D2D` (rouge) | Diagnostic |

### Jeu de données démo (10 véhicules)
| ID | Conducteur | Statut | Km | Carburant | Courses | Revenus |
|---|---|---|---|---|---|---|
| TX-01 | Marc Dupont | En course | 142 340 | 78% | 5 | 210€ |
| TX-02 | Sara Lemaire | Disponible | 98 210 | 92% | 3 | 130€ |
| TX-03 | Jean Moreau | En course | 210 540 | 55% | 6 | 280€ |
| TX-04 | Amina Bouzid | Maintenance | 175 000 | 30% | 0 | 0€ |
| TX-05 | Luc Renard | En course | 88 700 | 64% | 4 | 175€ |
| TX-06 | Nora Petit | Disponible | 132 000 | 88% | 2 | 85€ |
| TX-07 | Karim Ouali | Hors service | 305 000 | 10% | 0 | 0€ |
| TX-08 | Sophie Laurent | En course | 54 200 | 71% | 5 | 245€ |
| TX-09 | Pierre Tran | Disponible | 167 800 | 95% | 3 | 115€ |
| TX-10 | Fatou Diallo | Maintenance | 220 100 | 20% | 0 | 600€ |

---

## 12. Architecture technique détaillée

### Backend — Microservices (Node.js + TypeScript)

```
services/
├── api-gateway/          # Express, JWT validation, rate limiting, RBAC
│   ├── src/
│   │   ├── middleware/   # auth, validation, rate-limit
│   │   ├── routes/       # proxy vers les autres services
│   │   └── server.ts
│   └── Dockerfile
│
├── dispatch/             # Algorithme d'affectation
│   ├── src/
│   │   ├── algorithm/    # Haversine, priorisation
│   │   └── server.ts
│   └── Dockerfile
│
├── ride/                 # Gestion des courses
│   ├── src/
│   │   ├── models/       # PostgreSQL (TypeORM ou Prisma)
│   │   ├── routes/
│   │   └── server.ts
│   └── Dockerfile
│
├── socket-hub/           # WebSocket temps réel
│   ├── src/
│   │   ├── handlers/     # position, ETA, statut
│   │   └── server.ts
│   └── Dockerfile
│
├── notification/         # Push FCM
│   ├── src/server.ts
│   └── Dockerfile
│
├── pricing/              # Calcul des tarifs
│   └── ...
│
└── reporting/            # Agrégation KPI
    └── ...
```

### Base de données PostgreSQL

```sql
-- Utilisateurs (clients + chauffeurs + admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'driver', 'admin')),
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chauffeurs (infos supplémentaires)
CREATE TABLE drivers (
    id UUID PRIMARY KEY REFERENCES users(id),
    license_number TEXT NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    is_online BOOLEAN DEFAULT false,
    current_lat FLOAT,
    current_lng FLOAT,
    last_position_at TIMESTAMPTZ
);

-- Véhicules
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate TEXT UNIQUE NOT NULL,
    brand TEXT,
    model TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'on_ride', 'maintenance', 'off')),
    fuel_level FLOAT DEFAULT 100,
    mileage INT DEFAULT 0
);

-- Courses
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'started', 'completed', 'cancelled')),
    pickup_lat FLOAT NOT NULL,
    pickup_lng FLOAT NOT NULL,
    dropoff_lat FLOAT,
    dropoff_lng FLOAT,
    distance_km FLOAT,
    duration_min INT,
    price_cents INT,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 13. Concurrence & positionnement

| Concurrent | Positionnement | Différence |
|---|---|---|
| **Uber** | International, standardisé | **Local (Mons)**, flotte fixe, chauffeurs connus |
| **Heetch** | France/Belgique, particulier | **Professionnel**, licence taxi |
| **Taxis Verts** | Belgique, traditionnel | **App moderne**, dispatch auto, suivi live |
| **Bolt** | International, low-cost | **Service personnalisé**, réservation planifiée |

---

## 14. Liens utiles

- Dossier projet : `C:\Users\MIMBI\OneDrive\Bureau\taxi`
- Dashboard FleetTaxi Pro : `taxi_fleet_dashboard.html`
- Dashboard TaxiOps : `taxi_dashboard_template.html`
- Architecture SVG : `taxi_mvp_architecture.svg`

Projets connexes :
- [[Zion Tour]] — Partage possible de l'infra VPS Hostinger
- [[Email Campaign Manager]] — Module d'envoi d'emails (notifications course)

---

## 15. Journal de mise à jour

- 2026-05-06 : Analyse complète du projet
- 2026-04-30 : Captures d'écran maquettes (client, chauffeur, manager)
- 2026-04-23 : Création architecture SVG + dashboard HTML
