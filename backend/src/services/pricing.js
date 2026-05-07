const config = require('../config');

/**
 * Calcule le prix d'une course selon la tarification Wallonie
 * Tarif fixe, pas de surge pricing (≠ Uber)
 */
function calculatePrice(distanceKm, isNight = false) {
  const priseEnCharge = isNight
    ? config.PRICING.PRISE_CHARGE_NUIT
    : config.PRICING.PRISE_CHARGE_JOUR;

  const tarif = distanceKm <= config.PRICING.SEUIL_AGGLOMERATION
    ? config.PRICING.TARIF_1   // 1.65€/km en ville
    : config.PRICING.TARIF_2;  // 2.50€/km hors agglo

  const montant = priseEnCharge + (distanceKm * tarif);
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    tarifApplique: tarif,
    priseEnCharge: priseEnCharge,
    total: Math.round(montant * 100) / 100,
    isNight,
    isAgglomeration: distanceKm <= config.PRICING.SEUIL_AGGLOMERATION
  };
}

/**
 * Calcule la distance Haversine entre deux points GPS (en km)
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Rayon Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = { calculatePrice, haversineDistance };
