import os
from PIL import Image

def generate_favicons():
    logo_path = "/mnt/livre/PROJETOS/QR Code/qrcode-saas/public/logo.png"
    if not os.path.exists(logo_path):
        print(f"Erro: {logo_path} não encontrado")
        return

    img = Image.open(logo_path).convert("RGBA")
    
    # 1. Gerar favicon.ico multi-resolução
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    
    app_ico = "/mnt/livre/PROJETOS/QR Code/qrcode-saas/app/favicon.ico"
    public_ico = "/mnt/livre/PROJETOS/QR Code/qrcode-saas/public/favicon.ico"
    
    img.save(app_ico, format="ICO", sizes=icon_sizes)
    img.save(public_ico, format="ICO", sizes=icon_sizes)
    print(f"✅ Favicon ICO gerado em {app_ico} e {public_ico}")

    # 2. Gerar app/icon.png (Padrão moderno do Next.js App Router para navegadores modernos)
    app_icon_png = "/mnt/livre/PROJETOS/QR Code/qrcode-saas/app/icon.png"
    icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(app_icon_png, format="PNG", optimize=True)
    print(f"✅ Next.js app/icon.png (192x192) gerado em {app_icon_png}")

    # 3. Gerar app/apple-icon.png (Para dispositivos iOS / Safari)
    app_apple_icon = "/mnt/livre/PROJETOS/QR Code/qrcode-saas/app/apple-icon.png"
    icon_180 = img.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save(app_apple_icon, format="PNG", optimize=True)
    print(f"✅ Next.js app/apple-icon.png (180x180) gerado em {app_apple_icon}")

if __name__ == "__main__":
    generate_favicons()
