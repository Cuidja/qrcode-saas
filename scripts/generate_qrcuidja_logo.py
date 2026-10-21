import os
import math
from PIL import Image, ImageDraw

def generate_qrcuidja_logo(output_path, size=1024):
    # Imagem base com transparência
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # 1. Background: Squircle com gradiente elegante Deep Royal Blue -> Vibrant Cyan
    padding = 48
    box = [padding, padding, size - padding, size - padding]
    corner_radius = 220

    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(box, radius=corner_radius, fill=255)

    gradient = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)

    # Cores do gradiente (Azul Noite Profundo -> Azul Real -> Ciano Tecnológico)
    c_top = (10, 15, 30)       # #0a0f1e
    c_mid = (2, 132, 199)      # #0284c7 (Sky Blue)
    c_bot = (14, 165, 233)     # #0ea5e9

    for y in range(size):
        ratio = y / size
        if ratio < 0.65:
            t = ratio / 0.65
            r = int(c_top[0] + (c_mid[0] - c_top[0]) * t)
            g = int(c_top[1] + (c_mid[1] - c_top[1]) * t)
            b = int(c_top[2] + (c_mid[2] - c_top[2]) * t)
        else:
            t = (ratio - 0.65) / 0.35
            r = int(c_mid[0] + (c_bot[0] - c_mid[0]) * t)
            g = int(c_mid[1] + (c_bot[1] - c_mid[1]) * t)
            b = int(c_mid[2] + (c_bot[2] - c_mid[2]) * t)
        g_draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    img.paste(gradient, (0, 0), mask)

    # 2. Camada do Emblema "Q" + "C" + QR Code + Google Star
    emblem = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    e_draw = ImageDraw.Draw(emblem)

    center_x, center_y = size // 2, size // 2 - 20

    # A) Três Finder Patterns estilizados (Cantos clássicos do QR Code)
    def draw_qr_corner(ctx, x, y, outer_s, inner_s, rad=32):
        ctx.rounded_rectangle(
            [x, y, x + outer_s, y + outer_s],
            radius=rad,
            outline=(255, 255, 255, 255),
            width=26
        )
        inset = (outer_s - inner_s) // 2
        ctx.rounded_rectangle(
            [x + inset, y + inset, x + inset + inner_s, y + inset + inner_s],
            radius=rad // 2,
            fill=(56, 189, 248, 255) # #38bdf8
        )

    f_outer = 170
    f_inner = 80
    f_pad = 210

    # Top-Left
    draw_qr_corner(e_draw, f_pad, f_pad, f_outer, f_inner)
    # Top-Right
    draw_qr_corner(e_draw, size - f_pad - f_outer, f_pad, f_outer, f_inner)
    # Bottom-Left
    draw_qr_corner(e_draw, f_pad, size - f_pad - f_outer - 40, f_outer, f_inner)

    # B) No canto inferior direito: Emblema do "C" (Cuidja) entrelaçado com a Estrela Dourada
    c_box_x = size - f_pad - f_outer
    c_box_y = size - f_pad - f_outer - 40

    # Arco do "C" em branco espesso moderno
    e_draw.arc(
        [c_box_x + 10, c_box_y + 10, c_box_x + f_outer - 10, c_box_y + f_outer - 10],
        start=45, end=315,
        fill=(255, 255, 255, 255),
        width=26
    )

    # Círculo dourado de destaque para Avaliação 5 Estrelas
    star_cx = c_box_x + f_outer // 2
    star_cy = c_box_y + f_outer // 2

    e_draw.ellipse(
        [star_cx - 48, star_cy - 48, star_cx + 48, star_cy + 48],
        fill=(254, 243, 199, 255),
        outline=(251, 191, 36, 255),
        width=6
    )

    # Estrela de 5 pontas central no "C"
    def get_star(cx, cy, r_out, r_in):
        pts = []
        for i in range(10):
            r = r_out if i % 2 == 0 else r_in
            ang = -math.pi / 2 + i * (math.pi / 5)
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
        return pts

    star_points = get_star(star_cx, star_cy, 30, 14)
    e_draw.polygon(star_points, fill=(245, 158, 11, 255)) # #f59e0b

    # C) Núcleo Central: Grande "Q" Tecnológico em Módulos
    # Ponto central e conexões
    core_cx = center_x
    core_cy = center_y + 5

    # Centro em destaque (branco arredondado)
    e_draw.rounded_rectangle(
        [core_cx - 40, core_cy - 40, core_cx + 40, core_cy + 40],
        radius=16,
        fill=(255, 255, 255, 255)
    )

    # Módulos orbitais de dados (Ciano claro)
    data_nodes = [
        (core_cx - 100, core_cy),
        (core_cx + 100, core_cy),
        (core_cx, core_cy - 100),
        (core_cx, core_cy + 100),
        (core_cx - 70, core_cy - 70),
        (core_cx + 70, core_cy - 70),
        (core_cx - 70, core_cy + 70),
    ]
    for nx, ny in data_nodes:
        e_draw.rounded_rectangle(
            [nx - 18, ny - 18, nx + 18, ny + 18],
            radius=8,
            fill=(186, 230, 253, 230)
        )

    # Cauda do "Q" conectando ao "C" (diagonal estilizada)
    e_draw.rounded_rectangle(
        [core_cx + 48, core_cy + 48, core_cx + 96, core_cy + 96],
        radius=12,
        fill=(56, 189, 248, 255) # Conexão vibrante
    )

    # D) Letreiro "QR CUIDJA" na base do ícone (Limpo, legível e moderno)
    # Banner pill suave na parte inferior
    pill_w = 420
    pill_h = 76
    pill_x = (size - pill_w) // 2
    pill_y = size - 140

    e_draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=38,
        fill=(255, 255, 255, 230),
        outline=(255, 255, 255, 255),
        width=3
    )

    # Desenhar texto "QR CUIDJA" com curvas vetoriais simples para não depender de fontes externas do sistema
    # Vamos usar tipografia limpa vetorial
    try:
        from PIL import ImageFont
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
        ]
        font = None
        for fp in font_paths:
            if os.path.exists(fp):
                font = ImageFont.truetype(fp, 36)
                break
        if font:
            text = "QR CUIDJA"
            bbox = e_draw.textbbox((0, 0), text, font=font)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            tx = pill_x + (pill_w - tw) // 2
            ty = pill_y + (pill_h - th) // 2 - 3
            e_draw.text((tx, ty), text, font=font, fill=(15, 23, 42, 255))
    except Exception as ex:
        print(f"Aviso de fonte: {ex}")

    img = Image.alpha_composite(img, emblem)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, format="PNG", optimize=True)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"🎉 Nova Logo Qr Cuidja criada: {output_path}")
    print(f"📏 Resolução: {size}x{size} | Tamanho: {size_kb:.2f} KB")

if __name__ == "__main__":
    out_public = "/mnt/livre/PROJETOS/QR Code/qrcode-saas/public/logo.png"
    out_artifact = "/home/charada/.gemini/antigravity/brain/09b4e909-9e95-4b5e-a9e0-1d7e66c5b34e/qr_cuidja_logo.png"
    generate_qrcuidja_logo(out_public)
    generate_qrcuidja_logo(out_artifact)
