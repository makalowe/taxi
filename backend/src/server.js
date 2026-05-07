const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const ridesRoutes = require('./routes/rides');
const vehiclesRoutes = require('./routes/vehicles');

// Import socket
const { setupSocket } = require('./socket/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', ridesRoutes);
app.use('/api/vehicles', vehiclesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Taxi Mons Backend',
    version: '1.0.0',
    time: new Date().toISOString(),
    vehicles: 10
  });
});

// WebSocket
setupSocket(io);

// Démarrage
server.listen(config.PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║           🚕 TAXI MONS — BACKEND                ║
╠══════════════════════════════════════════════════╣
║  API REST  : http://localhost:${config.PORT}/api      ║
║  Socket.io : ws://localhost:${config.PORT}            ║
║  Santé     : http://localhost:${config.PORT}/api/health║
║                                                   ║
║  Flotte    : 10 véhicules simulés                ║
║  Tarifs    : Fixe Wallonie (pas de surge)        ║
║  Statut    : ✅ En ligne                         ║
╚══════════════════════════════════════════════════╝
  `);
});
