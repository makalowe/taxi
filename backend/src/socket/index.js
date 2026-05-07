const { VEHICLES } = require('../data/vehicles');
const { findNearestTaxi } = require('../services/dispatch');
const { calculatePrice, haversineDistance } = require('../services/pricing');
const { startRide } = require('../services/simulation');

/**
 * Configure Socket.io pour les événements temps réel
 */
function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connecté: ${socket.id}`);

    // Envoyer l'état initial de la flotte
    socket.emit('fleet:init', VEHICLES);

    // Envoyer les KPIs
    sendKpis(socket);

    // Commander une course depuis le dashboard
    socket.on('ride:request', (data, callback) => {
      const { pickupLat, pickupLng, dropoffLat, dropoffLng, clientName } = data;

      if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
        return callback?.({ error: 'Coordonnées requises' });
      }

      // Calculer distance et prix
      const distanceKm = haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
      const hour = new Date().getHours();
      const isNight = hour >= 22 || hour < 6;
      const pricing = calculatePrice(distanceKm, isNight);

      // Dispatch
      const dispatch = findNearestTaxi(pickupLat, pickupLng);
      if (!dispatch) {
        io.emit('ride:no-taxis', { message: 'Aucun taxi disponible' });
        return callback?.({ error: 'Aucun taxi disponible' });
      }

      const ride = {
        id: Math.random().toString(36).slice(2, 8).toUpperCase(),
        vehicleId: dispatch.vehicle.id,
        driverName: dispatch.vehicle.driver,
        vehiclePlate: dispatch.vehicle.plate,
        clientName: clientName || 'Client',
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
        createdAt: new Date().toISOString()
      };

      // Annoncer la course à tous les clients connectés
      io.emit('ride:new', ride);
      io.emit('fleet:update', VEHICLES);

      // Simuler l'acceptation du chauffeur après 2 secondes
      setTimeout(() => {
        const v = VEHICLES.find(v => v.id === dispatch.vehicle.id);
        if (v) {
          v.status = 'en-course';
          startRide(dispatch.vehicle.id, pickupLat, pickupLng, dropoffLat, dropoffLng);
          io.emit('ride:accepted', {
            rideId: ride.id,
            vehicleId: dispatch.vehicle.id,
            driverName: dispatch.vehicle.driver,
            etaMinutes: dispatch.etaMinutes
          });
          io.emit('fleet:update', VEHICLES);
          sendKpis(io);
        }
      }, 2000);

      callback?.(null, { rideId: ride.id, dispatch });
    });

    // Override dispatch manuel (admin)
    socket.on('dispatch:override', (data, callback) => {
      const { vehicleId, pickupLat, pickupLng, dropoffLat, dropoffLng } = data;
      const v = VEHICLES.find(v => v.id === vehicleId);
      if (!v || v.status !== 'disponible') {
        return callback?.({ error: 'Véhicule non disponible' });
      }
      v.status = 'en-course';
      startRide(vehicleId, pickupLat, pickupLng, dropoffLat, dropoffLng);
      io.emit('fleet:update', VEHICLES);
      sendKpis(io);
      callback?.(null, { success: true, vehicleId });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client déconnecté: ${socket.id}`);
    });
  });

  // Boucle de simulation : mise à jour des positions GPS toutes les 3s
  setInterval(() => {
    const sim = require('../services/simulation');
    const updates = sim.tickSimulation();
    sim.randomWalkAvailable();
    broadcastFleetUpdate(io, updates);
  }, 3000);
}

function broadcastFleetUpdate(io, updates = []) {
  io.emit('fleet:update', VEHICLES);
  sendKpis(io);

  // Diffuser les événements de fin de course
  updates.forEach(u => {
    if (u.type === 'ride-complete') {
      io.emit('ride:completed', {
        vehicleId: u.vehicleId,
        revenue: u.revenue,
        distance: u.distance,
        rideId: u.rideId
      });
    }
  });
}

function sendKpis(socketOrIo) {
  const total = VEHICLES.length;
  const enCourse = VEHICLES.filter(v => v.status === 'en-course').length;
  const disponibles = VEHICLES.filter(v => v.status === 'disponible').length;
  const maintenance = VEHICLES.filter(v => v.status === 'maintenance').length;
  const horsService = VEHICLES.filter(v => v.status === 'hors-service').length;
  const revenueTotal = VEHICLES.reduce((s, v) => s + v.revenueToday, 0);
  const coursesTotal = VEHICLES.reduce((s, v) => s + v.coursesToday, 0);

  const kpis = {
    actifs: disponibles + enCourse,
    enCourse, disponibles, maintenance, horsService,
    revenueTotal, coursesTotal
  };

  if (socketOrIo.emit) {
    socketOrIo.emit('kpis:update', kpis);
  } else {
    socketOrIo.emit('kpis:update', kpis);
  }
}

module.exports = { setupSocket };
