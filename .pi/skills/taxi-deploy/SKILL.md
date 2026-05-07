{
  "name": "taxi-deploy",
  "description": "Déploie le dashboard Taxi Mons sur Vercel. Use when deploying the Taxi Mons dashboard to Vercel.",
  "compatibility": "Vercel CLI required (npx vercel)"
}

# Taxi Deploy

## Description
Déploie le dashboard **Taxi Mons** sur Vercel pour que le client puisse voir son tableau de bord en ligne.

## Prérequis
- Node.js installé
- Compte Vercel (gratuit sur vercel.com)
- Dashboard prêt dans `deploy/dashboard/`

## Déploiement

```bash
# Aller dans le dossier du dashboard
cd /c/Users/MIMBI/OneDrive/Bureau/taxi/deploy/dashboard

# Déployer sur Vercel (première fois)
npx vercel --prod

# Ou si déjà déployé, mise à jour
npx vercel --prod
```

Suivre les instructions :
1. Choisir "Y" pour continuer
2. Connecter son compte Vercel si première fois
3. Le lien sera : `https://taxi-mons.vercel.app`

## Structure du dashboard
- `deploy/dashboard/index.html` — Dashboard complet Taxi Mons
- `deploy/dashboard/vercel.json` — Configuration Vercel

## Pour montrer au client
Envoyer le lien WhatsApp :
```
🎉 Votre dashboard Taxi Mons est en ligne :
https://taxi-mons.vercel.app

Vous pouvez voir votre flotte en temps réel,
les revenus du jour et l'état de chaque véhicule.
```
