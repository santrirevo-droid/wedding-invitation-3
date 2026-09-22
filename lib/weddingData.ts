export const WEDDING_DATE_ISO = "2026-09-30T10:00:00+07:00";

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
    name: "Muhammad Yusron Nawawi",
    // used as-is (no brackets) for the big display names and the Hero/
    // Mempelai monogram initial (shortName.charAt(0)) — a bracket here
    // would render as a stray "[" instead of a letter
    shortName: "Yusron",
    role: "putra",
    father: "Alm. Bapak Hasan Busri",
    mother: "Ibu Nuraini",
    instagram: "",
  },
  bride: {
    name: "Charis Khoirun Nisak",
    shortName: "Charis",
    role: "putri",
    father: "Bapak Kamirun",
    mother: "Ibu Zunairoh",
    instagram: "",
  },
};

export const events = [
  {
    title: "Resepsi",
    time: "10.00 WIB — Selesai",
    date: "Rabu, 30 September 2026",
  },
];

export const venue = {
  name: "Kediaman Mempelai Perempuan",
  location:
    "Desa Marga Bakti, Kec. Sinar Peninjauan, Kab. Ogan Komering Ulu, Sumatera Selatan",
  mapsUrl: "https://goo.gl/maps/LqVrRjjpvcfhyXDy9?g_st=aw",
};

export const bankAccounts = [
  { bank: "BRI", number: "623201010122534", holder: "Charis Khoirun Nisak" },
  { bank: "BCA", number: "8691860272", holder: "Muhammad Yusron" },
];

export const giftAddress = {
  recipient: "Muhammad Yusron Nawawi & Charis Khoirun Nisak",
  address:
    "Desa Marga Bakti, Kec. Sinar Peninjauan, Kab. Ogan Komering Ulu, Sumatera Selatan",
};
