const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userAgent: { type: String, default: '' },
  screen: { type: String, default: '' },
  webdriver: { type: Boolean, default: false },
  language: { type: String, default: '' },
  interactions: { type: Number, default: 0 },
  viewability: { type: Number, default: 0 },
}, { _id: false });

const eventSchema = new mongoose.Schema({
  event: { type: String, required: true, index: true },
  publisher_id: { type: String, required: true, index: true },
  url: { type: String, default: '' },
  referrer: { type: String, default: '' },
  
  // Data dari client
  client: clientSchema,
  
  // Metadata dari server
  ip: { type: String, required: true },
  asn: {
    number: { type: Number },
    organization: { type: String },
  },
  geo: {
    country: { type: String },
    city: { type: String },
  },

  // Hasil Analisis Fraud
  fraud_score: { type: Number, index: true },
  flags: [String],
  
  // Timestamp
  ts: { type: Date, default: Date.now },
});

// Indeks untuk query umum
eventSchema.index({ publisher_id: 1, ts: -1 });
eventSchema.index({ ip: 1, ts: -1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
