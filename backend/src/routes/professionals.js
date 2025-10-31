const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const { q, location } = req.query;
  const professionals = await prisma.profile.findMany({
    where: {
      OR: [
        { specialties: { contains: q || '' } },
        { location: { contains: location || '' } }
      ]
    },
    include: { user: true }
  });
  res.json(professionals);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const profile = await prisma.profile.findUnique({ where: { id }, include: { user: true } });
  res.json(profile);
});

module.exports = router;



router.post('/', async (req, res) => {
  const { userId, category, specialties, location, hourlyRate } = req.body;
  try {
    const profile = await prisma.profile.create({
      data: {
        userId: Number(userId),
        bio: '',
        specialties,
        location,
        hourlyRate: Number(hourlyRate) || 0,
        // if you added category to schema, add it here too
      },
    });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not create professional profile' });
  }
});
