export const WEDDING_DATE_ISO = "2027-06-19T08:00:00+07:00";

export type CoupleRole = "putra" | "putri";

export const couple: Record<
  "groom" | "bride",
  {
    name: string;
    shortName: string;
    role: CoupleRole;
    father: string;
    mother: string;
    instagram: string;
  }
> = {
  groom: {
    name: "[Nama Lengkap Pengantin Pria]",
    // used as-is (no brackets) for the big display names and the Hero/
    // Mempelai monogram initial (shortName.charAt(0)) — a bracket here
    // would render as a stray "[" instead of a letter
    shortName: "Pria",
    role: "putra",
    father: "Bapak [Nama Ayah Pria]",
    mother: "Ibu [Nama Ibu Pria]",
    instagram: "@username_pria",
  },
  bride: {
    name: "[Nama Lengkap Pengantin Wanita]",
    shortName: "Wanita",
    role: "putri",
    father: "Bapak [Nama Ayah Wanita]",
    mother: "Ibu [Nama Ibu Wanita]",
    instagram: "@username_wanita",
  },
};

export const events = [
  {
    title: "Akad Nikah",
    time: "08.00 WIB — Selesai",
    date: "Sabtu, 19 Juni 2027",
  },
  {
    title: "Resepsi",
    time: "10.00 WIB — Selesai",
    date: "Sabtu, 19 Juni 2027",
  },
];

export const venue = {
  name: "[Nama Lokasi Acara]",
  location: "[Alamat lengkap venue — jalan, kecamatan, kabupaten/kota, provinsi]",
  mapsUrl: "https://maps.app.goo.gl/REPLACE_ME",
};

export const bankAccounts = [
  { bank: "[Nama Bank]", number: "0000000000", holder: "[Nama Lengkap Pengantin Pria]" },
  { bank: "[Nama Bank]", number: "0000000000", holder: "[Nama Lengkap Pengantin Wanita]" },
];

export const giftAddress = {
  recipient: "[Nama Lengkap Penerima Kado]",
  address: "[Alamat lengkap untuk pengiriman kado fisik]",
};
