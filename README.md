Undangan pernikahan digital — Next.js. Diduplikat dari `wedding-invitation-2` sebagai template kosong dan sudah dibersihkan dari data pasangan asal (Amri & Nufus); isi placeholder di bawah sebelum dipakai.

## Checklist sebelum dipakai

- [ ] `lib/weddingData.ts` — nama pasangan, orang tua, Instagram, tanggal & jam acara, venue, rekening. Ini satu-satunya file data yang perlu disentuh; tanggal di Hero/Acara/gambar preview WhatsApp ikut otomatis lewat `lib/weddingDate.ts`.
- [ ] `lib/families.ts` — label `guestListFamily` (judul halaman `/daftar-tamu`); default "Daftar Tamu" biasanya sudah pas.
- [ ] `components/Persiapan/defaultData.ts` — isi awal dashboard `/persiapan` (checklist, rundown, budget) masih generik; sunting atau langsung edit dari halaman setelah deploy.
- [x] `public/music/wedding-song.mp3` — sudah diisi lagu pilihan sendiri (lihat default `src` di `components/MusicPlayer/MusicPlayer.tsx`).
- [ ] `app/opengraph-image.tsx` — gambar preview saat link dibagikan ke WhatsApp/Telegram; otomatis ikut data dari `weddingData.ts`/`weddingDate.ts`, tidak perlu disentuh kecuali mau ubah tata letak/warna.
- [x] `app/layout.tsx` — `siteUrl` (dekat atas file) sudah diisi domain deploy sebenarnya (`https://charis-yusron.vercel.app`), wajib supaya gambar preview WhatsApp di atas resolve dengan benar.
- [ ] `app/icon.png` & `app/apple-icon.png` — masih placeholder ampersand generik; ganti dengan monogram sendiri jika perlu (Hero sendiri sudah pakai inisial pasangan sebagai teks, bukan gambar).
- [ ] Foto-foto di `public/` (bila ditambahkan nanti) dan galeri — belum ada, tambahkan sesuai kebutuhan.
- [x] ~~Font "TT Fors" ... trial, no-public-site~~ — sudah diganti total ke Google Fonts (Cormorant Garamond, Italianno, Jost, Amiri); tidak ada lagi font lokal berlisensi trial di repo ini.
- [ ] Password edit `/persiapan/itinerary` masih default `"0000"` (lihat `components/Persiapan/Itinerary.tsx`) — ganti bila perlu keamanan lebih.
- [x] Backend (Redis/KV untuk fitur Wishes & Daftar Tamu) — sudah disambungkan ke store Upstash `upstash-kv-bistre-book` milik proyek ini sendiri (lihat bagian **Environment variables** di bawah); kunci Redis-nya sudah dinamespace otomatis per pasangan lewat `lib/coupleSlug.ts`.

## Tampilan ("botanical grove")

- **Warna** — ground sage pucat bersemu krem, moss/olive untuk ornamen,
  foil emas-hijau botanical untuk teks bertakhta. Lihat `app/globals.css`.
  Nama variabel CSS (`--maroon-deep`, `--gold`, dst.) sengaja dipertahankan
  dari tema lama supaya class Tailwind di belasan komponen tidak perlu
  diubah; baca `maroon-*` sebagai "ground halaman" (sekarang hijau pucat),
  `accent` sebagai "warna ornamen di atas ground", `gold-*` sebagai "tinta
  di dalam kartu", `on-maroon-*` sebagai "teks di atas ground".
- **Kedalaman** — `components/BackgroundPattern` menumpuk gradasi dasar,
  wash sage + krem, grain kertas, lalu vignette hangat tipis.
  Grain-nya memakai `mix-blend-multiply`, bukan `overlay`: di atas ground
  terang, overlay mencerahkan sebanyak ia menggelapkan sehingga hanya jadi
  noise — di-multiply, tekstur yang sama terbaca sebagai serat kertas.
- **Aturan keterbacaan (diaudit terukur, jangan diturunkan)** —
  - Kontras: semua pasangan teks/latar lolos WCAG AA (≥4,5:1 teks biasa,
    ≥3:1 teks besar), dihitung terhadap ground *terburuk* yaitu di bawah
    wash blush (`#f2dcd3`), bukan ground rata-rata. `accent` **bukan warna
    teks** — 2,8:1 solid, 1,8:1 di 60% — hanya untuk ornamen SVG; teks
    kecil memakai `accent-dark`. Stop paling terang `.text-gilded`
    (`--gild-1`) dan `--gold`/`--sage-light` sengaja dipatok tepat di atas
    ambang; menggesernya lebih terang akan gagal.
  - Ukuran minimum **11px** untuk semua teks (label ber-tracking pun).
    Sebelumnya ada 21 teks di 8,5–10px berbobot 300 — tidak terbaca di HP.
  - Bobot **400** untuk teks di bawah 24px; `font-light` (300) hanya untuk
    display besar. Cormorant & Jost 300 terlalu tipis di ukuran isi.
  - `.gild-sweep` (tombol cover) memakai rentang gradasi lebih gelap/sempit
    daripada `.text-gilded`: gradasi foil penuh memuncak terlalu terang
    sehingga label ivory di atasnya hilang di tengah sapuan.
