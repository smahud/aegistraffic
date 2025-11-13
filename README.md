# AegisTraffic

> Sistem deteksi traffic palsu & analytics engine mirip Google Analytics + AdSense anti-fraud.

AegisTraffic adalah sistem yang dirancang untuk mendeteksi traffic palsu (bot, _exchange_, _datacenter_), mengukur perilaku pengguna secara _real-time_, dan memberikan skor kepercayaan untuk setiap _event_.

## 🚀 Fitur Utama

- **Deteksi Fraud**: Menggunakan sistem penilaian berbasis aturan untuk mengidentifikasi aktivitas mencurigakan.
- **Analitik Real-time**: _Dashboard_ untuk memvisualisasikan data traffic dan melihat laporan fraud.
- **Modular & Skalabel**: Arsitektur _microservice_ yang dapat dikembangkan secara bertahap.
- **Self-Hosted**: Kontrol penuh atas data Anda, tanpa ketergantungan pada layanan pihak ketiga.

## 🧱 Arsitektur

Sistem ini terdiri dari beberapa komponen utama:

1.  **`client/tracker.js`**: Skrip pelacak yang dipasang di situs _publisher_ untuk mengumpulkan metrik pengguna.
2.  **`server/collector.js`**: API _endpoint_ yang menerima data, memperkaya dengan metadata (IP, Geo, ASN), dan memanggil _Fraud Engine_.
3.  **`server/fraud-engine.js`**: Menghitung `fraud_score` berdasarkan serangkaian aturan.
4.  **`dashboard/`**: _Frontend_ untuk visualisasi data dan laporan.
5.  **`worker/`**: Layanan latar belakang untuk analisis _batch_ dan pengiriman _alert_.

## 🧮 Alur Data & Konsep Scoring

Alur data dimulai dari `tracker.js` yang mengirim _payload_ ke `Collector API`. API kemudian memvalidasi, memperkaya, dan menganalisis data menggunakan _Fraud Engine_ untuk menghasilkan `fraud_score`.

**Konsep Scoring Dasar:**

| Flag                    | Kondisi                                | Bobot |
| ----------------------- | -------------------------------------- | ----- |
| `datacenter_asn`        | IP dari AWS, Azure, GCP                | +30   |
| `webdriver_true`        | `navigator.webdriver = true`           | +40   |
| `no_interaction`        | Tidak ada klik/scroll/mousemove        | +25   |
| `duplicate_fingerprint` | _Fingerprint_ muncul >100x             | +20   |
| `fast_conversion`       | Klik → konversi < 2 detik              | +25   |

**Klasifikasi Skor:**

- **0–30 (Aman)**: Traffic dianggap valid.
- **31–60 (Mencurigakan)**: Perlu ditinjau manual.
- **61–100 (Bot)**: Kemungkinan besar fraud, blokir.

---

Untuk memulai, saya akan membuat file-file lain yang diperlukan untuk proyek ini.
