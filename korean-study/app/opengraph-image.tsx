import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-fonts";

export const alt = "Học tiếng Hàn — tài liệu cá nhân TOPIK 1";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#232323";
const PAPER = "#FBF6EC";
const PEN_BLUE = "#2B4EFF";
const PEN_RED = "#E8503A";

export default async function OpengraphImage() {
  const [notoBlack, handBold] = await Promise.all([
    loadGoogleFont("Noto Sans KR", 900, "한안녕하세요"),
    loadGoogleFont("Shantell Sans", 800, "Tham khảo học tiếng HànTOPIK 1 · PHASE 0"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: PAPER,
          backgroundImage: `linear-gradient(${INK}14 1px, transparent 1px)`,
          backgroundSize: "100% 38px",
          position: "relative",
        }}
      >
        {/* Khung viền vẽ tay */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            border: `4px solid ${INK}`,
            borderRadius: 22,
          }}
        />

        {/* Nội dung */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "0 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 116,
              height: 116,
              borderRadius: 26,
              background: PEN_BLUE,
              border: `4px solid ${INK}`,
              transform: "rotate(-4deg)",
              flexShrink: 0,
              boxShadow: `6px 6px 0 rgb(35 34 34 / 0.15)`,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontFamily: "Noto Sans KR",
                fontWeight: 900,
                fontSize: 64,
              }}
            >
              한
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Noto Sans KR",
                fontWeight: 900,
                fontSize: 32,
                color: INK,
                opacity: 0.75,
              }}
            >
              안녕하세요
            </span>
            <span
              style={{
                fontFamily: "Shantell Sans",
                fontWeight: 800,
                fontSize: 60,
                color: INK,
                lineHeight: 1.2,
              }}
            >
              Tham khảo học tiếng Hàn
            </span>
          </div>
        </div>

        {/* Con dấu TOPIK */}
        <div
          style={{
            display: "flex",
            paddingLeft: 248,
            marginTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `3px solid ${PEN_RED}`,
              borderRadius: 10,
              padding: "10px 22px",
              transform: "rotate(-2deg)",
            }}
          >
            <span
              style={{
                fontFamily: "Shantell Sans",
                fontWeight: 800,
                fontSize: 24,
                color: PEN_RED,
                letterSpacing: 1,
              }}
            >
              TOPIK 1 · PHASE 0
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans KR", data: notoBlack, weight: 900, style: "normal" },
        { name: "Shantell Sans", data: handBold, weight: 800, style: "normal" },
      ],
    },
  );
}
