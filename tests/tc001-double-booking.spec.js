// ============================================================
// TC-001 | Cek Double Booking
//
// TC-001-01 | Harus ada double booking yang terdeteksi
// TC-001-02 | Yang bentrok adalah BK/000001 dan BK/000005
// TC-001-03 | Jika semua booking di jam berbeda, tidak ada konflik
// ============================================================

const { test, expect, describe } = require('@playwright/test');

// ── Fungsi inti ────────────────────────────────────────────
// Cari slot yang dipesan lebih dari satu kali
function cariDoubleBooking(daftarBooking) {
  const hitungan = {};

  for (const booking of daftarBooking) {
    const key = `${booking.venue_id}|${booking.date}|${booking.start_time}|${booking.end_time}`;
    if (!hitungan[key]) hitungan[key] = [];
    hitungan[key].push(booking.booking_id);
  }

  return Object.entries(hitungan)
    .filter(([_, ids]) => ids.length > 1)
    .map(([key, ids]) => {
      const [venue_id, date, start_time, end_time] = key.split('|');
      return { venue_id, date, start_time, end_time, booking_ids: ids };
    });
}

// ── Data ───────────────────────────────────────────────────
// Kondisi bug: BK/000001 dan BK/000005 di slot yang sama
const DATA_ADA_BENTROK = [
  { booking_id: 'BK/000001', venue_id: '15', date: '2022-12-10', start_time: '09:00:00', end_time: '11:00:00' },
  { booking_id: 'BK/000005', venue_id: '15', date: '2022-12-10', start_time: '09:00:00', end_time: '11:00:00' },
];

// Kondisi normal: semua booking di jam berbeda
const DATA_TIDAK_BENTROK = [
  { booking_id: 'BK/000010', venue_id: '15', date: '2022-12-10', start_time: '07:00:00', end_time: '09:00:00' },
  { booking_id: 'BK/000011', venue_id: '15', date: '2022-12-10', start_time: '09:00:00', end_time: '11:00:00' },
  { booking_id: 'BK/000012', venue_id: '15', date: '2022-12-10', start_time: '11:00:00', end_time: '13:00:00' },
];

// ── Test Cases ─────────────────────────────────────────────
describe('TC-001 | Double Booking', () => {

  test('TC-001-01 | Harus ada double booking yang terdeteksi', () => {
    const hasil = cariDoubleBooking(DATA_ADA_BENTROK);

    expect(
      hasil.length,
      '❌ Tidak ada double booking terdeteksi, padahal seharusnya ada'
    ).toBeGreaterThan(0);
  });

  test('TC-001-02 | Yang bentrok adalah BK/000001 dan BK/000005', () => {
    const hasil = cariDoubleBooking(DATA_ADA_BENTROK);
    const ids   = hasil[0].booking_ids;

    expect(ids, '❌ BK/000001 seharusnya ikut bentrok').toContain('BK/000001');
    expect(ids, '❌ BK/000005 seharusnya ikut bentrok').toContain('BK/000005');
  });

  test('TC-001-03 | Jika semua booking di jam berbeda, tidak ada konflik', () => {
    const hasil = cariDoubleBooking(DATA_TIDAK_BENTROK);

    expect(
      hasil.length,
      '❌ Seharusnya tidak ada konflik, tapi ditemukan: ' +
      hasil.map(h => h.booking_ids.join(' & ')).join(', ')
    ).toBe(0);
  });

});
