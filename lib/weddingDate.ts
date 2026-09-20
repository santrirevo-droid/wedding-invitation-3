import { WEDDING_DATE_ISO } from "./weddingData";

/**
 * Display forms of the wedding date, derived from WEDDING_DATE_ISO so the
 * Hero and Acara sections can't drift out of sync with it (they each used
 * to carry their own hand-typed copy of the date).
 *
 * Parsed from the ISO *string*, never via Date getters: the invitation is
 * authored in WIB (+07:00) but renders on a UTC server and on the visitor's
 * own clock, and `getDate()` would disagree between them for any evening
 * event — a hydration mismatch that shows up as the wrong day. Slicing the
 * authored string keeps every environment on the date as written.
 */
const [datePart] = WEDDING_DATE_ISO.split("T");
const [year, month, day] = datePart.split("-");

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/** "20" */
export const weddingDay = day;
/** "09" */
export const weddingMonth = month;
/** "2026" */
export const weddingYear = year;
/** "September" */
export const weddingMonthName = MONTHS_ID[Number(month) - 1] ?? "";
/** "20 September 2026" */
export const weddingDateLong = `${Number(day)} ${weddingMonthName} ${year}`;

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
/** "Minggu" — Date.UTC on the authored Y/M/D, so the WIB date's weekday is
 * what comes out (the ISO's own UTC instant can fall on the day before). */
export const weddingDayName =
  DAYS_ID[new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).getUTCDay()] ?? "";
