import { Inter } from "next/font/google";

// The rest of the site uses Cormorant Garamond (a thin decorative serif)
// everywhere, which reads elegant on the invitation but is hard to read at
// a glance on a data-entry form — especially for older relatives. This
// section gets its own plain, high-legibility sans-serif instead, scoped
// to /daftar-tamu only so the invitation's look is untouched.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

export default function DaftarTamuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.variable} style={{ fontFamily: "var(--font-ui)" }}>
      {children}
    </div>
  );
}
