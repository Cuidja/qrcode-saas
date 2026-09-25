import QRCode from "qrcode";

export interface QRRenderOptions {
  text: string;
  width?: number;
  color?: string;
  bgColor?: string;
  shape?: "square" | "rounded" | "dots" | "classy";
  cornerStyle?: "square" | "rounded" | "circle" | "leaf";
  frameStyle?: "none" | "badge" | "top_banner" | "bottom_banner" | "phone";
  frameText?: string;
  logoUrl?: string | null;
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
    logoSvg = null
  } = options;

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
  if (logoSvg) {
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
    const svgBlob = new Blob([logoSvg], { type: "image/svg+xml;charset=utf-8" });
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

    if (frameStyle === "banner" || frameStyle === "bottom_banner") {
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
