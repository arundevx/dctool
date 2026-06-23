import type { WatermarkPosition } from "@/lib/image-preview";
import { drawCanvasWatermark } from "@/lib/image-preview";

/** @deprecated Use drawCanvasWatermark — kept for simple corner coords if needed */
export function getPdfWatermarkCanvasCoords(
  pageW: number,
  pageH: number,
  textW: number,
  fontSize: number,
  position: WatermarkPosition,
  padding = 36
): { x: number; y: number } {
  switch (position) {
    case "top-left":
      return { x: padding, y: padding + fontSize };
    case "top-right":
      return { x: pageW - textW - padding, y: padding + fontSize };
    case "bottom-left":
      return { x: padding, y: pageH - padding };
    case "center":
      return { x: (pageW - textW) / 2, y: pageH / 2 + fontSize / 3 };
    default:
      return { x: pageW - textW - padding, y: pageH - padding };
  }
}

export { drawCanvasWatermark };
