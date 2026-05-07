const express = require('express');
const { VEHICLES } = require('../data/vehicles');
const { updateVehicleStatus } = require('../services/dispatch');

const router = express.Router();

// GET /api/vehicles — Liste tous les véhicules
router.get('/', (req, res) => {
  const { status } = req.query;
  let result = VEHICLES;
  if (status) {
    result = VEHICLES.filter(v => v.status === status);
  }
  res.json({
    total: result.length,
    vehicles: result.map(v => ({
      id: v.id,
      plate: v.plate,
      driver: v.driver,
      status: v.status,
      km: v.km,
      fuel: v.fuel,
      coursesToday: v.coursesToday,
      revenueToday: v.revenueToday,
      lat: v.lat,
      lng: v.lng,
      route: v.route,
      lastUpdate: v.lastUpdate
    }))
  });
});

// GET /api/vehicles/:id — Détail d'un véhicule
router.get('/:id', (req, res) => {
  const v = VEHICLES.find(v => v.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Véhicule non trouvé' });
  res.json(v);
});

// PUT /api/vehicles/:id/status — Changer le statut
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['disponible', 'en-course', 'maintenance', 'hors-service'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Statut invalide. Valeurs: ${validStatuses.join(', ')}` });
  }
  const v = updateVehicleStatus(req.params.id, status);
  if (!v) return res.status(404).json({ error: 'Véhicule non trouvé' });
  res.json(v);
});

// GET /api/vehicles/stats/summary — KPIs agrégés
router.get('/stats/summary', (req, res) => {
  const total = VEHICLES.length;
  const enCourse = VEHICLES.filter(v => v.status === 'en-course').length;
  const disponibles = VEHICLES.filter(v => v.status === 'disponible').length;
  const maintenance = VEHICLES.filter(v => v.status === 'maintenance').length;
  const horsService = VEHICLES.filter(v => v.status === 'hors-service').length;
  const revenueTotal = VEHICLES.reduce((s, v) => s + v.revenueToday, 0);
  const coursesTotal = VEHICLES.reduce((s, v) => s + v.coursesToday, 0);

  res.json({
    total,
    actifs: disponibles + enCourse,
    enCourse,
    disponibles,
    maintenance,
    horsService,
    revenueTotal,
    coursesTotal
  });
});

module.exports = router;
