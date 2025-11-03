// backend/src/routes/availability.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { requireAuth } = require('../middleware/auth');

/**
 * Helper: ensure the logged-in user has a Profile and return it.
 * Most availability actions are for professionals.
 */
async function getOrCreateProfileForUser(userId) {
  const existing = await prisma.profile.findUnique({ where: { userId } });
  if (existing) return existing;

  // If no profile exists yet, create a minimal one (not approved by default)
  return prisma.profile.create({
    data: {
      userId,
      bio: '',
      specialties: '',
      location: '',
      hourlyRate: 0,
      isApproved: false,
      isRejected: false,
    },
  });
}

/**
 * POST /api/availability
 * Create a new availability slot for the logged-in professional.
 * Body: { start: ISO string, end: ISO string }
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { start, end } = req.body;

    if (!start || !end) {
      return res.status(400).json({ error: 'start and end are required' });
    }

    const profile = await getOrCreateProfileForUser(userId);

    const slot = await prisma.availability.create({
      data: {
        profileId: profile.id,
        start: new Date(start),
        end: new Date(end),
        isBooked: false,
      },
    });

    res.json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create availability' });
  }
});

/**
 * GET /api/availability/mine
 * List all availability slots for the logged-in professional.
 */
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.json([]);

    const slots = await prisma.availability.findMany({
      where: { profileId: profile.id },
      orderBy: { start: 'asc' },
    });

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch availability' });
  }
});

/**
 * DELETE /api/availability/:id
 * Delete one of your own availability slots.
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user.id);

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const slot = await prisma.availability.findUnique({ where: { id } });
    if (!slot || slot.profileId !== profile.id) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    await prisma.availability.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete availability' });
  }
});

/**
 * (Optional) GET /api/availability/search?start=...&end=...
 * Find approved professionals who have availability in a time window.
 */
router.get('/search', async (req, res) => {
  try {
    const { start, end, location, q } = req.query;

    const whereAvail = {};
    if (start) whereAvail.start = { gte: new Date(start) };
    if (end) whereAvail.end = { lte: new Date(end) };
    whereAvail.isBooked = false;

    const profiles = await prisma.profile.findMany({
      where: {
        isApproved: true,
        isRejected: false,
        AND: [
          location
            ? { location: { contains: String(location), mode: 'insensitive' } }
            : {},
          q
            ? {
                OR: [
                  { specialties: { contains: String(q), mode: 'insensitive' } },
                  { user: { name: { contains: String(q), mode: 'insensitive' } } },
                ],
              }
            : {},
        ],
      },
      include: {
        user: true,
        availabilities: {
          where: whereAvail,
          orderBy: { start: 'asc' },
        },
      },
    });

    // Only return profiles that actually have free slots in the window
    const withOpenSlots = profiles.filter(p => (p.availabilities || []).length > 0);
    res.json(withOpenSlots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not search availability' });
  }
});

module.exports = router;
