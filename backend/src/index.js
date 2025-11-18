require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const professionalRoutes = require('./routes/professionals');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin'); // existing admin routes (if you use them)
const availabilityRoutes = require('./routes/availability'); // NEW

const app = express();

app.use(cors());
app.use(express.json());

// Optional health-check
app.get('/', (req, res) => {
  res.json({ message: 'Healthcare API is running' });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes); // admin endpoints (if you have them)
app.use('/api/availability', availabilityRoutes); // availability endpoints

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
