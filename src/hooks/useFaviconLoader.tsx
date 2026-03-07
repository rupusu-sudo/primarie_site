import { useEffect, useRef } from 'react';

export const useFaviconLoader = (loading: boolean) => {
  // Păstrăm referința la iconița originală
  const originalFavicon = useRef<string | null>(null);

  useEffect(() => {
    // Căutăm tag-ul <link rel="icon">
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    
    // Dacă nu există, îl creăm (fallback)
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    // Salvăm iconița originală (stema) doar prima dată
    if (!originalFavicon.current) {
      originalFavicon.current = link.href;
    }

    // Dacă NU se încarcă, punem stema la loc și oprim
    if (!loading) {
      if (originalFavicon.current) link.href = originalFavicon.current;
      return;
    }

    // --- DESENARE CANVAS ---
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    let angle = 0;
    let animationFrameId: number;

    const draw = () => {
      if (!ctx) return;

      // 1. Curățăm
      ctx.clearRect(0, 0, 32, 32);

      // 2. Cerc fundal (gri deschis)
      ctx.beginPath();
      ctx.arc(16, 16, 12, 0, 2 * Math.PI);
      ctx.strokeStyle = '#e2e8f0'; 
      ctx.lineWidth = 4;
      ctx.stroke();

      // 3. Arc activ (albastru - culoarea primăriei)
      ctx.beginPath();
      ctx.arc(16, 16, 12, angle, angle + 1.5 * Math.PI);
      ctx.strokeStyle = '#2563eb'; 
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // 4. Punem imaginea generată ca favicon
      link!.href = canvas.toDataURL('image/png');

      // 5. Rotim
      angle += 0.2;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (originalFavicon.current && link) link.href = originalFavicon.current;
    };
  }, [loading]);
};