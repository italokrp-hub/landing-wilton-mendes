import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WILTON } from '../config/broker';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 101;
const WA_NUMBER = WILTON.whatsapp || '5592984138859';
const WA_MSG_SCROLL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  'Olá, Wilton! Acompanhei a evolução da construção no site e quero informações sobre as unidades exclusivas disponíveis.'
)}`;

// Candidate naming conventions for the 101 frames (prioritizing optimized WebP)
const PATTERN_GENERATORS = [
  (i: number) => `/frames/frame_${String(i).padStart(5, '0')}.webp`,
  (i: number) => `/frames/frame_${String(i).padStart(4, '0')}.webp`,
  (i: number) => `/frames/frame_${String(i).padStart(3, '0')}.webp`,
  (i: number) => `/frames/frame_${i}.webp`,
  (i: number) => `/frames/frame_${String(i).padStart(5, '0')}.png`,
  (i: number) => `/frames/frame_${String(i).padStart(4, '0')}.png`,
  (i: number) => `/frames/frame_${String(i).padStart(3, '0')}.png`,
  (i: number) => `/frames/frame_${i}.png`,
];

export default function BuildingScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [framesAvailable, setFramesAvailable] = useState<boolean | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const activeFrameRef = useRef<number>(1);
  const progressRef = useRef<number>(0);

  // Fallback procedural architectural blueprint if images aren't present
  const drawBlueprintFallback = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark luxury blueprint background
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, w, h);

    // Subtle isometric architectural grid
    ctx.strokeStyle = 'rgba(245, 197, 66, 0.05)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Tower wireframe dimensions
    const towerW = Math.min(w * 0.45, 360);
    const towerMaxH = h * 0.72;
    const currentTowerH = Math.max(40, towerMaxH * (0.15 + 0.85 * progress));
    const towerX = (w - towerW) / 2;
    const towerBaseY = h * 0.88;
    const towerTopY = towerBaseY - currentTowerH;

    const grad = ctx.createLinearGradient(towerX, towerBaseY, towerX, towerTopY);
    grad.addColorStop(0, 'rgba(245, 197, 66, 0.18)');
    grad.addColorStop(0.7, 'rgba(245, 197, 66, 0.08)');
    grad.addColorStop(1, 'rgba(245, 197, 66, 0.01)');

    ctx.fillStyle = grad;
    ctx.fillRect(towerX, towerTopY, towerW, currentTowerH);

    ctx.strokeStyle = 'rgba(245, 197, 66, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(towerX, towerTopY, towerW, currentTowerH);

    const totalFloors = 32;
    const currentFloors = Math.floor(totalFloors * progress);
    const floorH = currentTowerH / Math.max(1, currentFloors || 1);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= currentFloors; i++) {
      const fy = towerBaseY - i * floorH;
      ctx.beginPath();
      ctx.moveTo(towerX, fy);
      ctx.lineTo(towerX + towerW, fy);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 197, 66, 0.12)';
      for (let c = 1; c < 5; c++) {
        const cx = towerX + (towerW / 5) * c;
        ctx.beginPath();
        ctx.moveTo(cx, fy);
        ctx.lineTo(cx, fy + floorH);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(towerX - 60, towerBaseY);
    ctx.lineTo(towerX + towerW + 60, towerBaseY);
    ctx.stroke();
  }, []);

  // Draw frame with responsive object-cover
  const renderFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameNumber - 1];

    if (!img || !img.complete || img.naturalWidth === 0) {
      if (framesAvailable === false || framesAvailable === null) {
        drawBlueprintFallback(progressRef.current);
      }
      return;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, nx, ny, nw, nh);
  }, [drawBlueprintFallback, framesAvailable]);

  // Adjust canvas resolution for Retina & High-DPI screens
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      renderFrame(activeFrameRef.current);
    }
  }, [renderFrame]);

  // Preload and probe 101 frames
  useEffect(() => {
    let isCancelled = false;

    async function probeAndLoad() {
      let workingPattern = PATTERN_GENERATORS[0];
      let foundPattern = false;

      for (const generator of PATTERN_GENERATORS) {
        const testUrl = generator(1);
        try {
          const loaded = await new Promise<boolean>((resolve) => {
            const probeImg = new Image();
            probeImg.onload = () => resolve(true);
            probeImg.onerror = () => resolve(false);
            probeImg.src = testUrl;
          });

          if (loaded) {
            workingPattern = generator;
            foundPattern = true;
            break;
          }
        } catch {
          // continue search
        }
      }

      if (isCancelled) return;

      if (!foundPattern) {
        setFramesAvailable(false);
        drawBlueprintFallback(0);
        return;
      }

      setFramesAvailable(true);

      const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
      let count = 0;

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = workingPattern(i);

        img.onload = () => {
          if (isCancelled) return;
          count++;
          setLoadingProgress(Math.round((count / TOTAL_FRAMES) * 100));

          if (count === 1) {
            renderFrame(1);
          }

          if (count >= TOTAL_FRAMES * 0.95 || count === TOTAL_FRAMES) {
            setIsLoaded(true);
          }
        };

        img.onerror = () => {
          if (isCancelled) return;
          count++;
          setLoadingProgress(Math.round((count / TOTAL_FRAMES) * 100));
        };

        loadedImages[i - 1] = img;
      }

      imagesRef.current = loadedImages;
    }

    probeAndLoad();
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawBlueprintFallback, renderFrame, resizeCanvas]);

  // GSAP ScrollTrigger
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const frameIndex = Math.min(
            TOTAL_FRAMES,
            Math.max(1, Math.round(1 + progress * (TOTAL_FRAMES - 1)))
          );

          progressRef.current = progress;
          activeFrameRef.current = frameIndex;
          setCurrentFrame(frameIndex);
          setScrollProgress(progress);
          renderFrame(frameIndex);
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [renderFrame]);

  // Stage flags
  // 1. Início da obra: Frames 1 - 35
  const isCard1Active = currentFrame >= 1 && currentFrame <= 35;
  // 2. Meio da obra: Frames 36 - 75
  const isCard2Active = currentFrame >= 36 && currentFrame <= 75;
  // 3. Prédio pronto: Frames 76 - 101
  const isCard3Active = currentFrame >= 76 && currentFrame <= 101;

  const currentPhaseName = isCard1Active
    ? 'Fase 01 • Fundação'
    : isCard2Active
    ? 'Fase 02 • Fachada'
    : 'Fase 03 • Conclusão';

  const progressPercentage = Math.round(scrollProgress * 100);

  return (
    <section
      ref={containerRef}
      id="scrollytelling-torre"
      className="relative h-[420vh] w-full bg-slate-950 text-white select-none"
    >
      {/* Sticky Viewport with 100dvh for mobile Safari & Chrome */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover block pointer-events-none"
        />

        {/* Ambient Subtle Vignette - Kept light & transparent so the building stands out */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 60%, rgba(2, 6, 23, 0.45) 100%)',
          }}
        />
        {/* Soft top gradient */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-slate-950/70 to-transparent pointer-events-none" />
        {/* Soft bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

        {/* Preload Indicator bar */}
        {!isLoaded && framesAvailable && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-full shadow-lg">
            <div className="w-2.5 h-2.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] sm:text-xs font-semibold text-amber-300">
              {loadingProgress}%
            </span>
          </div>
        )}

        {/* Top Header HUD: Minimalist Real Estate Phase Tracker */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-12 z-20 flex items-center gap-2 sm:gap-3 bg-slate-950/60 backdrop-blur-md border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black text-amber-400">
              {currentPhaseName}
            </span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
            <strong className="text-white font-black">{progressPercentage}%</strong>
          </span>
        </div>

        {/* Floating Minimalist Cards Layer */}
        {/* Desktop: positioned on left side / Mobile: positioned at bottom-24 leaving 70% of canvas totally free */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end sm:justify-center items-center sm:items-start p-4 sm:p-12 pb-24 sm:pb-12">

          {/* CARD 1: Início da Construção */}
          <div
            className={`pointer-events-auto w-full max-w-sm sm:max-w-md transition-all duration-500 ease-out transform ${
              isCard1Active
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-3 scale-95 pointer-events-none absolute'
            }`}
          >
            <div className="p-3.5 sm:p-5 bg-slate-950/50 backdrop-blur-md border border-amber-400/25 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-amber-400/15 border border-amber-400/30 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  01 • Fundação & Solo
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-400">
                  Melhor Custo/m²
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                Solidez & Rentabilidade na Planta
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mt-1">
                Ponto de entrada ideal com até +35% de valorização estimada e blindagem patrimonial.
              </p>

              <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-white/10 text-[10px] sm:text-xs">
                <span className="text-amber-400 font-bold">📈 +35% Estimativa</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">🛡️ 100% Jurídico</span>
              </div>
            </div>
          </div>

          {/* CARD 2: Meio da Obra / Vidraças */}
          <div
            className={`pointer-events-auto w-full max-w-sm sm:max-w-md transition-all duration-500 ease-out transform ${
              isCard2Active
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-3 scale-95 pointer-events-none absolute'
            }`}
          >
            <div className="p-3.5 sm:p-5 bg-slate-950/50 backdrop-blur-md border border-amber-400/25 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-amber-400/15 border border-amber-400/30 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  02 • Engenharia & Fachada
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-400">
                  Alta Liquidez
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                Pele de Vidro & Design Icônico
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mt-1">
                Arquitetura contemporânea e conforto termoacústico no skyline nobre de Manaus.
              </p>

              <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-white/10 text-[10px] sm:text-xs">
                <span className="text-amber-400 font-bold">💎 Fachada de Vidro</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">📍 Endereço Nobre</span>
              </div>
            </div>
          </div>

          {/* CARD 3: Prédio Pronto e Iluminado */}
          <div
            className={`pointer-events-auto w-full max-w-sm sm:max-w-md transition-all duration-500 ease-out transform ${
              isCard3Active
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-3 scale-95 pointer-events-none absolute'
            }`}
          >
            <div className="p-3.5 sm:p-5 bg-slate-950/55 backdrop-blur-md border border-amber-400/30 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-400/40 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  03 • Conclusão & Entrega
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Pronto
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                Pronto para Morar ou Rentabilizar
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mt-1 mb-2.5">
                Acabamentos nobres entregues com alto padrão e liquidez imediata para moradia ou renda.
              </p>

              {/* Call to Action WhatsApp Button */}
              <a
                href={WA_MSG_SCROLL}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-scrollytelling-whatsapp"
                className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-amber-400/20 active:scale-[0.98]"
              >
                <svg className="w-4 h-4 text-slate-950 transition-transform group-hover:scale-110 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Consultar Unidades no WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Milestone Markers & Edge Progress Line */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-4 sm:left-12 z-20 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-semibold text-slate-400 pointer-events-none">
          <span className={`transition-colors ${isCard1Active ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
            01 Fundação
          </span>
          <span className="text-slate-700">•</span>
          <span className={`transition-colors ${isCard2Active ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
            02 Fachada
          </span>
          <span className="text-slate-700">•</span>
          <span className={`transition-colors ${isCard3Active ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
            03 Pronto
          </span>
        </div>

        {/* Clean 3px Progress Line pinned to the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-30 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

      </div>
    </section>
  );
}
