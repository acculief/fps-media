import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
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
          backgroundColor: "#0a0a0a",
          borderRadius: 96,
        }}
      >
        <div
          style={{
            width: 480,
            height: 480,
            borderRadius: 80,
            border: "16px solid #FACC15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FACC15",
            fontSize: 280,
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
