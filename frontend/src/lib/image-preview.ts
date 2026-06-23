export function computeResizeOutput(
  originalW: number,
  originalH: number,
  targetW: number,
  targetH: number,
  maintainAspect: boolean
): { width: number; height: number } {
  if (!maintainAspect) {
    return { width: targetW, height: targetH };
  }
  const ratio = Math.min(targetW / originalW, targetH / originalH);
  return {
    width: Math.max(1, Math.round(originalW * ratio)),
    height: Math.max(1, Math.round(originalH * ratio)),
  };
}

export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "diagonal-bl-tr"
  | "diagonal-br-tl"
  | "diagonal-tl-br"
  | "diagonal-tr-bl"
  | "edge-left"
  | "edge-right";

export const WATERMARK_POSITIONS: { value: WatermarkPosition; label: string }[] = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
  { value: "center", label: "Center" },
  { value: "diagonal-bl-tr", label: "Diagonal ↗ (bottom-left)" },
  { value: "diagonal-br-tl", label: "Diagonal ↖ (bottom-right)" },
  { value: "diagonal-tl-br", label: "Diagonal ↘ (top-left)" },
  { value: "diagonal-tr-bl", label: "Diagonal ↙ (top-right)" },
  { value: "edge-left", label: "Vertical left (bottom → top)" },
  { value: "edge-right", label: "Vertical right (bottom → top)" },
];

export function getWatermarkCoords(
  imgW: number,
  imgH: number,
  textW: number,
  textH: number,
  position: WatermarkPosition,
  padding = 20
): { x: number; y: number } {
  switch (position) {
    case "top-left":
      return { x: padding, y: padding + textH };
    case "top-right":
      return { x: imgW - textW - padding, y: padding + textH };
    case "bottom-left":
      return { x: padding, y: imgH - padding };
    case "center":
      return { x: (imgW - textW) / 2, y: (imgH + textH) / 2 };
    default:
      return { x: imgW - textW - padding, y: imgH - padding };
  }
}

/** Draw watermark text on a canvas (supports diagonal and edge positions). */
export function drawCanvasWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  pageW: number,
  pageH: number,
  position: WatermarkPosition,
  fontSize: number,
  color: string,
  opacity: number,
  padding = 20
) {
  if (!text.trim()) return;

  ctx.save();
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity / 100;
  const textW = ctx.measureText(text).width;
  const textH = fontSize;

  switch (position) {
    case "top-left":
      ctx.fillText(text, padding, padding + textH);
      break;
    case "top-right":
      ctx.fillText(text, pageW - textW - padding, padding + textH);
      break;
    case "bottom-left":
      ctx.fillText(text, padding, pageH - padding);
      break;
    case "bottom-right":
      ctx.fillText(text, pageW - textW - padding, pageH - padding);
      break;
    case "center":
      ctx.fillText(text, (pageW - textW) / 2, (pageH + textH) / 2);
      break;
    case "diagonal-bl-tr":
      ctx.translate(padding, pageH - padding);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(text, 0, 0);
      break;
    case "diagonal-br-tl":
      ctx.translate(pageW - padding, pageH - padding);
      ctx.rotate(Math.PI / 4);
      ctx.textAlign = "right";
      ctx.fillText(text, 0, 0);
      break;
    case "diagonal-tl-br":
      ctx.translate(padding, padding + textH);
      ctx.rotate(Math.PI / 4);
      ctx.fillText(text, 0, 0);
      break;
    case "diagonal-tr-bl":
      ctx.translate(pageW - padding, padding + textH);
      ctx.rotate(-Math.PI / 4);
      ctx.textAlign = "right";
      ctx.fillText(text, 0, 0);
      break;
    case "edge-left":
      ctx.translate(padding + textH, pageH - padding);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(text, 0, 0);
      break;
    case "edge-right":
      ctx.translate(pageW - padding, padding);
      ctx.rotate(Math.PI / 2);
      ctx.textAlign = "right";
      ctx.fillText(text, 0, 0);
      break;
    default:
      ctx.fillText(text, pageW - textW - padding, pageH - padding);
  }

  ctx.restore();
}

export function fitCanvasSize(
  sourceW: number,
  sourceH: number,
  maxW: number,
  maxH: number
): { width: number; height: number; scale: number } {
  const scale = Math.min(maxW / sourceW, maxH / sourceH, 1);
  return {
    width: Math.max(1, Math.round(sourceW * scale)),
    height: Math.max(1, Math.round(sourceH * scale)),
    scale,
  };
}

export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cell = 12
) {
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#f3f4f6";
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      if ((x / cell + y / cell) % 2 === 0) {
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }
}
