const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { USERS } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  // Version simplifiée (sans bcrypt réel pour la démo)
  const user = USERS.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // En production: bcrypt.compare(password, user.password)
  // En démo: accepter "password123" pour tous
  if (password !== 'password123') {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone
    }
  });
});

// POST /api/auth/register (simplifié)
router.post('/register', (req, res) => {
  const { email, password, name, role, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
  }

  if (USERS.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  }

  const newUser = {
    id: `u${USERS.length + 1}`,
    email,
    name,
    role: role || 'client',
    phone: phone || '',
  };

  USERS.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  res.status(201).json({ token, user: newUser });
});

module.exports = router;
