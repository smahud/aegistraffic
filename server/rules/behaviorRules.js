/**
 * Menjalankan aturan berbasis perilaku pengguna untuk mendeteksi fraud.
 * @param {object} eventData - Data event yang diperkaya.
 * @returns {Promise<string[]>} - Array berisi flag fraud perilaku yang terdeteksi.
 */
async function run(eventData) {
  const flags = [];
  const { client, event, ts } = eventData;

  if (!client) {
    return flags;
  }

  // Aturan 1: Tidak ada interaksi sama sekali (tidak ada klik, scroll, atau gerakan mouse)
  if (client.interactions === 0) {
    flags.push('no_interaction');
  }
  // Aturan 2: Interaksi sangat rendah, yang mungkin menunjukkan skrip sederhana
  else if (client.interactions > 0 && client.interactions <= 2) {
    flags.push('low_interaction');
  }

  // Aturan 3: Visibilitas konten sangat rendah
  // Menandakan iklan atau konten penting tidak pernah benar-benar dilihat oleh pengguna
  if (typeof client.viewability !== 'undefined' && client.viewability < 10) {
      flags.push('low_viewability');
  }

  // Aturan 4: Konversi terjadi terlalu cepat setelah klik (placeholder)
  // Logika ini memerlukan akses ke event sebelumnya dari user/sesi yang sama.
  // Contoh: if (event === 'conversion' && (ts - previousClickTimestamp < 2000)) {
  //   flags.push('fast_conversion');
  // }
  
  // Aturan 5: Durasi kunjungan terlalu singkat (placeholder)
  // Logika ini biasanya dihitung saat menerima event 'unload' atau 'heartbeat'.
  // Contoh: if (event === 'page_exit' && eventData.duration < 5000) { // < 5 detik
  //   flags.push('short_duration');
  // }

  return flags;
}

module.exports = {
  run,
};
