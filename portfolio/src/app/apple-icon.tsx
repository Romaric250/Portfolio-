import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F14",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span style={{ color: "#FAFAF7", fontSize: 92, fontWeight: 800, letterSpacing: -8, display: "flex" }}>
          R<span style={{ opacity: 0.55 }}>L</span>
        </span>
        <div style={{ position: "absolute", top: 26, right: 26, width: 24, height: 24, borderRadius: 999, background: "#10B981" }} />
      </div>
    ),
    size,
  );
}
