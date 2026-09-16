import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRHub — QR Codes Dinâmicos com Google Reviews",
  description: "Crie QR Codes dinâmicos, conecte com Google Reviews e grave tags NFC. Rastreie cada scan em tempo real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Ambient orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Custom cursor */}
        <div id="cursor-dot" suppressHydrationWarning />
        <div id="cursor-ring" suppressHydrationWarning />

        <div style={{ position: "relative", zIndex: 2 }}>
          {children}
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const dot = document.getElementById('cursor-dot');
            const ring = document.getElementById('cursor-ring');
            if (!dot || !ring) return;

            let mouseX = 0, mouseY = 0;
            let ringX = 0, ringY = 0;
            let raf;

            document.addEventListener('mousemove', (e) => {
              mouseX = e.clientX;
              mouseY = e.clientY;
              dot.style.left = mouseX + 'px';
              dot.style.top = mouseY + 'px';
            });

            function lerp(a, b, t) { return a + (b - a) * t; }

            function animateRing() {
              ringX = lerp(ringX, mouseX, 0.12);
              ringY = lerp(ringY, mouseY, 0.12);
              ring.style.left = ringX + 'px';
              ring.style.top = ringY + 'px';
              raf = requestAnimationFrame(animateRing);
            }
            animateRing();

            // Hover effect on interactive elements
            const hoverEls = document.querySelectorAll('a, button, [data-hover]');
            hoverEls.forEach(el => {
              el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
              el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
            });

            // Re-bind on DOM changes
            const observer = new MutationObserver(() => {
              document.querySelectorAll('a, button, [data-hover]').forEach(el => {
                el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
                el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
              });
            });
            observer.observe(document.body, { childList: true, subtree: true });
          })();
        `}} />
      </body>
    </html>
  );
}
