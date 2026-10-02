import { WILTON } from '../config/broker';
import { cities, types, purposes, priceRanges } from '../data/properties';
import type { Filters } from '../App';

interface HeroFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function HeroFilters({ filters, onFilterChange }: HeroFiltersProps) {
  const update = (key: keyof Filters, value: string) =>
    onFilterChange({ ...filters, [key]: value });

  const waLink = `https://wa.me/${WILTON.whatsapp}?text=${encodeURIComponent('Olá Wilton! Gostaria de uma consultoria imobiliária personalizada.')}`;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
      aria-label="Apresentação e busca de imóveis"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-800/15 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT COLUMN — Copy + Filters */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6 animate-fade-in-up">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              {WILTON.creci} &nbsp;·&nbsp; {WILTON.experience}
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Encontre o imóvel ideal{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                com quem entende do mercado
              </span>
            </h1>

            {/* Sub */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Atendimento exclusivo e personalizado. Há mais de 10 anos ajudando famílias
              e investidores a realizarem o sonho do imóvel perfeito no Amazonas e no Brasil.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              {[
                { icon: '🏆', label: '10+ anos', sub: 'de experiência' },
                { icon: '🏠', label: '500+', sub: 'imóveis negociados' },
                { icon: '⭐', label: '98%', sub: 'satisfação' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="text-white text-sm font-bold leading-none">{b.label}</p>
                    <p className="text-slate-400 text-[11px] leading-none mt-0.5">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter bar */}
            <div
              id="busca-imoveis"
              className="bg-white rounded-2xl shadow-2xl shadow-black/30 p-3 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {/* Search row */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  id="input-busca"
                  type="text"
                  value={filters.search}
                  onChange={e => update('search', e.target.value)}
                  placeholder="Buscar código, nome ou bairro..."
                  className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
              </div>

              {/* Dropdowns row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* City */}
                <div className="relative">
                  <select
                    id="select-cidade"
                    value={filters.city}
                    onChange={e => update('city', e.target.value)}
                    className="w-full appearance-none cursor-pointer pl-3 pr-7 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium outline-none hover:border-blue-300 focus:border-blue-500 transition-colors"
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {/* Type */}
                <div className="relative">
                  <select
                    id="select-tipo"
                    value={filters.type}
                    onChange={e => update('type', e.target.value)}
                    className="w-full appearance-none cursor-pointer pl-3 pr-7 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium outline-none hover:border-blue-300 focus:border-blue-500 transition-colors"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <svg className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {/* Purpose */}
                <div className="relative">
                  <select
                    id="select-finalidade"
                    value={filters.purpose}
                    onChange={e => update('purpose', e.target.value)}
                    className="w-full appearance-none cursor-pointer pl-3 pr-7 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium outline-none hover:border-blue-300 focus:border-blue-500 transition-colors"
                  >
                    {purposes.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <svg className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {/* Price */}
                <div className="relative">
                  <select
                    id="select-preco"
                    value={filters.priceRange}
                    onChange={e => update('priceRange', e.target.value)}
                    className="w-full appearance-none cursor-pointer pl-3 pr-7 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium outline-none hover:border-blue-300 focus:border-blue-500 transition-colors"
                  >
                    {priceRanges.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
                  </select>
                  <svg className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-5 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-400 active:scale-95 transition-all duration-200 shadow-lg shadow-green-900/30"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Conversar com Wilton
              </a>
              <span className="text-slate-400 text-xs">ou role para ver os imóveis ↓</span>
            </div>
          </div>

          {/* RIGHT COLUMN — Photo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-2xl scale-105" aria-hidden="true" />

              {/* Photo card */}
              <div className="relative w-72 sm:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <img
                  src={WILTON.photo}
                  alt="Wilton Mendes — Corretor de Imóveis"
                  className="w-full h-auto object-cover object-top"
                  style={{ minHeight: '420px', objectPosition: 'center top' }}
                />
                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 to-transparent pt-12 pb-5 px-5">
                  <p className="text-white font-black text-lg leading-none">{WILTON.name}</p>
                  <p className="text-blue-300 text-xs font-semibold mt-1">Corretor de Imóveis · {WILTON.creci}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs font-medium">Disponível para atendimento</span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-blue-400">
                ✓ Verificado
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
