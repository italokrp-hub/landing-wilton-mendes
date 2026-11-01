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

    // Golden glow behind the tower
    const grad = ctx.createLinearGradient(towerX, towerBaseY, towerX, towerTopY);
    grad.addColorStop(0, 'rgba(245, 197, 66, 0.18)');
    grad.addColorStop(0.7, 'rgba(245, 197, 66, 0.08)');
    grad.addColorStop(1, 'rgba(245, 197, 66, 0.01)');

    ctx.fillStyle = grad;
    ctx.fillRect(towerX, towerTopY, towerW, currentTowerH);

    // Tower outer frame
    ctx.strokeStyle = 'rgba(245, 197, 66, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(towerX, towerTopY, towerW, currentTowerH);

    // Floor lines
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

    // Ground platform
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

      // Probe each pattern candidate
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

      // Preload all 101 frames into memory
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

  // Real estate phase badge based on progression
  const currentPhaseName = isCard1Active
    ? 'Fase 01 • Fundação & Solo'
    : isCard2Active
    ? 'Fase 02 • Estrutura & Fachada'
    : 'Fase 03 • Conclusão & Entrega';

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

        {/* Ambient Vignette & Smooth Contrast Gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(2, 6, 23, 0.78) 100%)',
          }}
        />
        {/* Top gradient overlay */}
        <div className="absolute inset-x-0 top-0 h-36 sm:h-44 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
        {/* Bottom gradient overlay with extra depth for mobile cards */}
        <div className="absolute inset-x-0 bottom-0 h-52 sm:h-48 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pointer-events-none" />

        {/* Preload Indicator bar (discreet, luxury design) */}
        {!isLoaded && framesAvailable && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 px-3.5 py-1.5 rounded-full shadow-lg">
            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] font-semibold text-amber-300">
              Carregando {loadingProgress}%
            </span>
          </div>
        )}

        {/* Top Header HUD: Professional Real Estate Construction Tracker */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-12 z-20 flex items-center gap-2.5 sm:gap-4 bg-slate-950/80 backdrop-blur-xl border border-white/15 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-500" />
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black text-amber-400">
              {currentPhaseName}
            </span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
            <strong className="text-white font-black">{progressPercentage}%</strong> concluído
          </span>
        </div>

        {/* Floating Text Cards Layer (Mobile-first: positioned on bottom half on mobile, left on desktop) */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 flex flex-col justify-end sm:justify-center items-center sm:items-start pointer-events-none pb-20 sm:pb-0 min-h-[100dvh]">

          {/* CARD 1: Início da Construção */}
          <div
            className={`pointer-events-auto w-full max-w-md sm:max-w-lg transition-all duration-500 ease-out transform ${
              isCard1Active
                ? 'opacity-100 translate-y-0 scale-100 blur-none'
                : 'opacity-0 translate-y-4 scale-95 blur-sm pointer-events-none absolute'
            }`}
          >
            <div className="p-5 sm:p-8 bg-slate-950/85 backdrop-blur-2xl border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

              <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-amber-400/15 border border-amber-400/30 rounded-full text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Etapa Inicial • Fundação
                </span>
                <span className="text-[11px] font-semibold text-amber-400/90">
                  Melhor Custo/m²
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight leading-snug">
                Solidez Estrutural &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  Rentabilidade na Planta
                </span>
              </h3>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-light">
                O início da fundação é o momento de maior potencial de valorização. Investir na planta garante condições exclusivas de aquisição e sólida blindagem patrimonial em Manaus com assessoria Wilton Mendes.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/5">
                  <p className="text-amber-400 font-black text-base sm:text-xl">+35%</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wide">Valorização Média</p>
                </div>
                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/5">
                  <p className="text-white font-black text-base sm:text-xl">100%</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wide">Segurança Jurídica</p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Meio da Obra / Vidraças */}
          <div
            className={`pointer-events-auto w-full max-w-md sm:max-w-lg transition-all duration-500 ease-out transform ${
              isCard2Active
                ? 'opacity-100 translate-y-0 scale-100 blur-none'
                : 'opacity-0 translate-y-4 scale-95 blur-sm pointer-events-none absolute'
            }`}
          >
            <div className="p-5 sm:p-8 bg-slate-950/85 backdrop-blur-2xl border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

              <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-amber-400/15 border border-amber-400/30 rounded-full text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Etapa Avançada • Fachada
                </span>
                <span className="text-[11px] font-semibold text-amber-400/90">
                  Alta Liquidez
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight leading-snug">
                Arquitetura Moderna &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  Localização Privilegiada
                </span>
              </h3>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-light">
                A elevação da estrutura e o fechamento em pele de vidro transformam o skyline urbano. Materiais termoacústicos de última geração unem sofisticação, conforto térmico e valorização consistente.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/5">
                  <p className="text-amber-400 font-bold text-xs sm:text-base">Pele de Vidro</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wide">Design Contemporâneo</p>
                </div>
                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/5">
                  <p className="text-white font-bold text-xs sm:text-base">Região Nobre</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wide">Polo de Alta Demanda</p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: Prédio Pronto e Iluminado */}
          <div
            className={`pointer-events-auto w-full max-w-md sm:max-w-lg transition-all duration-500 ease-out transform ${
              isCard3Active
                ? 'opacity-100 translate-y-0 scale-100 blur-none'
                : 'opacity-0 translate-y-4 scale-95 blur-sm pointer-events-none absolute'
            }`}
          >
            <div className="p-5 sm:p-8 bg-slate-950/90 backdrop-blur-2xl border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

              <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Etapa Final • Obra Concluída
                </span>
                <span className="text-[11px] font-semibold text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Pronto para Morar
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight leading-snug">
                Pronto para Morar ou<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  Multiplicar Seu Capital
                </span>
              </h3>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-light">
                O empreendimento concluído materializa o requinte absoluto com iluminação cênica e áreas nobres equipadas. Imóveis prontos para morar com elegância ou auferir rendimentos imediatos com aluguel premium.
              </p>

              {/* Call to Action WhatsApp Button */}
              <a
                href={WA_MSG_SCROLL}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-scrollytelling-whatsapp"
                className="group w-full flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-5 h-5 text-slate-950 transition-transform group-hover:scale-110 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Falar com Wilton no WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Interactive Phase Stepper Indicator (Optimized for Mobile & Desktop) */}
        <div className="absolute bottom-4 sm:bottom-8 inset-x-3 sm:inset-x-12 z-20 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 pointer-events-none">
          {/* Milestone markers */}
          <div className="flex items-center gap-1.5 sm:gap-4 bg-slate-950/80 backdrop-blur-xl border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs">
            <span className={`transition-colors font-bold ${isCard1Active ? 'text-amber-400' : 'text-slate-500'}`}>
              01 Fundação
            </span>
            <span className="text-slate-700">•</span>
            <span className={`transition-colors font-bold ${isCard2Active ? 'text-amber-400' : 'text-slate-500'}`}>
              02 Fachada
            </span>
            <span className="text-slate-700">•</span>
            <span className={`transition-colors font-bold ${isCard3Active ? 'text-amber-400' : 'text-slate-500'}`}>
              03 Concluído
            </span>
          </div>

          {/* Sleek Progress Bar */}
          <div className="w-48 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
