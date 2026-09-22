import { coupleSlug } from "./coupleSlug";
import { couple, events, venue, WEDDING_DATE_ISO } from "./weddingData";

function toIcsUtc(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/** Escapes text per RFC 5545 (comma, semicolon, backslash, newline). */
function escapeIcsText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function buildEventDetails() {
  const start = new Date(WEDDING_DATE_ISO);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 10.00 resepsi -> perkiraan selesai 14.00

  const summary = `Pernikahan ${couple.groom.shortName} & ${couple.bride.shortName}`;
  const location = `${venue.name}, ${venue.location}`;
  const description = [
    ...events.map((event) => `${event.title}: ${event.time}`),
    venue.mapsUrl,
  ].join("\n");

  return { start, end, summary, location, description };
}

function buildIcs() {
  const { start, end, summary, location, description } = buildEventDetails();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${couple.groom.shortName} & ${couple.bride.shortName} Wedding//ID`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${coupleSlug}-wedding@undangan`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `URL:${venue.mapsUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

function buildGoogleCalendarUrl() {
  const { start, end, summary, location, description } = buildEventDetails();

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: summary,
    dates: `${toIcsUtc(start)}/${toIcsUtc(end)}`,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Fallback `data:` URL for calendar apps that don't support Google's add-event link (Apple Calendar, Outlook, etc). */
export const CALENDAR_ICS_URL = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs())}`;

/** Ready-made Google Calendar "add event" link for the "Simpan ke Kalender" button. */
export const CALENDAR_GOOGLE_URL = buildGoogleCalendarUrl();
