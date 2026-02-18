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
          backgroundColor: "#0a0a0a",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: 28,
            border: "6px solid #FACC15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FACC15",
            fontSize: 96,
            fontWeight: 900,
            fontFamily: "sans-serif",
          }}
        >
          Z
        </div>
      </div>
    ),
    { ...size }
  );
}
