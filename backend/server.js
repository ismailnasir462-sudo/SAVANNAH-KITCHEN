const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dns = require('dns');

// Force IPv4 resolution to prevent local DB / network lookup delays
dns.setDefaultResultOrder('ipv4first');

// Use Google Public DNS servers directly for domain resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// --- Middleware Configuration ---
// Enable CORS for Vercel, ngrok tunnels, mobile apps, and local development
app.use(cors({
  origin: true, // Dynamically reflects origin request header
  credentials: true
}));

// Increase JSON and URL-encoded body limits to handle Base64 image uploads (10MB limit)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Base Route ---
app.get('/', (req, res) => {
  res.send({ status: 'API Running', message: 'Welcome to Savannah Kitchen Backend' });
});

// --- API Routes ---
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});