const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Simple auth middleware
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

/**
 * Create a booking (patient → professional)
 * We’ll use this later when we build the booking button.
 */
router.post('/', auth, async (req, res) => {
  try {
    const { professionalId, start, end, notes } = req.body;

    if (req.user.role !== 'PATIENT') {
      return res
        .status(403)
        .json({ error: 'Only patients can create bookings' });
    }

    if (!professionalId || !start || !end) {
      return res
        .status(400)
        .json({ error: 'professionalId, start and end are required' });
    }

    const booking = await prisma.booking.create({
      data: {
        patientId: req.user.id,
        professionalId: Number(professionalId),
        start: new Date(start),
        end: new Date(end),
        status: 'PENDING', // assuming enum BookingStatus with PENDING
        notes: notes || null,
      },
    });

    res.json(booking);
  } catch (e) {
    console.error('Error creating booking', e);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/**
 * Get ALL bookings for the logged-in PATIENT
 * Used by the patient dashboard.
 */
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PATIENT') {
      return res
        .status(403)
        .json({ error: 'Only patients can view this list' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        patientId: req.user.id,
      },
      orderBy: {
        start: 'asc',
      },
      // We keep this simple; later we can include professional names if needed
      // include: { professional: { include: { user: true } } },
    });

    res.json(bookings);
  } catch (e) {
    console.error('Error fetching patient bookings', e);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;
