import type { ProgressData } from "./types";

// Data awal contoh — sunting/hapus sesuai kebutuhan setelah situs berjalan.
// Semua isi di sini bisa diedit langsung dari halaman /persiapan.
export const DEFAULT_DATA: ProgressData = {
  settings: {
    nameFirst: "Muhammad Yusron Nawawi",
    nameSecond: "Charis Khoirun Nisak",
    weddingDate: "2026-09-30",
    ceremonyTime: "09:00",
    venue: "Kediaman Mempelai Wanita",
    venueMapUrl: "https://goo.gl/maps/LqVrRjjpvcfhyXDy9?g_st=aw",
    totalBudget: 0,
  },
  tasks: [
    { id: "t01", text: "Konfirmasi tanggal & venue (harga, kapasitas, fasilitas)", pic: "Kedua mempelai", date: "", done: false },
    { id: "t02", text: "Mulai administrasi nikah di KUA/kelurahan domisili", pic: "", date: "", done: false },
    { id: "t03", text: "Survei & DP catering", pic: "", date: "", done: false },
    { id: "t04", text: "Survei & DP dekorasi", pic: "", date: "", done: false },
    { id: "t05", text: "Booking fotografer & videografer", pic: "", date: "", done: false },
    { id: "t06", text: "Booking MUA & busana pengantin", pic: "", date: "", done: false },
    { id: "t07", text: "Booking sound system, MC, hiburan", pic: "", date: "", done: false },
    { id: "t08", text: "Finalisasi rundown acara & konsep visual", pic: "", date: "", done: false },
    { id: "t09", text: "Desain & sebar undangan", pic: "", date: "", done: false },
    { id: "t10", text: "Finalisasi daftar tamu", pic: "", date: "", done: false },
  ],
  rundown: [
    { id: "r1", time: "06:00", activity: "Persiapan & make-up pengantin", note: "MUA tiba di lokasi", pic: "MUA" },
    { id: "r2", time: "09:00", activity: "Tasyakuran dimulai", note: "", pic: "MC" },
    { id: "r3", time: "13:00", activity: "Tasyakuran selesai", note: "", pic: "WO" },
  ],
  arrivals: [
    { id: "a1", group: "Keluarga mempelai pria", from: "", date: "", time: "", transport: "", count: "", note: "" },
  ],
  lodging: [
    { id: "l1", name: "", address: "", phone: "", rooms: "", forGroup: "", mapUrl: "", note: "" },
  ],
  routes: [
    { id: "rt1", from: "", to: "", mode: "", duration: "", mapUrl: "", note: "" },
  ],
  vendors: [
    { id: "v1", category: "Venue", name: "", phone: "" },
    { id: "v2", category: "Catering", name: "", phone: "" },
    { id: "v3", category: "Dekorasi", name: "", phone: "" },
    { id: "v4", category: "Fotografer/Videografer", name: "", phone: "" },
    { id: "v5", category: "MUA", name: "", phone: "" },
    { id: "v6", category: "Busana", name: "", phone: "" },
    { id: "v7", category: "Sound/MC/Hiburan", name: "", phone: "" },
    { id: "v8", category: "WO / Koordinator", name: "", phone: "" },
  ],
  budgetItems: [
    { id: "b1", pos: "Sewa Venue", low: 0, high: 0, note: "" },
    { id: "b2", pos: "Catering", low: 0, high: 0, note: "" },
    { id: "b3", pos: "Dekorasi", low: 0, high: 0, note: "" },
    { id: "b4", pos: "Dokumentasi", low: 0, high: 0, note: "" },
    { id: "b5", pos: "Busana & MUA", low: 0, high: 0, note: "" },
    { id: "b6", pos: "Dana Cadangan", low: 0, high: 0, note: "" },
  ],
  expenses: [],
  familyItinerary: [
    { id: "fi1", date: "", time: "09:00", activity: "Tasyakuran Pernikahan", note: "" },
  ],
};
