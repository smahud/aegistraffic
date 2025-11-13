// Dalam aplikasi nyata, pengecekan fingerprint akan memerlukan query ke database (misalnya, Redis atau MongoDB)
// untuk menghitung kemunculan. Di sini kita akan simulasikan.
async function checkDuplicateFingerprint(fingerprint) {
  // SIMULASI: Anggap saja kita melakukan query ke DB
  // const count = await FingerprintModel.count({ hash: fingerprint });
  // return count > 100; // threshold
  if (fingerprint === 'simulated_duplicate_fingerprint_hash') {
    return true;
  }
  return false;
}

/**
 * Menjalankan aturan berbasis perangkat/browser untuk mendeteksi fraud.
 * @param {object} eventData - Data event yang diperkaya.
 * @returns {Promise<string[]>} - Array berisi flag fraud perangkat yang terdeteksi.
 */
async function run(eventData) {
  const flags = [];
  const { client } = eventData;

  if (!client) {
    return flags;
  }

  // Aturan 1: Deteksi headless browser melalui navigator.webdriver
  if (client.webdriver === true) {
    flags.push('webdriver_true');
  }

  // Aturan 2: Cek ukuran layar yang tidak realistis (terlalu kecil atau tidak ada)
  if (!client.screen || client.screen.startsWith('0x') || client.screen.length < 3) {
      flags.push('unrealistic_screen');
  }

  // Aturan 3: Cek User-Agent kosong
  if (!client.userAgent || client.userAgent.length < 10) {
    flags.push('missing_headers'); // Menggunakan flag 'missing_headers' untuk ini
  }

  // Aturan 4: Cek fingerprint duplikat (memerlukan state/database)
  if (client.fingerprint) {
    const isDuplicate = await checkDuplicateFingerprint(client.fingerprint);
    if (isDuplicate) {
      flags.push('duplicate_fingerprint');
    }
  }

  return flags;
}

module.exports = {
  run,
};
