// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();

// Placeholder admin API route.
// We moved most admin logic into other routes (like /api/professionals/admin/...)
// This file only exists so that index.js can safely require('/routes/admin').
router.get('/ping', (req, res) => {
  res.json({ message: 'Admin API is working' });
});

module.exports = router;
