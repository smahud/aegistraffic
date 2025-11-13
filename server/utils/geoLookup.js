// Data simulasi untuk beberapa IP.
const MOCK_DB = {
  '54.221.111.12': { // IP AWS yang umum
    geo: { country: 'US', city: 'Ashburn' },
    asn: { number: 14618, organization: 'AMAZON-AES' },
  },
  '8.8.8.8': { // IP Google DNS
    geo: { country: 'US', city: 'Mountain View' },
    asn: { number: 15169, organization: 'GOOGLE' },
  },
  '103.102.164.10': { // IP dari Indonesia
    geo: { country: 'ID', city: 'Jakarta' },
    asn: { number: 45839, organization: 'ID-NIC' },
  },
};

/**
 * Mensimulasikan lookup Geo & ASN dari sebuah alamat IP.
 * @param {string} ip - Alamat IP yang akan dicari.
 * @returns {Promise<{geo: object, asn: object}>} - Hasil lookup.
 */
async function lookup(ip) {
  // Dalam aplikasi nyata, di sini kita akan memanggil library MaxMind atau API eksternal.
  // const reader = await open(DB_PATH);
  // const response = reader.city(ip);

  if (MOCK_DB[ip]) {
    return MOCK_DB[ip];
  }

  // Jika IP tidak ada di DB mock, kembalikan data default.
  // Hindari mengembalikan null/undefined agar struktur data konsisten.
  return {
    geo: { country: 'Unknown', city: 'Unknown' },
    asn: { number: null, organization: 'Unknown' },
  };
}

module.exports = {
  lookup,
};
