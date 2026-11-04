import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo/site";

type OgBrandArgs = {
  title: string;
  subtitle?: string;
  label?: string;
};

/** Shared OG image layout — editorial paper + terminal strip, no third-party logos. */
export function ogBrandImage({ title, subtitle, label }: OgBrandArgs): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FAFAF7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flex: 1, padding: 64 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1 }}>
            {label ? (
              <div style={{ fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", color: "#047857", marginBottom: 16 }}>
                {label}
              </div>
            ) : null}
            <div style={{ fontSize: 56, fontWeight: 700, color: "#0B0F14", lineHeight: 1.1, maxWidth: 900 }}>{title}</div>
            {subtitle ? (
              <div style={{ fontSize: 24, color: "#5B6470", marginTop: 20, maxWidth: 800 }}>{subtitle}</div>
            ) : null}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0B0F14",
            color: "#D7DEE7",
            padding: "24px 64px",
            fontSize: 20,
          }}
        >
          <span>{SITE.name}</span>
          <span style={{ color: "#34D399" }}>rlonfonyuy.online</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
