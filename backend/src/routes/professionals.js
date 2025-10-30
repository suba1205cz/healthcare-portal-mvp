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
