export const WEDDING_DATE_ISO = "2026-09-20T09:00:00+07:00";

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
    title: "Akad Nikah",
    time: "09.00 WIB — 10.00 WIB",
    date: "Minggu, 20 September 2026",
  },
  {
    title: "Resepsi",
    time: "10.00 WIB — Selesai",
    date: "Minggu, 20 September 2026",
  },
];

export const venue = {
  name: "Kediaman Mempelai Laki-laki",
  location:
    "Jl. Tole Iskandar No. 15, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16415",
  mapsUrl: "https://goo.gl/maps/RKYQcyQRvSh3GyVQ8?g_st=ac",
};

export const bankAccounts = [
  { bank: "BRI", number: "623201010122534", holder: "Charis Khoirun Nisak" },
  { bank: "BCA", number: "8691860272", holder: "Muhammad Yusron" },
];

export const giftAddress = {
  recipient: "Muhammad Yusron Nawawi & Charis Khoirun Nisak",
  address:
    "Jl. Tole Iskandar No. 15, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16415",
};
