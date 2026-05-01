# Booking Test — Playwright

Test otomatis untuk mendeteksi bug pada data booking.

## Cara Menjalankan

```bash
# 1. Install library (lakukan sekali saja)
npm install

# 2. Jalankan semua test
npm test

# Jalankan per group
npm run test:tc001    ← hanya double booking
npm run test:tc002    ← hanya cek harga

# Buka laporan hasil di browser
npm run test:laporan
```

## Test Cases

| ID | Deskripsi |
|----|-----------|
| TC-001-01 | Harus ada double booking yang terdeteksi |
| TC-001-02 | Yang bentrok adalah BK/000001 dan BK/000005 |
| TC-001-03 | Jika semua booking di jam berbeda, tidak ada konflik |
| TC-002-01 | Harus ada harga yang tidak sesuai terdeteksi |
| TC-002-02 | BK/000001 harus terdeteksi karena harganya salah |
| TC-002-03 | BK/000001 harusnya Rp 1.000.000 bukan Rp 1.200.000 |
| TC-002-04 | BK/000005 tidak boleh masuk daftar harga salah |
