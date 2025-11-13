// Daftar hitam sederhana untuk contoh. Dalam produksi, ini bisa dari database atau file.
const BLACKLISTED_REFERRERS = new Set([
  'trafficexchange.io',
  'bot-traffic.com',
  'free-hits.org',
]);

const DATACENTER_ASN_KEYWORDS = ['AMAZON', 'GOOGLE', 'MICROSOFT', 'AZURE', 'OVH', 'HETZNER', 'DIGITALOCEAN'];

/**
 * Menjalankan aturan berbasis jaringan untuk mendeteksi fraud.
 * @param {object} eventData - Data event yang diperkaya.
 * @returns {Promise<string[]>} - Array berisi flag fraud jaringan yang terdeteksi.
 */
async function run(eventData) {
  const flags = [];
  const { asn, referrer, url } = eventData;

  // Aturan 1: Cek apakah ASN berasal dari datacenter yang umum
  if (asn && asn.organization) {
    const orgUpper = asn.organization.toUpperCase();
    if (DATACENTER_ASN_KEYWORDS.some(keyword => orgUpper.includes(keyword))) {
      flags.push('datacenter_asn');
    }
  }

  // Aturan 2: Cek referrer yang masuk daftar hitam
  if (referrer) {
    try {
      const referrerHost = new URL(referrer).hostname.replace(/^www\./, '');
      if (BLACKLISTED_REFERRERS.has(referrerHost)) {
        flags.push('blacklisted_referrer');
      }
    } catch (e) {
      // Abaikan jika URL referrer tidak valid
    }
  }

  // Aturan 3: Referrer kosong tapi bukan akses langsung (anomali)
  // (URL harus memiliki path, bukan hanya domain utama)
  if (!referrer && url) {
    try {
      const pageUrl = new URL(url);
      if (pageUrl.pathname !== '/' && pageUrl.pathname !== '') {
        flags.push('abnormal_referrer');
      }
    } catch(e) {
      // Abaikan jika URL tidak valid
    }
  }
  
  // Catatan: Cek IP Blacklist bisa ditambahkan di sini,
  // misalnya dengan query ke database atau layanan eksternal.
  // if (await isIpBlacklisted(ip)) {
  //   flags.push('blacklisted_ip');
  // }

  return flags;
}

module.exports = {
  run,
};
