const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const { findNearestTaxi, updateVehicleStatus } = require('../services/dispatch');
const { calculatePrice, haversineDistance } = require('../services/pricing');
const { startRide } = require('../services/simulation');
const { VEHICLES } = require('../data/vehicles');
const { addRide, getRides, getDriverRecap } = require('../data/state');

const router = express.Router();

// GET /api/rides — liste des courses
router.get('/', authenticateToken, (req, res) => {
  // Filtrer selon le rôle
  const allRides = getRides();
  let result = allRides;
  if (req.user.role === 'client') {
    result = allRides.filter(r => r.clientId === req.user.id);
  } else if (req.user.role === 'driver') {
    result = allRides.filter(r => r.driverId === req.user.id);
  }
  res.json(result);
});

// POST /api/rides/book — Commander une course (dispatch automatique)
router.post('/book', (req, res) => {
  const { pickupLat, pickupLng, dropoffLat, dropoffLng, clientName } = req.body;

  if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
    return res.status(400).json({
      error: 'Coordonnées de départ et d\'arrivée requises',
      example: { pickupLat: 50.4541, pickupLng: 3.9568, dropoffLat: 50.4556, dropoffLng: 3.9406 }
    });
  }

  // 1. Calculer la distance totale
  const distanceKm = haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);

  // 2. Vérifier la nuit
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;

  // 3. Calculer le prix estimé
  const pricing = calculatePrice(distanceKm, isNight);

  // 4. Dispatch : trouver le taxi le plus proche
  const dispatch = findNearestTaxi(pickupLat, pickupLng);
  if (!dispatch) {
    return res.status(503).json({ error: 'Aucun taxi disponible pour le moment' });
  }

  // 5. Créer la course
  const ride = {
    id: uuidv4().slice(0, 8),
    clientName: clientName || 'Client',
    clientId: req.user?.id || 'anonymous',
    driverId: dispatch.vehicle.id,
    driverName: dispatch.vehicle.driver,
    vehicleId: dispatch.vehicle.id,
    vehiclePlate: dispatch.vehicle.plate,
    status: 'assigned',
    pickupLat, pickupLng,
    dropoffLat, dropoffLng,
    distanceKm: pricing.distanceKm,
    price: pricing.total,
    pricing,
    dispatch: {
      distanceKm: dispatch.distanceKm,
      etaMinutes: dispatch.etaMinutes
    },
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null
  };

  addRide(ride);

  // 6. Démarrer la simulation de la course
  startRide(dispatch.vehicle.id, pickupLat, pickupLng, dropoffLat, dropoffLng, ride.id);

  // 7. Marquer le véhicule comme "en course" immédiatement
  updateVehicleStatus(dispatch.vehicle.id, 'en-course',
    `${latLngToStreet(pickupLat, pickupLng)} → ${latLngToStreet(dropoffLat, dropoffLng)}`);

  res.status(201).json(ride);
});

// GET /api/rides/estimate — Estimer un prix sans réserver
router.post('/estimate', (req, res) => {
  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = req.body;

  if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
    return res.status(400).json({ error: 'Coordonnées requises' });
  }

  const distanceKm = haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;
  const pricing = calculatePrice(distanceKm, isNight);

  // Disponibilité
  const disponibles = VEHICLES.filter(v => v.status === 'disponible').length;

  res.json({
    distanceKm: pricing.distanceKm,
    pricing,
    taxisDisponibles: disponibles,
    dureeEstimee: Math.round(distanceKm / 0.4) // ~24 km/h en ville
  });
});

// GET /api/rides/recap — Récapitulatif complet par chauffeur (public)
router.get('/recap', (req, res) => {
  const drivers = getDriverRecap();
  const allRides = getRides();
  res.json({
    generatedAt: new Date().toISOString(),
    totalDrivers: drivers.length,
    totalRidesAll: allRides.length,
    totalRevenueAll: drivers.reduce((s, d) => s + d.totalRevenue, 0),
    drivers
  });
});

// GET /api/rides/live — Récupérer les courses actives
router.get('/live', (req, res) => {
  const allRides = getRides();
  const active = allRides.filter(r => ['assigned', 'accepted', 'started'].includes(r.status));
  res.json(active);
});

function latLngToStreet(lat, lng) {
  const { STREETS } = require('../data/vehicles');
  let best = 'Mons';
  let bestDist = Infinity;
  for (const [name, pos] of Object.entries(STREETS)) {
    const d = haversineDistance(lat, lng, pos.lat, pos.lng);
    if (d < bestDist) { bestDist = d; best = name; }
  }
  return bestDist < 1 ? best : `${best} (${Math.round(bestDist * 10) / 10}km)`;
}

module.exports = router;
