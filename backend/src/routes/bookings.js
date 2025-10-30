const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', auth, async (req, res) => {
  const { professionalId, start, end } = req.body;
  const booking = await prisma.booking.create({
    data: {
      patientId: req.user.id,
      professionalId,
      start: new Date(start),
      end: new Date(end),
    }
  });
  res.json(booking);
});

router.get('/mine', auth, async (req, res) => {
  const bookings = await prisma.booking.findMany({ where: { patientId: req.user.id }, include: { professional: true } });
  res.json(bookings);
});

module.exports = router;
