const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /api/admin/users
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: { id: 'asc' },
  });
  res.json(users);
});

// GET /api/admin/professionals
router.get('/professionals', requireAuth, requireAdmin, async (req, res) => {
  const pros = await prisma.profile.findMany({
    include: {
      user: true,
      availabilities: true,
    },
    orderBy: { id: 'asc' },
  });
  res.json(pros);
});

module.exports = router;
