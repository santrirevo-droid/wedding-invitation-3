import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Amiri, Jost, Italianno } from "next/font/google";
import BackgroundPattern from "@/components/BackgroundPattern";
import { couple, events, venue } from "@/lib/weddingData";
import "./globals.css";

/* Four families, and only four — every other --font-* token in globals.css
   aliases one of these. A high-contrast old-style serif carries the whole
   invitation; the rest are narrow exceptions. */

// headings + all running copy. Cormorant Garamond's very light weights hold
// up at display sizes, which is what makes the oversized moments (cover
// date, section titles) read as engraved rather than just big.
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// the couple's names, and nothing else — a true calligraphic face, used
// only at large sizes where its thin strokes and long swashes work
const italianno = Italianno({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

// tiny wide-tracked labels ("The Wedding Of", section eyebrows, IG handles).
// Kept geometric and quiet so it never competes with the serif.
const jost = Jost({
  variable: "--font-meta",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

// PLACEHOLDER — update this to the actual deployed domain once you know
// it (e.g. the Vercel project URL, or a custom domain). Must stay a valid
// absolute URL: it's required for the WhatsApp/Telegram link-preview image
// (opengraph-image) to resolve correctly.
const siteUrl = "https://your-domain.vercel.app";
const title = `${couple.groom.shortName} & ${couple.bride.shortName} — The Wedding Of`;
const description = `Undangan pernikahan digital ${couple.groom.name} & ${couple.bride.name} — ${events[0].date}, ${venue.name}.`;

export const metadata: Metadata = {
  // required so the file-based opengraph-image below resolves to an
  // absolute URL — WhatsApp/Telegram/etc refuse relative og:image URLs
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    locale: "id_ID",
    type: "website",
  },
};

// Without this, browsers with an auto-dark-theme feature (e.g. Android
// Chrome's "Auto Dark Theme for Web Contents") guess at whether this page is
// dark-mode-eligible and can repaint it with mismatched, near-invisible
// low-contrast colors. Declaring it explicitly stops that.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#eff4e2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${italianno.variable} ${jost.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-maroon-deep font-body text-on-maroon">
        <BackgroundPattern />
        {children}
      </body>
    </html>
  );
}
