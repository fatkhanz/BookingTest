// ============================================================
// TC-002 | Cek Harga Booking
//
// TC-002-01 | Harus ada harga yang tidak sesuai terdeteksi
// TC-002-02 | BK/000001 harus terdeteksi karena harganya salah
// TC-002-03 | BK/000001 harusnya Rp 1.000.000 bukan Rp 1.200.000
// TC-002-04 | BK/000005 tidak boleh masuk daftar harga salah
// ============================================================

const { test, expect, describe } = require('@playwright/test');

// ── Fungsi inti ────────────────────────────────────────────
// Bandingkan harga booking vs harga jadwal
function cariHargaSalah(daftarBooking, daftarJadwal) {
  const salah = [];

  for (const booking of daftarBooking) {
    const jadwal = daftarJadwal.find(j =>
      j.venue_id   === booking.venue_id   &&
      j.date       === booking.date       &&
      j.start_time === booking.start_time &&
      j.end_time   === booking.end_time
    );

    if (jadwal && Number(booking.price) !== Number(jadwal.price)) {
      salah.push({
        booking_id    : booking.booking_id,
        harga_booking : Number(booking.price),
        harga_jadwal  : Number(jadwal.price),
      });
    }
  }

  return salah;
}

// ── Data ───────────────────────────────────────────────────
const DATA_BOOKING = [
  // BK/000001 → harga salah (1.200.000, harusnya 1.000.000)
  { booking_id: 'BK/000001', venue_id: '15', date: '2022-12-10', start_time: '09:00:00', end_time: '11:00:00', price: 1200000 },
  // BK/000005 → harga sudah benar (1.000.000)
  { booking_id: 'BK/000005', venue_id: '15', date: '2022-12-10', start_time: '09:00:00', end_time: '11:00:00', price: 1000000 },
];

const DATA_JADWAL = [
  { venue_id: '15', date: '2022-12-10', start_time: '07:00:00', end_time: '09:00:00', price: 800000  },
  { venue_id: '15', date: '2022-12-10', start_time: '09:00:00', end_time: '11:00:00', price: 1000000 },
  { venue_id: '15', date: '2022-12-10', start_time: '11:00:00', end_time: '13:00:00', price: 1200000 },
];

// ── Test Cases ─────────────────────────────────────────────
describe('TC-002 | Cek Harga Booking', () => {

  test('TC-002-01 | Harus ada harga yang tidak sesuai terdeteksi', () => {
    const salah = cariHargaSalah(DATA_BOOKING, DATA_JADWAL);

    expect(
      salah.length,
      '❌ Tidak ada harga salah yang terdeteksi, padahal seharusnya ada'
    ).toBeGreaterThan(0);
  });

  test('TC-002-02 | BK/000001 harus terdeteksi karena harganya salah', () => {
    const salah = cariHargaSalah(DATA_BOOKING, DATA_JADWAL);
    const ids   = salah.map(s => s.booking_id);

    expect(
      ids,
      `❌ BK/000001 tidak masuk daftar harga salah. Terdeteksi: ${ids.join(', ') || '(kosong)'}`
    ).toContain('BK/000001');
  });

  test('TC-002-03 | BK/000001 harusnya Rp 1.000.000 bukan Rp 1.200.000', () => {
    const salah = cariHargaSalah(DATA_BOOKING, DATA_JADWAL);
    const bk001 = salah.find(s => s.booking_id === 'BK/000001');

    expect(bk001, '❌ BK/000001 tidak ditemukan dalam daftar harga salah').toBeDefined();
    expect(bk001.harga_booking, '❌ Harga yang tersimpan seharusnya 1.200.000').toBe(1200000);
    expect(bk001.harga_jadwal,  '❌ Harga yang benar seharusnya 1.000.000').toBe(1000000);
  });

  test('TC-002-04 | BK/000005 tidak boleh masuk daftar harga salah', () => {
    const salah = cariHargaSalah(DATA_BOOKING, DATA_JADWAL);
    const ids   = salah.map(s => s.booking_id);

    expect(
      ids,
      '❌ BK/000005 harganya sudah benar, tapi ikut terdeteksi salah'
    ).not.toContain('BK/000005');
  });

});
