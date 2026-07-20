"use client";

import "sketchbook-ui/style.css";
import { SketchProvider } from "sketchbook-ui";
import { hand, marker, beVietnamPro } from "./fonts";

export default function DesignPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${hand.variable} ${marker.variable} ${beVietnamPro.variable}`}
    >
      <SketchProvider>{children}</SketchProvider>
    </div>
  );
}