- **Hierarki Acara** — judul section (38–54px) → tanggal (30–38px, gilded)
  → angka countdown (24px) → label (11px). Tanggal harus mengalahkan
  countdown; versi awal terbalik (22px vs 32px). Nama hari diturunkan di
  `lib/weddingDate.ts` lewat `Date.UTC` pada Y/M/D yang ditulis, bukan dari
  instan ISO-nya (offset +07:00 bisa menjatuhkan hari UTC ke hari sebelumnya).
- **Emas bergradasi** — `.text-gilded` (+ `.text-gilded-drift`) meng-clip
  gradasi foil ke glyph; dipakai terbatas untuk judul section dan nama
  mempelai saja. Stop-nya berbobot perunggu agar tetap terbaca sebagai
  logam di atas gading (versi pucat hanya bekerja di atas hitam). `.rule-gild` untuk garis rambut, `.card-stock` untuk kartu
  kertas gading bergaris emas di dalam, `.gild-sweep` untuk tombol cover.
- **Font** — hanya 4 keluarga yang benar-benar dimuat (Cormorant Garamond,
  Italianno, Jost, Amiri); token `--font-*` lain adalah alias, lihat
  `app/globals.css`.
- **Bentuk kartu** — tiap jenis kartu punya bentuk sendiri, tapi satu
  keluarga: kartu acara & sel countdown berpuncak lengkung (senada arch
  monogram Mempelai), kartu tanda kasih berbentuk amplop dengan lipatan
  dan segel, kartu ucapan/RSVP bergaris emas di sisi jilid dengan pelat
  inisial melengkung, dan kartu sapaan di cover memakai tanda sudut ala
  crop-mark. Lengkungnya dibuat dengan `rounded-t-full`: CSS menyusutkan
  radius yang kelewat besar secara proporsional, jadi hasilnya setengah
  lingkaran presisi berapa pun lebar kartunya.
- **Ornamen** — `components/Crest` + `components/Botanical`, SVG
  bikinan sendiri, bukan clipart. Aset watercolor di `public/floral` masih
  dipakai tapi besar & sangat samar sebagai tekstur latar.
- **Tanggal** — `lib/weddingDate.ts` menurunkan semua bentuk tampilan
  tanggal dari `WEDDING_DATE_ISO`, jadi tidak ada lagi tanggal yang
  ditulis ulang manual di Hero/Acara.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Daftar Tamu (guest list collection)

`/daftar-tamu` is one shared list — anyone with the link can add names and
sees (and can delete) every name already added, with a live "similar name"
check (`/api/guest-list/search`) while typing so the same person doesn't
get added twice.

- There's no more per-family split/picker — `lib/families.ts` still holds
  a single `guestListFamily` entry only because the storage layer
  (`lib/guestList.ts`, the `/api/guest-list*` routes) keys every entry by a
  "family" slug; it's an implementation detail now, not a UX concept. Only
  its `label` is user-visible, as the page's `<h1>`.
- `/daftar-tamu/rekap` is a read-only view of the same list plus clusters
  of likely-duplicate names. No password — same as the wishes/RSVP list
  below, it's a small private tool shared only within the family, not a
  public page. Deleting an entry still only works from `/daftar-tamu`.
- Storage reuses the same Redis/KV store as the wishes feature below — no
  extra provisioning needed.

## Environment variables

Set these in Vercel → Project Settings → Environment Variables (a `.env.local` file works for local dev too, `.env*` is already gitignored):

| Variable | Required for | Notes |
| --- | --- | --- |
| `KV_REST_API_URL` / `UPSTASH_REDIS_REST_URL` | Wishes, Daftar Tamu | Auto-filled when you attach a Redis/KV store from Vercel's Storage tab — support both names since Vercel injects one or the other depending on how the store was attached. |
| `KV_REST_API_TOKEN` / `UPSTASH_REDIS_REST_TOKEN` | Wishes, Daftar Tamu | Same as above. |

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
