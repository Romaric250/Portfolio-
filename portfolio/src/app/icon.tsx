import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 16,
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span style={{ color: "#FAFAF7", fontSize: 34, fontWeight: 800, letterSpacing: -3, display: "flex" }}>
          R<span style={{ opacity: 0.55 }}>L</span>
        </span>
        <div style={{ position: "absolute", top: 9, right: 9, width: 10, height: 10, borderRadius: 999, background: "#10B981" }} />
      </div>
    ),
    size,
  );
}
