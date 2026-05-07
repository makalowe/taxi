const { haversineDistance } = require('./pricing');
const { VEHICLES } = require('../data/vehicles');

/**
 * Trouve le taxi disponible le plus proche d'un point
 * Implémente la logique de dispatch automatique
 */
function findNearestTaxi(lat, lng, excludeIds = []) {
  const disponibles = VEHICLES.filter(v =>
    v.status === 'disponible' && !excludeIds.includes(v.id)
  );

  if (disponibles.length === 0) return null;

  // Trier par distance croissante
  disponibles.sort((a, b) => {
    const distA = haversineDistance(lat, lng, a.lat, a.lng);
    const distB = haversineDistance(lat, lng, b.lat, b.lng);
    return distA - distB;
  });

  const best = disponibles[0];
  const distance = haversineDistance(lat, lng, best.lat, best.lng);

  return {
    vehicle: best,
    distanceKm: Math.round(distance * 10) / 10,
    etaMinutes: Math.max(1, Math.round(distance / 0.5)) // ~30 km/h en ville
  };
}

/**
 * Vérifie si un véhicule est disponible
 */
function isVehicleAvailable(vehicleId) {
  const v = VEHICLES.find(v => v.id === vehicleId);
  return v && v.status === 'disponible';
}

/**
 * Met à jour le statut d'un véhicule
 */
function updateVehicleStatus(vehicleId, status, route = null) {
  const v = VEHICLES.find(v => v.id === vehicleId);
  if (!v) return null;
  v.status = status;
  if (route) v.route = route;
  v.lastUpdate = new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  return v;
}

/**
 * Met à jour la position GPS d'un véhicule
 */
function updateVehiclePosition(vehicleId, lat, lng) {
  const v = VEHICLES.find(v => v.id === vehicleId);
  if (!v) return null;
  v.lat = lat;
  v.lng = lng;
  v.lastUpdate = new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  return v;
}

module.exports = {
  findNearestTaxi,
  isVehicleAvailable,
  updateVehicleStatus,
  updateVehiclePosition
};
