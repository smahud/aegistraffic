(function() {
  // Hindari polusi scope global
  'use strict';

  // --- Konfigurasi ---
  const API_ENDPOINT = 'https://collector.aegistraffic.com/api/collect'; // URL server kolektor Anda
  const currentScript = document.currentScript;
  if (!currentScript) {
    console.error('AegisTraffic: Tidak dapat menemukan script tag.');
    return;
  }
  const PUBLISHER_ID = currentScript.getAttribute('data-pub');
  if (!PUBLISHER_ID) {
    console.error('AegisTraffic: Atribut data-pub tidak ditemukan pada script tag.');
    return;
  }

  // --- Variabel untuk Mengumpulkan Data ---
  let interactionCount = 0;
  let maxViewability = 0;
  let hasInteracted = false;

  // --- Fungsi Pengumpul ---

  /**
   * Menangani interaksi pengguna untuk menghitungnya.
   * Dibuat agar hanya berjalan beberapa kali untuk efisiensi.
   */
  function handleInteraction() {
    interactionCount++;
    hasInteracted = true;
    // Hapus listener setelah beberapa interaksi untuk menghemat resource
    if (interactionCount > 10) {
      document.removeEventListener('mousemove', handleInteraction, { passive: true });
      document.removeEventListener('scroll', handleInteraction, { passive: true });
      document.removeEventListener('click', handleInteraction, { passive: true });
    }
  }

  /**
   * Menggunakan IntersectionObserver untuk mengukur seberapa banyak elemen terlihat.
   */
  function setupViewabilityTracker() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > maxViewability) {
          maxViewability = entry.intersectionRatio;
        }
      });
    }, {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100) // Amati setiap perubahan 1%
    });

    // Amati body sebagai target default
    observer.observe(document.body);
  }

  /**
   * Mengumpulkan semua data yang relevan ke dalam satu objek.
   */
  function gatherPayload() {
    return {
      event: 'page_view', // Event default saat halaman dimuat
      publisher_id: PUBLISHER_ID,
      url: window.location.href,
      referrer: document.referrer,
      client: {
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        webdriver: navigator.webdriver || false,
        language: navigator.language,
        interactions: interactionCount,
        viewability: Math.round(maxViewability * 100), // Kirim sebagai persen (0-100)
      },
      ts: Date.now()
    };
  }

  /**
   * Mengirim data ke server kolektor.
   * Menggunakan navigator.sendBeacon jika memungkinkan untuk pengiriman yang andal saat unload.
   */
  function sendData(payload) {
    const data = JSON.stringify(payload);
    
    // Gunakan sendBeacon jika tersedia, karena lebih andal untuk analitik
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_ENDPOINT, new Blob([data], { type: 'application/json' }));
    } else {
      // Fallback ke fetch untuk browser lama
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true, // Penting untuk permintaan saat unload
      }).catch(err => console.error('AegisTraffic: Gagal mengirim data.', err));
    }
  }

  // --- Inisialisasi ---

  // 1. Tambahkan listener untuk interaksi pengguna
  document.addEventListener('mousemove', handleInteraction, { passive: true, once: false });
  document.addEventListener('scroll', handleInteraction, { passive: true, once: false });
  document.addEventListener('click', handleInteraction, { passive: true, once: false });

  // 2. Mulai lacak viewability
  setupViewabilityTracker();

  // 3. Kirim data awal saat halaman dimuat
  // Tunggu sebentar agar viewability sempat diukur
  setTimeout(() => {
    sendData(gatherPayload());
  }, 500);

  // 4. (Opsional) Kirim data saat pengguna akan meninggalkan halaman
  // Ini berguna untuk mendapatkan data interaksi & viewability final
  // window.addEventListener('beforeunload', () => {
  //   sendData(gatherPayload());
  // });

  console.log('AegisTraffic Tracker initialised for:', PUBLISHER_ID);

})();
