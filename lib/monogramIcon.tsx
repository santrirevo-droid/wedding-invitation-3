import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { couple } from "@/lib/weddingData";

// The couple's interlocked monogram (bride's initial, ampersand, groom's
// initial), shared by app/icon.tsx and app/apple-icon.tsx so the browser
// tab and the home-screen icon are the same mark. Everything is laid out in
// fractions of `px`, so one drawing scales cleanly from 32px up to 512px.
export async function renderMonogramIcon(px: number) {
  const [semibold, italic] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-MediumItalic.ttf")),
  ]);

  const first = couple.bride.shortName.charAt(0);
  const second = couple.groom.shortName.charAt(0);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: px * 0.22,
          background: "linear-gradient(145deg, #5b7a44 0%, #4d6b39 50%, #33422a 100%)",
        }}
      >
        {/* hairline inner ring, the cover's frame in miniature */}
        <div
          style={{
            position: "absolute",
            top: px * 0.07,
            left: px * 0.07,
            right: px * 0.07,
            bottom: px * 0.07,
            borderRadius: px * 0.16,
            border: `${Math.max(1, px * 0.012)}px solid rgba(253,253,246,0.35)`,
          }}
        />

        {/* first initial sits high-left, second low-right, overlapping
            through the middle so the two read as one joined mark */}
        <div
          style={{
            position: "absolute",
            left: px * 0.1,
            top: px * 0.0,
            fontFamily: "Cormorant",
            fontWeight: 600,
            fontSize: px * 0.78,
            lineHeight: 1,
            color: "#fdfdf6",
          }}
        >
          {first}
        </div>
        <div
          style={{
            position: "absolute",
            right: px * 0.15,
            bottom: px * 0.08,
            fontFamily: "Cormorant Italic",
            fontStyle: "italic",
            fontSize: px * 0.66,
            lineHeight: 1,
            color: "#d6e2b4",
          }}
        >
          {second}
        </div>
        <div
          style={{
            position: "absolute",
            left: px * 0.47,
            top: px * 0.4,
            fontFamily: "Cormorant Italic",
            fontStyle: "italic",
            fontSize: px * 0.2,
            lineHeight: 1,
            color: "#fdfdf6",
          }}
        >
          &amp;
        </div>
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: [
        { name: "Cormorant", data: semibold, weight: 600, style: "normal" },
        { name: "Cormorant Italic", data: italic, weight: 500, style: "italic" },
      ],
    }
  );
}
