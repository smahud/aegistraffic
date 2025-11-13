const express = require('express');
const Event = require('./models/Event');
const { analyzeEvent } = require('./fraud-engine');
const geoLookup = require('./utils/geoLookup'); // Asumsi utilitas ini ada
const { getClientIp } = require('./utils/ipTools'); // Asumsi utilitas ini ada

const router = express.Router();

// Middleware untuk memastikan body adalah JSON
router.use(express.json());

/**
 * POST /collect
 * Endpoint utama untuk menerima data dari tracker.js
 */
router.post('/collect', async (req, res) => {
  try {
    const payload = req.body;

    // 1. Validasi payload dasar
    if (!payload.publisher_id || !payload.event) {
      return res.status(400).json({ status: 'error', message: 'publisher_id and event are required' });
    }

    // 2. Ambil IP dan lakukan lookup Geo/ASN
    const ip = getClientIp(req);
    const geoData = await geoLookup.lookup(ip); // Mendapatkan info ASN & Geo

    // 3. Gabungkan semua data untuk dianalisis
    const eventDataForAnalysis = {
      ...payload,
      ip,
      ...geoData, // Menambahkan { asn, geo }
    };
    
    // 4. Panggil Fraud Engine untuk mendapatkan skor dan flag
    const { fraud_score, flags } = await analyzeEvent(eventDataForAnalysis);

    // 5. Buat entri baru untuk disimpan di database
    const newEvent = new Event({
      ...payload,
      ip,
      asn: geoData.asn,
      geo: geoData.geo,
      fraud_score,
      flags,
      ts: new Date(payload.ts || Date.now()),
    });

    // 6. Simpan ke MongoDB (tanpa menunggu selesai untuk respons cepat)
    newEvent.save().catch(err => {
      // Log error jika penyimpanan gagal, tapi jangan blokir respons
      console.error('Failed to save event to DB:', err);
    });
    
    // 7. Kirim respons kembali ke client
    res.status(200).json({
      status: 'ok',
      fraud_score,
      flags,
      event_id: newEvent._id, // Opsional: kirim ID event
    });

  } catch (error) {
    console.error('Collector API Error:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
