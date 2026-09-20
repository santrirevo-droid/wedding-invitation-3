import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";

// A planning dashboard for the couple/family, not the guest-facing
// invitation — gets its own font stack (display serif + mono for numbers/
// labels + a plain body sans), scoped to /persiapan only, same reasoning as
// /daftar-tamu's local Inter setup in app/daftar-tamu/layout.tsx.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-persiapan-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-persiapan-mono",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-persiapan-body",
});

export default function PersiapanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${ibmPlexMono.variable} ${inter.variable}`}>
      {children}
    </div>
  );
}
