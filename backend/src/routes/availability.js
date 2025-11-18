const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// auth middleware
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

// Helper to get current professional profile
async function getCurrentProfile(userId) {
  return prisma.profile.findFirst({
    where: { userId },
  });
}

// Create availability slot (only for VERIFIED professionals)
router.post('/', auth, async (req, res) => {
  try {
    const { start, end } = req.body;

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: 'start and end datetime are required' });
    }

    if (req.user.role !== 'PROFESSIONAL') {
      return res
        .status(403)
        .json({ error: 'Only professionals can create availability' });
    }

    const profile = await getCurrentProfile(req.user.id);
    if (!profile) {
      return res
        .status(400)
        .json({ error: 'No profile found for this professional' });
    }

    if (!profile.verified) {
      return res.status(403).json({
        error:
          'Your profile is not yet approved. Wait for admin approval before setting availability.',
      });
    }

    const slot = await prisma.availability.create({
      data: {
        profileId: profile.id,
        start: new Date(start),
        end: new Date(end),
      },
    });

    res.json({ success: true, slot });
  } catch (e) {
    console.error('Error creating availability', e);
    res.status(500).json({ error: 'Failed to create availability' });
  }
});

// Get my availability slots
router.get('/mine', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PROFESSIONAL') {
      return res
        .status(403)
        .json({ error: 'Only professionals can view availability' });
    }

    const profile = await getCurrentProfile(req.user.id);
    if (!profile) {
      return res
        .status(400)
        .json({ error: 'No profile found for this professional' });
    }

    const slots = await prisma.availability.findMany({
      where: { profileId: profile.id },
      orderBy: { start: 'asc' },
    });

    res.json(slots);
  } catch (e) {
    console.error('Error fetching availability', e);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

module.exports = router;
