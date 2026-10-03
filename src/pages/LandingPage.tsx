import { useState, useEffect, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const WA_NUMBER = '5592984179972';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

const waLink = (msg: string) =>
  `${WA_BASE}?text=${encodeURIComponent(msg)}`;

const WA_MSG_GERAL     = waLink('Olá, Wilton! Vi seu site e gostaria de uma consultoria imobiliária em Manaus.');
const WA_MSG_COMPRA    = waLink('Olá, Wilton! Quero ajuda para *comprar* um imóvel em Manaus. Pode me orientar?');

const WA_MSG_FINANC    = waLink('Olá, Wilton! Quero saber mais sobre *financiamento imobiliário*. Como funciona a análise de crédito?');
const WA_MSG_REGULAR   = waLink('Olá, Wilton! Tenho dúvidas sobre *regularização e documentação* de imóvel. Pode me ajudar?');
const WA_MSG_ADMIN     = waLink('Olá, Wilton! Preciso de *administração do meu imóvel*. Pode me dar mais informações?');
const WA_MSG_AGENDAR   = waLink('Olá, Wilton! Gostaria de *agendar uma consultoria* presencial ou online. Qual sua disponibilidade?');

// ── Intersection Observer hook ────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── WhatsApp floating button ──────────────────────────────────────────────────
function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={WA_MSG_GERAL}
      target="_blank"
      rel="noopener noreferrer"
      id="btn-whatsapp-fab"
      aria-label="Falar com Wilton no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
    >
      {/* Label bubble */}
      <span className="hidden sm:block bg-white text-slate-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Falar com Wilton
      </span>
      {/* Button */}
      <div className="relative wa-ring">
        <div className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl animate-wa-bounce transition-colors duration-200">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </div>
    </a>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = [
    { label: 'Sobre', id: 'sobre' },
    { label: 'Serviços', id: 'servicos' },
    { label: 'Depoimentos', id: 'depoimentos' },
    { label: 'Localização', id: 'localizacao' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group">
          <img
            src="/images/wilton.jpg"
            alt="Wilton Mendes"
            className="w-10 h-10 rounded-full object-cover object-top border-2 border-amber-400 shrink-0"
          />
          <div className="text-left hidden sm:block">
            <p className={`text-sm font-black leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              Wilton Mendes
            </p>
            <p className={`text-[10px] font-medium leading-none transition-colors ${scrolled ? 'text-slate-500' : 'text-white/70'}`}>
              Negócios Imobiliários · CRECI 7473
            </p>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`nav-link transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href={WA_MSG_GERAL}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-header-whatsapp"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-700' : 'text-white'}`}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-sm border-t border-slate-100 animate-slide-down">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left text-slate-700 font-medium px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a
              href={WA_MSG_GERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Imóvel de luxo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950 lg:via-slate-950/90 lg:to-slate-950/30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 w-full mt-16 lg:mt-0">
        
        {/* Text content */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-200 text-xs sm:text-sm font-medium mb-6 animate-fade-in-up">
            <span className="text-amber-400 text-sm">⭐</span> 5.0 no Google (23 avaliações) <span className="opacity-50">•</span> CRECI 7473
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight animate-fade-in-up delay-100 uppercase">
            Encontre o imóvel ideal em Manaus com segurança e exclusividade
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed mb-10 max-w-2xl animate-fade-in-up delay-200">
            Assessoria imobiliária completa para compra, venda e financiamento de imóveis de alto padrão e oportunidades únicas com Wilton Mendes.
          </p>

          {/* CTAs & Mini Profile Mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
            {/* CTA Primary */}
            <a
              href={WA_MSG_AGENDAR}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-hero-agendar"
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] active:scale-95"
            >
              <svg className="w-6 h-6 animate-wa-bounce" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Falar com Wilton Mendes no WhatsApp
            </a>
            {/* CTA Secondary */}
            <button
              onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all duration-300 active:scale-95"
            >
              Conhecer Serviços
            </button>
          </div>

          {/* Mini Profile Info Mobile (Floating effect on Desktop) */}
          <div className="mt-12 lg:hidden flex items-center gap-4 p-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 animate-fade-in-up delay-400">
            <img src="/images/wilton.jpg" alt="Wilton Mendes" className="w-14 h-14 rounded-full object-cover border-2 border-amber-400" />
            <div className="text-left">
              <p className="text-white font-bold flex items-center gap-1.5">
                Wilton Mendes
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </p>
              <p className="text-slate-300 text-xs">Especialista de Alto Padrão</p>
            </div>
          </div>

        </div>

        {/* Floating Mini Profile Desktop */}
        <div className="hidden lg:block animate-fade-in-right delay-500">
          <div className="relative p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-float">
             <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-amber-400/20 to-blue-500/20 blur-xl opacity-50" />
             <div className="relative flex flex-col items-center">
                <img src="/images/wilton.jpg" alt="Wilton Mendes" className="w-32 h-32 rounded-full object-cover border-4 border-slate-800 shadow-xl mb-4" />
                <h3 className="text-white font-bold text-xl flex items-center gap-1.5">
                  Wilton Mendes
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </h3>
                <p className="text-slate-300 text-sm mb-4 text-center">Consultor de Elite<br/>em Manaus</p>
                <div className="w-full h-px bg-white/10 mb-4" />
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-amber-400 font-bold">💎</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Experiência</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-white font-bold">500+</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Negócios</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 z-10">
        <span className="text-white text-[10px] uppercase tracking-widest font-semibold">Descubra</span>
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  );
}

// ── Trust Bar ─────────────────────────────────────────────────────────────────
function TrustBar() {
  const { ref, inView } = useInView();
  const stats = [
    { value: '5.0', label: 'Avaliação Google', icon: '⭐' },
    { value: '23', label: 'Clientes avaliaram', icon: '👥' },
    { value: 'CRECI', label: '7473 — Registrado', icon: '📋' },
    { value: 'Manaus', label: 'Especialista local', icon: '📍' },
  ];
  return (
    <section className="bg-slate-900 py-10">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span className="text-3xl mb-2">{s.icon}</span>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-slate-400 text-sm font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Services Section ──────────────────────────────────────────────────────────
function ServicesSection() {
  const { ref, inView } = useInView();

  const services = [
    {
      id: 'compra-venda',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      title: 'Compra e Venda',
      description: 'Encontre o imóvel ideal para sua família ou venda seu imóvel com avaliação justa de mercado. Negociação transparente e segura do início ao fim.',
      cta: WA_MSG_COMPRA,
      ctaLabel: 'Quero comprar / vender',
      color: '#0a1628',
    },
    {
      id: 'financiamento',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Financiamento e Crédito',
      description: 'Apoio completo na aprovação bancária com as melhores taxas disponíveis. Simulação, documentação e acompanhamento junto ao banco.',
      cta: WA_MSG_FINANC,
      ctaLabel: 'Simular financiamento',
      color: '#1d4ed8',
    },
    {
      id: 'regularizacao',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Regularização e Documentação',
      description: 'Segurança jurídica para sua transação. Análise de matrícula, averbações, certidões e escritura. Sem burocracia, sem surpresas.',
      cta: WA_MSG_REGULAR,
      ctaLabel: 'Regularizar meu imóvel',
      color: '#065f46',
    },
    {
      id: 'administracao',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
        </svg>
      ),
      title: 'Administração de Imóveis',
      description: 'Gestão profissional para investidores e proprietários. Captação de inquilinos, contratos, cobrança e manutenção predial com relatórios periódicos.',
      cta: WA_MSG_ADMIN,
      ctaLabel: 'Administrar meu imóvel',
      color: '#7c3aed',
    },
  ];

  return (
    <section id="servicos" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">O que faço por você</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Serviços Especializados
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Profissional com amplo conhecimento no mercado imobiliário de Manaus, com atendimento ético e personalizado para cada etapa da sua jornada.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.id}
              className={`service-card bg-white rounded-2xl border border-slate-100 p-6 flex flex-col transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120 + 200}ms` }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white"
                style={{ background: s.color }}
              >
                {s.icon}
              </div>
              <h3 className="text-base font-black text-slate-900 mb-3">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">{s.description}</p>
              <a
                href={s.cta}
                target="_blank"
                rel="noopener noreferrer"
                id={`btn-servico-${s.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold transition-colors"
                style={{ color: s.color }}
              >
                {s.ctaLabel}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── About Section ─────────────────────────────────────────────────────────────
function AboutSection() {
  const { ref, inView } = useInView();

  const highlights = [
    { icon: '🏆', title: 'Avaliação 5.0', desc: 'Nota máxima no Google com 23 clientes satisfeitos' },
    { icon: '📋', title: 'CRECI 7473', desc: 'Registro ativo no Conselho Regional de Corretores' },
    { icon: '🤝', title: 'Atendimento ético', desc: 'Transparência e honestidade em cada negociação' },
    { icon: '⚡', title: 'Resultado ágil', desc: 'Processos enxutos para você economizar tempo' },
  ];

  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Photo side */}
          <div className={`relative transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div
              className="absolute -inset-4 rounded-3xl opacity-20"
              style={{ background: 'linear-gradient(135deg, #0a1628, #3b82f6)', filter: 'blur(32px)' }}
            />
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
              <img
                src="/images/wilton.jpg"
                alt="Wilton Mendes — Corretor de Imóveis e Consultor Imobiliário em Manaus"
                className="w-full h-96 object-cover object-top"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6">
                <p className="text-white font-black text-lg">Wilton Mendes</p>
                <p className="text-slate-300 text-sm">Corretor de Imóveis · CRECI 7473</p>
                <div className="flex items-center gap-2 mt-2">
                  <Stars />
                  <span className="text-amber-400 font-bold text-sm">5.0 no Google</span>
                </div>
              </div>
            </div>

            {/* Floating experience badge */}
            <div className="absolute -top-6 -right-6 bg-slate-900 text-white rounded-2xl shadow-2xl p-4 text-center">
              <p className="text-3xl font-black text-amber-400">💎</p>
              <p className="text-xs text-slate-400 font-medium leading-tight">Experiência<br />Comprovada</p>
            </div>
          </div>

          {/* Text side */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">Quem é Wilton Mendes</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              O consultor que você queria ter ao seu lado
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-slate-600 leading-relaxed mb-4">
              Nascido e criado em Manaus, conheço o mercado imobiliário local como poucos. Como um profissional com amplo conhecimento no mercado imobiliário, acompanhei centenas de famílias e investidores a realizarem seus sonhos — sempre com honestidade, clareza e dedicação total ao cliente.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Meu compromisso vai além da venda: fico ao seu lado desde a busca do imóvel até a assinatura das escrituras. Porque comprar ou vender um imóvel é uma das decisões mais importantes da sua vida — e você merece um profissional à altura dessa responsabilidade.
            </p>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                  <span className="text-2xl">{h.icon}</span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{h.title}</p>
                    <p className="text-slate-500 text-xs leading-tight mt-0.5">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={WA_MSG_AGENDAR}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-sobre-agendar"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Falar com Wilton
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Reviews Section ───────────────────────────────────────────────────────────
function ReviewsSection() {
  const { ref, inView } = useInView();

  const reviews = [
    {
      name: 'Lília Bindá',
      initials: 'LB',
      color: '#0a1628',
      time: 'há 2 meses',
      text: 'Profissional dedicado, confiável e muito gentil. Esclareceu todas as dúvidas com muita paciência e atenção, oferecendo o melhor atendimento. Recomendo a todos!',
    },
    {
      name: 'Emanuella Braga',
      initials: 'EB',
      color: '#1d4ed8',
      time: 'há 3 meses',
      text: 'Profissional excelente, super atencioso e encontrou exatamente o imóvel que eu queria. Muito honesto e transparente em todo o processo. Nota 10!',
    },
    {
      name: 'Moises Lopes Medeiros',
      initials: 'ML',
      color: '#065f46',
      time: 'há 4 meses',
      text: 'Nota 10, trabalho ágil, transparente e extremamente eficiente. Conduziu todo o processo com maestria e profissionalismo. Ótimo atendimento!',
    },
    {
      name: 'Italo Kaique',
      initials: 'IK',
      color: '#7c3aed',
      time: 'há 5 meses',
      text: 'Sem dúvidas o melhor profissional da cidade! Sempre com ótimas indicações de imóveis e atendimento personalizado. Superou todas as minhas expectativas.',
    },
  ];

  return (
    <section id="depoimentos" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">O que dizem os clientes</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Avaliações Reais no Google
          </h2>
          <div className="section-divider mx-auto mb-6" />

          {/* Aggregate score */}
          <div className="inline-flex items-center gap-4 bg-white border border-slate-100 shadow-sm px-6 py-4 rounded-2xl">
            <div className="text-center">
              <p className="text-5xl font-black text-slate-900 leading-none">5.0</p>
              <Stars />
              <p className="text-slate-500 text-xs font-medium mt-1">23 avaliações</p>
            </div>
            <div className="h-14 w-px bg-slate-100" />
            <div className="text-left">
              {[5,4,3,2,1].map(n => (
                <div key={n} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500 w-2">{n}</span>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: n === 5 ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`review-card bg-white rounded-2xl border border-slate-100 p-6 flex flex-col transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120 + 200}ms` }}
            >
              {/* Google logo + stars */}
              <div className="flex items-center justify-between mb-4">
                <Stars />
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>

              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">
                "{r.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-50">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: r.color }}
                >
                  {r.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                  <p className="text-slate-400 text-xs">{r.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href={WA_MSG_AGENDAR}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-reviews-cta"
            className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Quero ser o próximo caso de sucesso
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Location & Contact Section ────────────────────────────────────────────────
function LocationSection() {
  const { ref, inView } = useInView();

  return (
    <section id="localizacao" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">Venha nos visitar</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Localização e Contato
          </h2>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Map */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 h-80 lg:h-96">
              <iframe
                title="Localização Wilton Mendes — Edifício Atrium, São Francisco, Manaus"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.988406624!2d-60.02176!3d-3.10563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926c0b8db4ce2f51%3A0x3a4b8e2f1c7d9e3a!2sEdif%C3%ADcio+Atrium%2C+R.+Sobrinho+Maranh%C3%A3o%2C+310+-+S%C3%A3o+Francisco%2C+Manaus+-+AM%2C+69079-210!5e0!3m2!1spt-BR!2sbr!4v1696276800000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.google.com/?q=Edif%C3%ADcio+Atrium+R.+Sobrinho+Maranh%C3%A3o+310+S%C3%A3o+Francisco+Manaus+AM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Abrir no Google Maps
            </a>
          </div>

          {/* Info */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>

            {/* Address card */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100">
              <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span> Endereço
              </h3>
              <p className="text-slate-700 font-semibold">Edifício Atrium</p>
              <p className="text-slate-600 text-sm">R. Sobrinho Maranhão, 310 · Loja 13, Térreo</p>
              <p className="text-slate-600 text-sm">São Francisco · Manaus – AM</p>
              <p className="text-slate-500 text-sm">CEP 69079-210</p>
            </div>

            {/* Hours */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100">
              <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🕐</span> Horário de Atendimento
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 text-sm font-medium">Segunda a Sábado</span>
                  <span className="text-slate-900 text-sm font-bold">09:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 text-sm font-medium">Domingo</span>
                  <span className="text-slate-400 text-sm">Fechado</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold">Atendimento também via WhatsApp</span>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={WA_MSG_GERAL}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-contato-whatsapp"
                className="flex flex-col items-center gap-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 text-center"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                <span className="text-xs font-bold">WhatsApp</span>
              </a>
              <a
                href="tel:+5592984179972"
                id="btn-contato-telefone"
                className="flex flex-col items-center gap-2 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 text-center"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-xs font-bold">Ligar</span>
              </a>
              <a
                href="mailto:wiltonmendesc@gmail.com"
                id="btn-contato-email"
                className="flex flex-col items-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 text-center"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="text-xs font-bold">E-mail</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
  const { ref, inView } = useInView();
  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #1d3461 100%)' }}>
      <div
        ref={ref}
        className={`max-w-4xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <span className="inline-block text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">Pronto para dar o próximo passo?</span>
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Fale com Wilton agora<br />
          <span className="gradient-text">e realize seu sonho imobiliário</span>
        </h2>
        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
          Consultoria gratuita, sem compromisso. Respondo em minutos no WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={WA_MSG_AGENDAR}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-cta-banner-wa"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-black text-lg rounded-2xl transition-all duration-200 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Iniciar Consultoria Gratuita
          </a>
          <a
            href="tel:+5592984179972"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-white/20 hover:border-white/50 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:bg-white/5"
          >
            (92) 98417-9972
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/wilton.jpg" alt="Wilton Mendes" className="w-10 h-10 rounded-full object-cover object-top border-2 border-amber-400/40" />
              <div>
                <p className="text-white font-black text-sm leading-none">Wilton Mendes</p>
                <p className="text-slate-500 text-xs">Negócios Imobiliários · CRECI 7473</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Corretor de imóveis registrado no CRECI-AM sob o nº 7473. Especialista no mercado imobiliário de Manaus e região.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Serviços</p>
            <ul className="space-y-2">
              {['Compra e Venda', 'Financiamento', 'Regularização', 'Administração de Imóveis'].map(s => (
                <li key={s}>
                  <a href={WA_MSG_GERAL} target="_blank" rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Contato</p>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Edifício Atrium · R. Sobrinho Maranhão, 310, Loja 13, São Francisco, Manaus/AM · CEP 69079-210</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <a href="tel:+5592984179972" className="hover:text-slate-300 transition-colors">(92) 98417-9972</a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:wiltonmendesc@gmail.com" className="hover:text-slate-300 transition-colors">wiltonmendesc@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>Seg–Sex: 08:00–18:00 · Sáb: 09:00–13:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Wilton Mendes Negócios Imobiliários. Todos os direitos reservados.
          </p>
          <p className="text-slate-600 text-xs text-center sm:text-right">
            Corretor de Imóveis · <strong className="text-slate-500">CRECI-AM 7473</strong> · Manaus/AM · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <ServicesSection />
        <AboutSection />
        <ReviewsSection />
        <LocationSection />
        <CTABanner />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
