require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const professionalRoutes = require('./routes/professionals');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin'); // 👈 new

const app = express();

app.use(cors());
app.use(express.json());

// optional health-check
app.get('/', (req, res) => {
  res.json({ message: 'Healthcare API is running' });
});

// register routes
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes); // 👈 admin goes here

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

app.use('/api/availability', require('./routes/availability'));
