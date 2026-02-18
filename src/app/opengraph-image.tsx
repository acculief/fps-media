import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          backgroundColor: "#030712",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#FACC15",
          }}
        />

        {/* Z Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: "#0a0a0a",
            border: "3px solid #FACC15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FACC15",
            fontSize: 44,
            fontWeight: 900,
            marginBottom: 24,
          }}
        >
          Z
        </div>

        {/* Site name */}
        <h1
          style={{
            color: "#FACC15",
            fontSize: 56,
            fontWeight: 700,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {SITE_NAME}
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#9ca3af",
            fontSize: 24,
            margin: 0,
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {SITE_DESCRIPTION}
        </p>
      </div>
    ),
    { ...size }
  );
}
