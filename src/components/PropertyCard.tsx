import type { Property } from '../data/properties';
import { WILTON } from '../config/broker';

interface PropertyCardProps {
  property: Property;
  index?: number;
  onDetails: (property: Property) => void;
}

const formatPrice = (price: number) =>
  price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const typeColors: Record<string, string> = {
  Apartamento: 'bg-blue-600',
  Prédio: 'bg-slate-700',
  Casa: 'bg-emerald-600',
  Cobertura: 'bg-violet-600',
  'Sala Comercial': 'bg-amber-600',
  Terreno: 'bg-orange-600',
};

export default function PropertyCard({ property, index = 0, onDetails }: PropertyCardProps) {
  const tagColor = typeColors[property.type] ?? 'bg-blue-600';
  const delay = `${index * 0.08}s`;

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá Wilton! Tenho interesse no imóvel: *${property.title}* (${property.code}). Pode me dar mais informações?`
    );
    window.open(`https://wa.me/${WILTON.whatsapp}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      className="card-hover bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col animate-fade-in-up"
      style={{ animationDelay: delay }}
      aria-label={`Imóvel: ${property.title}`}
    >
      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={property.image}
          alt={`Foto do imóvel: ${property.title}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Type badge */}
        <span className={`absolute top-3 right-3 ${tagColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
          {property.type}
        </span>
        {/* Launch tag */}
        {property.launchTag && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {property.launchTag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Price */}
        <div className="mb-1">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Valor</p>
          <p className="text-[22px] font-black text-blue-800 leading-tight">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Title */}
        <h2 className="text-sm font-extrabold text-slate-900 uppercase leading-snug mt-1 mb-1.5 line-clamp-2">
          {property.title}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span>{property.neighborhood}, {property.city}</span>
        </div>

        {/* Attributes grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-3">
          {/* Bedrooms */}
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span className="text-base font-bold text-slate-800">{property.bedrooms}</span>
            <span className="text-[10px] text-slate-400 font-medium">Dorms</span>
          </div>
          {/* Bathrooms */}
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-base font-bold text-slate-800">{property.bathrooms}</span>
            <span className="text-[10px] text-slate-400 font-medium">Banh.</span>
          </div>
          {/* Area */}
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            <span className="text-base font-bold text-slate-800">{property.area.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 font-medium">m²</span>
          </div>
        </div>

        {/* Broker — always Wilton */}
        <div className="flex items-center gap-2 mb-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <img
            src={WILTON.photo}
            alt="Wilton Mendes"
            className="w-8 h-8 rounded-full object-cover object-top border-2 border-blue-200 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-medium leading-none">Corretor responsável</p>
            <p className="text-sm font-bold text-slate-800 leading-tight">{WILTON.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{WILTON.creci}</p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            id={`btn-ver-detalhes-${property.id}`}
            onClick={() => onDetails(property)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 active:scale-95 transition-all duration-200 text-center"
          >
            Ver detalhes →
          </button>
          <button
            id={`btn-whatsapp-${property.id}`}
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-green-50 hover:border-green-300 hover:text-green-700 active:scale-95 transition-all duration-200"
          >
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar com Wilton
          </button>
        </div>
      </div>
    </article>
  );
}
