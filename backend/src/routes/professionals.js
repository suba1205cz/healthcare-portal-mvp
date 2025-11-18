const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Auth middleware
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

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
}

/**
 * Public: list VERIFIED professionals with optional search filters
 */
router.get('/', async (req, res) => {
  try {
    const { q, location } = req.query;

    const where = {
      verified: true,
      AND: [
        q
          ? {
              OR: [
                { specialties: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
                { user: { name: { contains: q, mode: 'insensitive' } } },
              ],
            }
          : {},
        location
          ? {
              location: { contains: location, mode: 'insensitive' },
            }
          : {},
      ],
    };

    const professionals = await prisma.profile.findMany({
      where,
      include: {
        user: true,
        ratings: true,
      },
    });

    res.json(professionals);
  } catch (err) {
    console.error('Error in GET /api/professionals', err);
    res.status(500).json({ error: 'Failed to fetch professionals' });
  }
});

/**
 * Admin: list all PENDING (unverified) professionals
 */
router.get('/admin/pending/list', auth, adminOnly, async (req, res) => {
  try {
    const pending = await prisma.profile.findMany({
      where: { verified: false },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    res.json(pending);
  } catch (e) {
    console.error('Error fetching pending professionals', e);
    res.status(500).json({ error: 'Failed to fetch pending professionals' });
  }
});

/**
 * Admin: verify a professional
 * PUT /api/professionals/admin/verify/:id
 */
router.put('/admin/verify/:id', auth, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const profile = await prisma.profile.update({
      where: { id },
      data: { verified: true },
    });

    res.json({ success: true, profile });
  } catch (e) {
    console.error('Error verifying professional', e);
    res.status(500).json({ error: 'Failed to verify professional' });
  }
});

/**
 * Public: get single professional by id
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const professional = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: true,
        ratings: true,
      },
    });

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.json(professional);
  } catch (err) {
    console.error('Error in GET /api/professionals/:id', err);
    res.status(500).json({ error: 'Failed to fetch professional' });
  }
});

module.exports = router;
