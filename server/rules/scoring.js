/**
 * Peta bobot untuk setiap flag fraud.
 * Nilai yang lebih tinggi menunjukkan indikasi fraud yang lebih kuat.
 */
const FRAUD_WEIGHTS = {
  // Network-related flags
  'datacenter_asn': 30,
  'blacklisted_ip': 50,
  'abnormal_referrer': 10,
  'tor_network': 40,

  // Device-related flags
  'webdriver_true': 40,
  'duplicate_fingerprint': 20,
  'unrealistic_screen': 15,
  'missing_headers': 10,

  // Behavior-related flags
  'no_interaction': 25,
  'low_interaction': 15,
  'fast_conversion': 25,
  'short_duration': 20,
  'high_velocity': 35, // Terlalu banyak event dari IP/user yang sama dalam waktu singkat
};

/**
 * Menghitung skor fraud total berdasarkan array flag yang terdeteksi.
 * @param {string[]} flags - Array berisi flag fraud yang unik.
 * @returns {number} - Skor fraud total, dari 0 hingga 100.
 */
function calculateScore(flags) {
  let totalScore = 0;

  for (const flag of flags) {
    if (FRAUD_WEIGHTS[flag]) {
      totalScore += FRAUD_WEIGHTS[flag];
    }
  }

  // Batasi skor maksimal di 100
  return Math.min(totalScore, 100);
}

module.exports = {
  calculateScore,
  FRAUD_WEIGHTS,
};
