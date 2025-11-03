// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/admin/pending-professionals
// show those who are NOT approved and NOT rejected
router.get(
  '/pending-professionals',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const pending = await prisma.profile.findMany({
        where: {
          isApproved: false,
          isRejected: false,
        },
        include: { user: true },
      });
      res.json(pending);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not fetch pending professionals' });
    }
  }
);

// PATCH /api/admin/approve/:id
router.patch(
  '/approve/:id',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const id = Number(req.params.id);
    try {
      const updated = await prisma.profile.update({
        where: { id },
        data: {
          isApproved: true,
          isRejected: false,
          rejectionReason: null,
        },
      });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Could not approve professional' });
    }
  }
);

// PATCH /api/admin/reject/:id
router.patch(
  '/reject/:id',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    const id = Number(req.params.id);
    const { reason } = req.body; // { "reason": "ID not clear" }
    try {
      const updated = await prisma.profile.update({
        where: { id },
        data: {
          isRejected: true,
          isApproved: false,
          rejectionReason: reason || 'Rejected by admin',
        },
      });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Could not reject professional' });
    }
  }
);

module.exports = router;
