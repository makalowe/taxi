{
  "name": "taxi-project-os",
  "description": "Structure et organisation du projet Taxi Mons selon le système Project_OS.",
  "compatibility": "Markdown"
}

# Taxi Project OS

## Description
Structure d'organisation du projet Taxi Mons. Utiliser ce skill pour comprendre l'état du projet et les prochaines étapes.

## Structure

```
taxi/
├── .pi/skills/           # Skills pi pour le projet
├── Project_OS/           # Système d'organisation
│   ├── 01_Vision/        # PROJECT_BRIEF.md
│   ├── 02_Roadmap/       # SPRINT_CURRENT.md
│   ├── 03_Execution/     # WEEKLY_OS.md
│   ├── 04_Decisions/     # DECISION_LOG.md
│   └── 05_Standards/     # STANDARDS.md
├── scripts/backup/       # Scripts de sauvegarde
├── deploy/dashboard/     # Dashboard Vercel
├── backups/              # Archives ZIP
├── photo-écran/          # Maquettes visuelles
├── Taxi - Analyse complete.md
├── taxi_fleet_dashboard.html
└── taxi_app_architecture.svg
```

## État actuel (2026-05-07)
- ✅ Systeme de backup 5 méthodes
- ✅ Dashboard Taxi Mons en ligne (Vercel)
- ❌ Backend Node.js à créer
- ❌ Apps mobiles React Native à développer

## Prochaines étapes prioritaires
1. Déploiement Vercel du dashboard
2. Création du backend Node.js (API + PostgreSQL + Redis)
3. Développement des apps mobiles React Native
