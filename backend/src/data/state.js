// État partagé entre les services
const ridesHistory = [];

function addRide(ride) {
  ridesHistory.unshift(ride);
  return ride;
}

function updateRide(rideId, updates) {
  const idx = ridesHistory.findIndex(r => r.id === rideId);
  if (idx !== -1) {
    ridesHistory[idx] = { ...ridesHistory[idx], ...updates };
    return ridesHistory[idx];
  }
  return null;
}

function getRides() {
  return ridesHistory;
}

function getRide(rideId) {
  return ridesHistory.find(r => r.id === rideId);
}

function getDriverRecap() {
  const { VEHICLES } = require('./vehicles');
  const recap = {};

  VEHICLES.forEach(v => {
    recap[v.driver] = {
      vehicleId: v.id,
      plate: v.plate,
      driver: v.driver,
      totalRides: v.coursesToday || 0,
      completedRides: 0,
      cancelledRides: 0,
      totalRevenue: v.revenueToday || 0,
      totalDistanceKm: 0,
      status: v.status,
      fuel: v.fuel,
      km: v.km,
      lastRide: null,
      rides: []
    };
  });

  ridesHistory.forEach(r => {
    if (recap[r.driverName]) {
      recap[r.driverName].totalRides++;
      if (r.status === 'completed') {
        recap[r.driverName].completedRides++;
        recap[r.driverName].totalRevenue += r.price || 0;
        recap[r.driverName].totalDistanceKm += r.distanceKm || 0;
        recap[r.driverName].lastRide = r.completedAt || r.createdAt;
      } else if (r.status === 'cancelled') {
        recap[r.driverName].cancelledRides++;
      }
      recap[r.driverName].rides.push(r);
    }
  });

  return Object.values(recap).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

module.exports = { addRide, updateRide, getRides, getRide, getDriverRecap };
