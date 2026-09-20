import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { couple, venue } from "@/lib/weddingData";
import { weddingDay, weddingDayName, weddingMonthName, weddingYear } from "@/lib/weddingDate";

export const alt = `The Wedding of ${couple.groom.shortName} & ${couple.bride.shortName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Shown as the link-preview thumbnail when the invite link is shared in
// WhatsApp/Telegram/etc — mirrors the cover's ivory-and-gold look so the
// preview reads as the same invitation, not a generic site card.
export default async function Image() {
  const [medium, semibold, mediumItalic, floralA, floralB] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-Medium.ttf")),
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-MediumItalic.ttf")),
    readFile(join(process.cwd(), "public/floral/floral-wc-spray-b.png")),
    readFile(join(process.cwd(), "public/floral/floral-wc-spray-a.png")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf8f4 0%, #f9f1ea 55%, #f2e5d9 100%)",
          position: "relative",
        }}
      >
        {/* atmosphere, echoing the cover's corner florals */}
        <img
          src={`data:image/png;base64,${floralA.toString("base64")}`}
          width={520}
          height={392}
          style={{ position: "absolute", top: -60, left: -70, opacity: 0.16 }}
        />
        <img
          src={`data:image/png;base64,${floralB.toString("base64")}`}
          width={420}
          height={734}
          style={{ position: "absolute", bottom: -140, right: -60, opacity: 0.14 }}
        />

        {/* hairline frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1.5px solid rgba(166,124,82,0.35)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "Cormorant Garamond",
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#a67c52",
            }}
          >
            The Wedding Of
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 34,
              fontFamily: "Cormorant Garamond",
              fontSize: 168,
              fontWeight: 600,
              color: "#46382d",
            }}
          >
            <span>{couple.groom.shortName}</span>
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 92,
                color: "#7f5c39",
              }}
            >
              &amp;
            </span>
            <span>{couple.bride.shortName}</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <div
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: 50,
                fontWeight: 500,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#a67c52",
              }}
            >
              {weddingDayName}
            </div>
            <div
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: 150,
                fontWeight: 600,
                color: "#46382d",
                marginTop: -10,
              }}
            >
              {`${weddingDay} ${weddingMonthName} ${weddingYear}`}
            </div>
          </div>

          <div
            style={{
              fontFamily: "Cormorant Garamond",
              fontSize: 22,
              fontWeight: 500,
              color: "#8a7867",
              marginTop: -6,
            }}
          >
            {venue.name}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: medium, weight: 500, style: "normal" },
        { name: "Cormorant Garamond", data: semibold, weight: 600, style: "normal" },
        { name: "Cormorant Garamond", data: mediumItalic, weight: 500, style: "italic" },
      ],
    }
  );
}
