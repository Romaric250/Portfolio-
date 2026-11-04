import { ImageResponse } from "next/og";

/** Shared renderer for the PWA icon routes (/icon-192, /icon-512, /icon-maskable). */
export function renderPwaIcon(size: number, maskable = false) {
  const pad = maskable ? size * 0.18 : 0;
  const inner = size - pad * 2;
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
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: inner,
            height: inner,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderRadius: maskable ? 0 : size * 0.22,
            background: "#0B0F14",
          }}
        >
          <span style={{ color: "#FAFAF7", fontSize: inner * 0.52, fontWeight: 800, letterSpacing: -inner * 0.045, display: "flex" }}>
            R<span style={{ opacity: 0.55 }}>L</span>
          </span>
          <div
            style={{
              position: "absolute",
              top: inner * 0.14,
              right: inner * 0.14,
              width: inner * 0.13,
              height: inner * 0.13,
              borderRadius: 999,
              background: "#10B981",
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
