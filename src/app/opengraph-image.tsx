import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "SSF Guide Nepal — Everything about Nepal's Social Security Fund";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social-share image for the whole site (English text keeps the default
// ImageResponse font happy). Individual routes can override with their own.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg,#5B2D8E 0%,#3b1d5e 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#F97316" }}>
          SSF Guide Nepal
        </div>
        <div style={{ display: "flex", fontSize: 62, fontWeight: 800, marginTop: 24, lineHeight: 1.1 }}>
          Everything about Nepal&apos;s Social Security Fund
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "rgba(255,255,255,0.85)" }}>
          Guides · 20+ calculators · SSF Assessment · AI assistant
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 44, color: "rgba(255,255,255,0.7)" }}>
          ssf.digitalsolutionnepal.com · Powered by Digital Solution
        </div>
      </div>
    ),
    { ...size },
  );
}
