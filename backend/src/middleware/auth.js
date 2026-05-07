const jwt = require('jsonwebtoken');
const config = require('../config');

// Utilisateurs simulés (en mémoire, remplacer par PostgreSQL plus tard)
const USERS = [
  { id: 'u1', email: 'client@taxi-mons.be', password: '$2a$10$client123', name: 'Client Test', role: 'client', phone: '+32 465 12 34 56' },
  { id: 'u2', email: 'driver@taxi-mons.be', password: '$2a$10$driver123', name: 'Marc Dupont', role: 'driver', phone: '+32 465 23 45 67' },
  { id: 'u3', email: 'admin@taxi-mons.be', password: '$2a$10$admin1234', name: 'Gestionnaire', role: 'admin', phone: '+32 465 34 56 78' },
];

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Accès réservé aux rôles: ${roles.join(', ')}` });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole, USERS };
