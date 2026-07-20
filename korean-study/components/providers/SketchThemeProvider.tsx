"use client";

import { SketchProvider } from "sketchbook-ui";
import type { ReactNode } from "react";

// Wrap riêng thành client component vì SketchProvider dùng hook nội bộ,
// còn app/layout.tsx là server component (export metadata) nên không thể
// tự đánh dấu "use client".
export function SketchThemeProvider({ children }: { children: ReactNode }) {
  return <SketchProvider>{children}</SketchProvider>;
}
