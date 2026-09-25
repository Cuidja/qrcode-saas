import QRCode from "qrcode";

export const LOGO_PRESETS = [
  { id: "none", label: "Nenhum", svg: null },
  {
    id: "web",
    label: "Web / Globo",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#0284c7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
  },
  {
    id: "google",
    label: "Google",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`
  }
];

export interface QRRenderOptions {
  text: string;
  width?: number;
  color?: string;
  bgColor?: string;
  shape?: "square" | "rounded" | "dots" | "classy";
  cornerStyle?: "square" | "rounded" | "circle" | "leaf";
  frameStyle?: "none" | "badge" | "top_banner" | "bottom_banner" | "phone";
  frameText?: string;
  logoId?: string | null;
  logoSvg?: string | null;
}

/**
 * Renderiza um QR Code completo com Shapes, Cantos, Moldura (Frame) e Logo Central em um Canvas 2D
 */
export async function renderCustomQRCode(
  canvas: HTMLCanvasElement,
  options: QRRenderOptions
) {
  const {
    text,
    width = 300,
    color = "#000000",
    bgColor = "#ffffff",
    shape = "square",
    cornerStyle = "square",
    frameStyle = "bottom_banner",
    frameText = "SCAN ME",
    logoId = null,
    logoSvg: providedSvg = null
  } = options;

  const targetLogoSvg = providedSvg || (logoId ? (LOGO_PRESETS.find(l => l.id === logoId)?.svg || null) : null);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Tamanhos e Dimensões
  const hasFrame = frameStyle !== "none";
  const framePaddingHeader = frameStyle === "top_banner" ? 50 : 20;
  const framePaddingFooter = (frameStyle === "bottom_banner" || frameStyle === "badge") ? 60 : 20;

  const qrSize = width;
  const canvasWidth = qrSize + 40;
  const canvasHeight = qrSize + framePaddingHeader + framePaddingFooter;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 1. Limpar Fundo do Canvas / Desenhar Fundo da Moldura
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(0, 0, canvasWidth, canvasHeight, 16);
  ctx.fill();

  // Borda da Moldura (Se houver frame)
  if (hasFrame) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(4, 4, canvasWidth - 8, canvasHeight - 8, 14);
    ctx.stroke();
  }

  // 2. Gerar Matriz de Módulos do QR Code usando a lib qrcode
  const qrData = QRCode.create(text, { errorCorrectionLevel: "H" });
  const modules = qrData.modules;
  const moduleCount = modules.size;
  const cellSize = qrSize / moduleCount;

  const qrOffsetX = 20;
  const qrOffsetY = framePaddingHeader;

  // Função auxiliar para verificar se a célula faz parte dos 3 Olhos (Position Detection Patterns)
  function isEyeModule(row: number, col: number) {
    if (row < 7 && col < 7) return true; // Olho superior esquerdo
    if (row < 7 && col >= moduleCount - 7) return true; // Olho superior direito
    if (row >= moduleCount - 7 && col < 7) return true; // Olho inferior esquerdo
    return false;
  }

  // 3. Desenhar Módulos (Shapes)
  ctx.fillStyle = color;

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (modules.get(r, c)) {
        if (isEyeModule(r, c)) continue; // Olhos são desenhados separadamente para aplicar o CornerStyle

        const x = qrOffsetX + c * cellSize;
        const y = qrOffsetY + r * cellSize;

        if (shape === "dots") {
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (shape === "rounded") {
          ctx.beginPath();
          ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, cellSize * 0.35);
          ctx.fill();
        } else if (shape === "classy") {
          ctx.beginPath();
          ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, [cellSize * 0.4, 0, cellSize * 0.4, 0]);
          ctx.fill();
        } else {
          // Square padrão
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  // 4. Desenhar Olhos (Position Detection Patterns / Corners)
  const eyePositions = [
    { r: 0, c: 0 },
    { r: 0, c: moduleCount - 7 },
    { r: moduleCount - 7, c: 0 }
  ];

  eyePositions.forEach(({ r, c }) => {
    const eyeX = qrOffsetX + c * cellSize;
    const eyeY = qrOffsetY + r * cellSize;
    const eyeWidth = 7 * cellSize;

    // Moldura Externa do Olho (Outer Frame - 7x7)
    ctx.strokeStyle = color;
    ctx.lineWidth = cellSize;

    ctx.beginPath();
    if (cornerStyle === "rounded" || cornerStyle === "leaf") {
      const radius = cornerStyle === "leaf" ? [eyeWidth * 0.35, 0, eyeWidth * 0.35, 0] : eyeWidth * 0.25;
      ctx.roundRect(eyeX + cellSize / 2, eyeY + cellSize / 2, eyeWidth - cellSize, eyeWidth - cellSize, radius);
    } else if (cornerStyle === "circle") {
      ctx.arc(eyeX + eyeWidth / 2, eyeY + eyeWidth / 2, (eyeWidth - cellSize) / 2, 0, Math.PI * 2);
    } else {
      // Square
      ctx.strokeRect(eyeX + cellSize / 2, eyeY + cellSize / 2, eyeWidth - cellSize, eyeWidth - cellSize);
    }
    ctx.stroke();

    // Centro do Olho (Inner Dot - 3x3)
    ctx.fillStyle = color;
    const innerX = eyeX + 2 * cellSize;
    const innerY = eyeY + 2 * cellSize;
    const innerSize = 3 * cellSize;

    ctx.beginPath();
    if (cornerStyle === "circle" || cornerStyle === "rounded") {
      ctx.arc(innerX + innerSize / 2, innerY + innerSize / 2, innerSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(innerX, innerY, innerSize, innerSize);
    }
  });

  // 5. Desenhar Ícone / Logo no Centro
  if (targetLogoSvg) {
    const logoSize = qrSize * 0.22;
    const logoX = qrOffsetX + (qrSize - logoSize) / 2;
    const logoY = qrOffsetY + (qrSize - logoSize) / 2;

    // Fundo limpo para a logo não encostar nos módulos
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(qrOffsetX + qrSize / 2, qrOffsetY + qrSize / 2, logoSize / 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Renderizar SVG da Logo
    const img = new Image();
    const svgBlob = new Blob([targetLogoSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    await new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, logoX + logoSize * 0.15, logoY + logoSize * 0.15, logoSize * 0.7, logoSize * 0.7);
        URL.revokeObjectURL(url);
        resolve(true);
      };
      img.src = url;
    });
  }

  // 6. Desenhar Moldura / CTA Frame
  if (frameStyle === "bottom_banner" || frameStyle === "badge") {
    const bannerY = canvasHeight - 48;

    if (frameStyle === "bottom_banner") {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(16, bannerY, canvasWidth - 32, 38, 10);
      ctx.fill();

      ctx.fillStyle = bgColor === "#ffffff" ? "#ffffff" : "#000000";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((frameText || "SCAN ME").toUpperCase(), canvasWidth / 2, bannerY + 19);
    } else if (frameStyle === "badge") {
      const badgeWidth = 140;
      const badgeX = (canvasWidth - badgeWidth) / 2;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(badgeX, bannerY, badgeWidth, 34, 17);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`📱 ${frameText || "SCAN ME"}`, canvasWidth / 2, bannerY + 17);
    }
  } else if (frameStyle === "top_banner") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(16, 10, canvasWidth - 32, 34, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((frameText || "SCAN ME").toUpperCase(), canvasWidth / 2, 27);
  }
}
