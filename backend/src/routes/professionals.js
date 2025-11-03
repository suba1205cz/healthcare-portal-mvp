const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1) PATIENT/BROWSER: list professionals (ONLY APPROVED)
router.get('/', async (req, res) => {
  const { q, location } = req.query;

  const professionals = await prisma.profile.findMany({
    where: {
      isApproved: true, // only show approved profiles
      AND: [
        q
          ? {
              OR: [
                { specialties: { contains: q, mode: 'insensitive' } },
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
    },
    include: { user: true },
  });

  res.json(professionals);
});

// 2) PUBLIC: get one professional
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { user: true, availabilities: true },
  });
  if (!profile) return res.status(404).json({ error: 'Not found' });
  res.json(profile);
});

// 3) PROFESSIONAL REGISTERS (from /register-professional page)
router.post('/', async (req, res) => {
  const {
    userId,
    specialties,
    location,
    hourlyRate,
    idProofUrl,
    addressProofUrl,
    qualification,
  } = req.body;

  try {
    const profile = await prisma.profile.create({
      data: {
        userId: Number(userId),
        bio: '',
        specialties,
        location,
        hourlyRate: Number(hourlyRate) || 0,
        isApproved: false, // start as NOT approved
        // these 3 will only work if you added them to Prisma schema
        idProofUrl,
        addressProofUrl,
        qualification,
      },
    });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not create professional profile' });
  }
});

const { requireAuth } = require('../middleware/auth');

// ...existing routes...

// Get current user's professional profile (requires token)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: { user: true },
    });
    if (!profile) return res.status(404).json({ error: 'No profile found' });
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Optionally get a profile by user id (no auth required if you prefer)
router.get('/by-user/:userId', async (req, res) => {
  try {
    const uid = Number(req.params.userId);
    const profile = await prisma.profile.findUnique({
      where: { userId: uid },
      include: { user: true },
    });
    if (!profile) return res.status(404).json({ error: 'No profile found' });
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
