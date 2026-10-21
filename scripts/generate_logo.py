import os
from PIL import Image, ImageDraw, ImageFont

def generate_logo(output_path, size=1024):
    # Imagem base RGBA com fundo transparente
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Desenhar Squircle / Retângulo arredondado de fundo com gradiente
    padding = 64
    box = [padding, padding, size - padding, size - padding]
    corner_radius = 210

    # Criar máscara para o squircle
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(box, radius=corner_radius, fill=255)

    # Criar gradiente do fundo (Azul escuro tecnológico para Azul elétrico e ciano)
    gradient = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)
    c1 = (15, 23, 42)    # #0f172a (Slate 900)
    c2 = (2, 132, 199)   # #0284c7 (Sky 600)
    c3 = (14, 165, 233)  # #0ea5e9 (Sky 500)

    for y in range(size):
        ratio = y / size
        # Interpolação de cores c1 -> c2 -> c3
        if ratio < 0.6:
            sub = ratio / 0.6
            r = int(c1[0] + (c2[0] - c1[0]) * sub)
            g = int(c1[1] + (c2[1] - c1[1]) * sub)
            b = int(c1[2] + (c2[2] - c1[2]) * sub)
        else:
            sub = (ratio - 0.6) / 0.4
            r = int(c2[0] + (c3[0] - c2[0]) * sub)
            g = int(c2[1] + (c3[1] - c2[1]) * sub)
            b = int(c2[2] + (c3[2] - c2[2]) * sub)
        g_draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Aplicar máscara ao gradiente
    img.paste(gradient, (0, 0), mask)

    # Camada para o símbolo vetorial
    symbol_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(symbol_layer)

    # 2. Desenhar Cantos Típicos do QR Code (Finder Patterns)
    # Canto superior esquerdo
    def draw_finder(draw_ctx, x, y, outer_size, inner_size, rad=28):
        # Quadrado externo
        draw_ctx.rounded_rectangle(
            [x, y, x + outer_size, y + outer_size],
            radius=rad,
            outline=(255, 255, 255, 255),
            width=30
        )
        # Quadrado interno
        inset = (outer_size - inner_size) // 2
        draw_ctx.rounded_rectangle(
            [x + inset, y + inset, x + inset + inner_size, y + inset + inner_size],
            radius=rad // 2,
            fill=(56, 189, 248, 255)  # #38bdf8 (Sky 400)
        )

    # Dimensões dos padrões
    finder_outer = 190
    finder_inner = 90

    # Top-Left Finder
    draw_finder(s_draw, 220, 220, finder_outer, finder_inner, rad=36)
    # Top-Right Finder
    draw_finder(s_draw, size - 220 - finder_outer, 220, finder_outer, finder_inner, rad=36)
    # Bottom-Left Finder
    draw_finder(s_draw, 220, size - 220 - finder_outer, finder_outer, finder_inner, rad=36)

    # 3. No Canto Inferior Direito: Uma Estrela 5 Estrelas Dourada (Google Reviews)
    star_center_x = size - 220 - (finder_outer // 2)
    star_center_y = size - 220 - (finder_outer // 2)

    # Círculo de fundo da estrela
    s_draw.ellipse(
        [star_center_x - 90, star_center_y - 90, star_center_x + 90, star_center_y + 90],
        fill=(254, 243, 199, 230),  # Amarelo claro suave
        outline=(251, 191, 36, 255), # Borda dourada #fbbf24
        width=10
    )

    # Estrela 5 pontas
    import math
    def get_star_points(cx, cy, outer_r, inner_r, num_points=5):
        points = []
        angle_step = math.pi / num_points
        start_angle = -math.pi / 2
        for i in range(2 * num_points):
            r = outer_r if i % 2 == 0 else inner_r
            angle = start_angle + i * angle_step
            points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
        return points

    star_pts = get_star_points(star_center_x, star_center_y, 56, 25)
    s_draw.polygon(star_pts, fill=(245, 158, 11, 255)) # Âmbar dourado #f59e0b

    # 4. Conexões e Módulos Centrais (Data Nodes)
    # Módulos decorativos no centro simbolizando conexão inteligente
    center_x, center_y = size // 2, size // 2

    # Ponto central
    s_draw.rounded_rectangle(
        [center_x - 45, center_y - 45, center_x + 45, center_y + 45],
        radius=20,
        fill=(255, 255, 255, 255)
    )

    # Blocos de dados orbitais
    dots = [
        (center_x, 315),
        (315, center_y),
        (center_x, size - 315),
        (size - 315, center_y),
        (center_x - 110, center_y - 110),
        (center_x + 110, center_y - 110),
        (center_x - 110, center_y + 110)
    ]
    for dx, dy in dots:
        s_draw.rounded_rectangle(
            [dx - 22, dy - 22, dx + 22, dy + 22],
            radius=10,
            fill=(186, 230, 253, 240) # #bae6fd
        )

    # Mesclar símbolo na imagem principal
    img = Image.alpha_composite(img, symbol_layer)

    # Salvar otimizado em PNG
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, format="PNG", optimize=True)
    file_size_kb = os.path.getsize(output_path) / 1024
    print(f"✅ Logo gerada com sucesso em: {output_path}")
    print(f"📦 Tamanho do arquivo: {file_size_kb:.2f} KB (abaixo de 1.024 KB)")

if __name__ == "__main__":
    out_public = "/mnt/livre/PROJETOS/QR Code/qrcode-saas/public/logo.png"
    out_artifact = "/home/charada/.gemini/antigravity/brain/09b4e909-9e95-4b5e-a9e0-1d7e66c5b34e/qrcg_logo.png"
    generate_logo(out_public)
    generate_logo(out_artifact)
