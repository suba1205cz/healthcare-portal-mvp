// backend/src/routes/availability.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * POST /api/availability
 * body: { profileId, start, end }
 * profileId = professional's Profile.id
 */
router.post('/', async (req, res) => {
  const { profileId, start, end } = req.body;

  if (!profileId || !start || !end) {
    return res.status(400).json({ error: 'profileId, start and end are required' });
  }

  try {
    const slot = await prisma.availability.create({
      data: {
        profileId: Number(profileId),
        start: new Date(start),
        end: new Date(end),
        isBooked: false,
      },
    });
    res.json(slot);
  } catch (err) {
    console.error('Error creating availability:', err);
    res.status(500).json({ error: 'Could not create availability' });
  }
});

/**
 * GET /api/availability?profileId=1
 * list all slots for one professional
 */
router.get('/', async (req, res) => {
  const { profileId } = req.query;
  const where = profileId ? { profileId: Number(profileId) } : {};
  const slots = await prisma.availability.findMany({
    where,
    orderBy: { start: 'asc' },
  });
  res.json(slots);
});

module.exports = router;
