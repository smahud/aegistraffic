const express = require('express');
const mongoose = require('mongoose');
const collectorRoutes = require('./collector');

// --- Konfigurasi ---
const PORT = process.env.PORT || 3000;
// Dalam produksi, gunakan URI dari environment variable
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aegistraffic';

// --- Inisialisasi Aplikasi Express ---
const app = express();

// --- Koneksi ke Database ---
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB.');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Keluar jika tidak bisa terhubung ke DB
});

// --- Middleware ---
// Middleware untuk logging request sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware untuk parsing body JSON (sudah ada di collector.js, tapi baik untuk ada di level global)
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.send('AegisTraffic Collector API is running.');
});

// Gunakan rute dari collector.js untuk endpoint /api
app.use('/api', collectorRoutes);

// --- Jalankan Server ---
app.listen(PORT, () => {
  console.log(`AegisTraffic server listening on port ${PORT}`);
});
