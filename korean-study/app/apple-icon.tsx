import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const notoBlack = await loadGoogleFont("Noto Sans KR", 900, "한");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2B4EFF",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontFamily: "Noto Sans KR",
            fontWeight: 900,
            fontSize: 108,
            lineHeight: 1,
          }}
        >
          한
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans KR", data: notoBlack, weight: 900, style: "normal" }],
    },
  );
}
