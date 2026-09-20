import { couple, events } from "@/lib/weddingData";

/** Matches the `?to=` format read by useGuestName on the invitation cover/RSVP. */
export function buildInviteLink(origin: string, guestName: string): string {
  return `${origin}/?to=${encodeURIComponent(guestName)}`;
}

/** Placeholder tokens a sender can keep (or delete) anywhere in the
 * template — filled in per guest right before sending, via
 * fillWhatsAppTemplate. */
export const WHATSAPP_NAME_TOKEN = "{{nama}}";
export const WHATSAPP_LINK_TOKEN = "{{link}}";

/** The default WhatsApp invite text, edited once (as a shared template —
 * see the "Pesan Pengantar" field on /daftar-tamu) rather than per guest. */
export const DEFAULT_WHATSAPP_MESSAGE_TEMPLATE =
  `Assalamu'alaikum warahmatullahi wabarakatuh.\n\n` +
  `Yth. Bapak/Ibu/Saudara/i\n${WHATSAPP_NAME_TOKEN}\n\n` +
  `Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk menjadi bagian dari momen bahagia pernikahan ` +
  `${couple.groom.name} & ${couple.bride.name} yang insyaAllah akan diselenggarakan pada ${events[0].date}.\n\n` +
  `Informasi lengkap mengenai acara, serta kolom doa dan ucapan, dapat diakses melalui tautan berikut:\n\n` +
  `🔗 ${WHATSAPP_LINK_TOKEN}\n\n` +
  `Terima kasih atas perhatian, doa, dan restunya.\n\n` +
  `Wassalamu'alaikum warahmatullahi wabarakatuh.`;

/** Substitutes the per-guest tokens into an (optionally edited) template. */
export function fillWhatsAppTemplate(template: string, guestName: string, inviteLink: string): string {
  return template
    .split(WHATSAPP_NAME_TOKEN).join(guestName)
    .split(WHATSAPP_LINK_TOKEN).join(inviteLink);
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
