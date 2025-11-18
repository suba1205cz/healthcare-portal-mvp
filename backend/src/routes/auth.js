const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// simple auth middleware for routes in this file
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Register endpoint for both PATIENT and PROFESSIONAL
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role, // 'PATIENT' or 'PROFESSIONAL'
      specialties,
      location,
      bio,
      hourlyRate,
      experienceYears,
      languages,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (role !== 'PATIENT' && role !== 'PROFESSIONAL') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // create base user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
      },
    });

    let profile = null;
    let message = 'Registration successful';

    // if professional, also create a Profile with verified = false
    if (role === 'PROFESSIONAL') {
      if (!specialties || !location) {
        return res.status(400).json({
          error: 'Specialties and location are required for professionals',
        });
      }

      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          specialties,
          location,
          bio: bio || null,
          hourlyRate: hourlyRate || null,
          experienceYears: experienceYears || null,
          languages: languages || null,
          verified: false, // waiting for admin approval
        },
      });

      message =
        'Professional registered successfully. Your profile is pending admin approval.';
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
      message,
    });
  } catch (e) {
    console.error('Error in /register', e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profiles: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const profile = user.profiles?.[0] || null;

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (e) {
    console.error('Error in /login', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user + profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profiles: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = user.profiles?.[0] || null;

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (e) {
    console.error('Error in /me', e);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
