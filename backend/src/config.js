// Configuration Taxi Mons
module.exports = {
  PORT: process.env.PORT || 3003,
  JWT_SECRET: process.env.JWT_SECRET || 'taxi-mons-secret-2026',
  JWT_EXPIRES_IN: '24h',

  // Tarification Wallonie (fixe, pas de surge)
  PRICING: {
    TARIF_1: 1.65,      // €/km (ville)
    TARIF_2: 2.50,      // €/km (hors agglo)
    PRISE_CHARGE_JOUR: 3.00,
    PRISE_CHARGE_NUIT: 6.00,
    HEURE_NUIT_DEBUT: 22,
    HEURE_NUIT_FIN: 6,
    SEUIL_AGGLOMERATION: 5, // km max pour tarif 1
  },

  // Simulation
  SIMULATION_INTERVAL: 3000, // ms entre chaque mise à jour GPS
  DISPATCH_TIMEOUT: 10000,   // ms avant de passer au chauffeur suivant

  // Mons centre
  MONS_CENTER: { lat: 50.4541, lng: 3.9568 },
};
