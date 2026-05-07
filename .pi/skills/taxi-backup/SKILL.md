{
  "name": "taxi-backup",
  "description": "Système de sauvegarde 5 méthodes pour le projet Taxi. Use for backing up the Taxi Mons project.",
  "compatibility": "Git, rclone, bash, Windows"
}

# Taxi Backup

## Description
Système de sauvegarde complet pour le projet Taxi Mons avec 5 méthodes.

## Méthodes disponibles

### 1. 📦 Git Push (GitHub)
```bash
cd /c/Users/MIMBI/OneDrive/Bureau/taxi
git add -A && git commit -m "Backup $(date)" && git push origin main
```

### 2. 💾 Archive ZIP avec rotation (14 jours)
```bash
bash scripts/backup/backup-local.sh
```

### 3. ☁️ Cloud Sync (rclone)
```bash
# Configurer d'abord
/c/Users/MIMBI/rclone/rclone.exe config

# Puis synchroniser
bash scripts/backup/backup-cloud.sh
```

### 4. 🗓️ Windows Task Scheduler
```cmd
# Lancer en administrateur
scripts\backup\setup-scheduler.bat
```

### 5. 🛡️ Tout-en-un
```bash
bash scripts/backup/backup-all.sh
```

## Fichiers de backup
- Scripts : `scripts/backup/`
- Archives : `backups/`
- Logs : `scripts/backup/logs/`
