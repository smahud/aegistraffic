const networkRules = require('./rules/networkRules');
const deviceRules = require('./rules/deviceRules');
const behaviorRules = require('./rules/behaviorRules');
const { calculateScore } = require('./rules/scoring');

/**
 * Menganalisis sebuah event dan menghitung skor fraud.
 * @param {object} eventData - Data event yang telah diperkaya (termasuk IP, ASN, Geo, dll.).
 * @returns {Promise<{fraud_score: number, flags: string[]}>} - Hasil analisis.
 */
async function analyzeEvent(eventData) {
  const flags = [];

  // 1. Jalankan semua aturan secara paralel
  const [networkFlags, deviceFlags, behaviorFlags] = await Promise.all([
    networkRules.run(eventData),
    deviceRules.run(eventData),
    behaviorRules.run(eventData),
  ]);

  // 2. Gabungkan semua flag yang terdeteksi
  flags.push(...networkFlags, ...deviceFlags, ...behaviorFlags);

  // 3. Hapus duplikat jika ada
  const uniqueFlags = [...new Set(flags)];

  // 4. Hitung skor akhir berdasarkan flag yang terkumpul
  const fraud_score = calculateScore(uniqueFlags);

  return {
    fraud_score,
    flags: uniqueFlags,
  };
}

module.exports = {
  analyzeEvent,
};
