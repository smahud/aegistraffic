/**
 * Mengambil alamat IP klien dari objek request Express.
 * Memperhatikan header 'x-forwarded-for' jika aplikasi berjalan di belakang proxy.
 * @param {object} req - Objek request Express.
 * @returns {string} - Alamat IP klien.
 */
function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  
  if (forwardedFor) {
    // Header 'x-forwarded-for' bisa berisi daftar IP: "client, proxy1, proxy2"
    // IP klien yang sebenarnya adalah yang paling kiri.
    return forwardedFor.split(',')[0].trim();
  }
  
  // Fallback ke remoteAddress jika tidak ada header proxy.
  return req.connection.remoteAddress || req.socket.remoteAddress;
}

module.exports = {
  getClientIp,
};
