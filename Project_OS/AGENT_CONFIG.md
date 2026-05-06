# Agent Config

## Configuration par defaut

- Modele: GPT-5.5
- Niveau: medium
- Vitesse: standard
- Choix final: l'agent decide dynamiquement selon la tache.

## Regle de decision automatique

L'agent choisit le meilleur modele, niveau et vitesse selon:

- complexite de la demande;
- besoin de qualite;
- besoin de rapidite;
- presence de statistiques ou donnees;
- importance du livrable;
- risque d'erreur;
- cout/tokens necessaires.

## Optimisation tokens

Objectif: meilleur resultat utile avec le moins de tokens possible.

- Taches simples: low / fast.
- Travail courant: medium / standard.
- Strategie, statistiques, rapports importants: high / standard.
- Reponses courtes quand c'est suffisant.
- Pas de recherches ou relectures inutiles.

