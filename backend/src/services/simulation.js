const { VEHICLES } = require('../data/vehicles');
const { updateVehiclePosition, updateVehicleStatus } = require('./dispatch');
const { updateRide } = require('../data/state');

// Courses actives simulées
const activeRides = new Map(); // vehicleId -> { clientLat, clientLng, destLat, destLng, step, totalSteps, route, rideId }

/**
 * Démarre une course simulée pour un véhicule
 */
function startRide(vehicleId, pickupLat, pickupLng, dropoffLat, dropoffLng, rideId = null) {
  const steps = 20 + Math.floor(Math.random() * 10);
  activeRides.set(vehicleId, {
    pickupLat, pickupLng,
    dropoffLat, dropoffLng,
    step: 0,
    totalSteps: steps,
    route: `${latLngToStreet(pickupLat, pickupLng)} → ${latLngToStreet(dropoffLat, dropoffLng)}`,
    rideId
  });
  updateVehicleStatus(vehicleId, 'en-course', activeRides.get(vehicleId).route);
  return activeRides.get(vehicleId);
}

/**
 * Anime les véhicules en course (interpolation linéaire)
 * Retourne les positions mises à jour
 */
function tickSimulation() {
  const updates = [];

  activeRides.forEach((ride, vehicleId) => {
    const v = VEHICLES.find(v => v.id === vehicleId);
    if (!v) return;

    ride.step++;
    const t = ride.step / ride.totalSteps;

    if (t >= 1) {
      // Course terminée
      v.lat = ride.dropoffLat;
      v.lng = ride.dropoffLng;
      v.coursesToday++;
      const dist = haversineDistance(ride.pickupLat, ride.pickupLng, ride.dropoffLat, ride.dropoffLng);
      const revenue = Math.round((dist * (dist <= 5 ? 1.65 : 2.50) + 3) * 100) / 100;
      v.revenueToday = Math.round((v.revenueToday + revenue) * 100) / 100;
      v.km += Math.round(dist);
      updateVehicleStatus(vehicleId, 'disponible', latLngToStreet(ride.dropoffLat, ride.dropoffLng));
      // Marquer la course comme terminée dans l'historique
      if (ride.rideId) {
        updateRide(ride.rideId, {
          status: 'completed',
          completedAt: new Date().toISOString(),
          price: revenue,
          distanceKm: Math.round(dist * 10) / 10
        });
      }
      activeRides.delete(vehicleId);
      updates.push({ type: 'ride-complete', vehicleId, revenue, distance: Math.round(dist * 10) / 10, rideId: ride.rideId });
    } else {
      // Interpolation linéaire entre pickup et dropoff
      v.lat = ride.pickupLat + (ride.dropoffLat - ride.pickupLat) * t;
      v.lng = ride.pickupLng + (ride.dropoffLng - ride.pickupLng) * t;
      v.lat += (Math.random() - 0.5) * 0.0008; // Petit bruit GPS
      v.lng += (Math.random() - 0.5) * 0.0008;
      updateVehiclePosition(vehicleId, v.lat, v.lng);
    }
  });

  return updates;
}

/**
 * Déplace aléatoirement les véhicules disponibles (simulation de vie)
 */
function randomWalkAvailable() {
  VEHICLES.forEach(v => {
    if (v.status === 'disponible' && !activeRides.has(v.id)) {
      v.lat += (Math.random() - 0.5) * 0.002;
      v.lng += (Math.random() - 0.5) * 0.002;
      v.lastUpdate = new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
    }
  });
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function latLngToStreet(lat, lng) {
  // Simulation: trouver le lieu le plus proche
  const { STREETS } = require('../data/vehicles');
  let best = 'Mons';
  let bestDist = Infinity;
  for (const [name, pos] of Object.entries(STREETS)) {
    const d = haversineDistance(lat, lng, pos.lat, pos.lng);
    if (d < bestDist) { bestDist = d; best = name; }
  }
  return bestDist < 1 ? best : `${best} (${Math.round(bestDist * 10) / 10}km)`;
}

module.exports = { startRide, tickSimulation, randomWalkAvailable, activeRides };
