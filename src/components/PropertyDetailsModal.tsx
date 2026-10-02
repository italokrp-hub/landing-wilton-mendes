import { useEffect, useRef, useState } from 'react';
import type { Property } from '../data/properties';
import { WILTON } from '../config/broker';

interface Props {
  property: Property;
  onClose: () => void;
}

const formatPrice = (price: number) =>
  price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PropertyDetailsModal({ property, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const backdropRef = useRef<HTMLDivElement>(null);
  const images = property.images?.length ? property.images : [property.image];

  // Lock body scroll & handle ESC
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  const prevImg = () => setImgIndex(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex(i => (i + 1) % images.length);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá Wilton! Vi o empreendimento *${property.title}* (${property.code}) no seu portal e gostaria de mais informações. Poderia me ajudar?`
    );
    window.open(`https://wa.me/${WILTON.whatsapp}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handleVisit = () => {
    const msg = encodeURIComponent(
      `Olá Wilton! Gostaria de agendar uma visita ao empreendimento *${property.title}* (${property.code}). Quando seria possível?`
    );
    window.open(`https://wa.me/${WILTON.whatsapp}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do imóvel: ${property.title}`}
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'modalFadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            id="btn-modal-voltar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 2px',
            }}
          >
            ← Voltar
          </button>

          <h2
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#0f172a',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.3,
              flex: 1,
              padding: '0 8px',
            }}
          >
            {property.title}
          </h2>

          <button
            onClick={onClose}
            id="btn-modal-fechar"
            aria-label="Fechar modal"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#64748b',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Gallery */}
          <div style={{ position: 'relative', width: '100%', height: '220px', background: '#f1f5f9', flexShrink: 0 }}>
            <img
              src={images[imgIndex]}
              alt={`Foto ${imgIndex + 1} do imóvel ${property.title}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  aria-label="Imagem anterior"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={nextImg}
                  aria-label="Próxima imagem"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  }}
                >
                  ›
                </button>
                {/* Dots */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      style={{
                        width: i === imgIndex ? '18px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Price chip overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(15,23,42,0.82)',
                color: '#fff',
                borderRadius: '10px',
                padding: '4px 10px',
                fontSize: '14px',
                fontWeight: 800,
              }}
            >
              {formatPrice(property.price)}
            </div>
          </div>

          {/* ── DESCRIÇÃO section ── */}
          <div style={{ padding: '20px 20px 0' }}>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              DESCRIÇÃO
            </h3>

            {/* Location block */}
            {property.fullAddress && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>📍</span>
                <div>
                  <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
                    {property.fullAddress}
                  </p>
                  {property.addressNote && (
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>
                      {property.addressNote}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Features list */}
            {property.features && property.features.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {property.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#334155' }}>
                    <span style={{ fontSize: '18px', lineHeight: 1, width: '22px', textAlign: 'center', flexShrink: 0 }}>
                      {feat.icon}
                    </span>
                    {feat.label}
                  </li>
                ))}
              </ul>
            )}

            {/* Leisure block */}
            {property.leisure && (
              <div style={{ marginBottom: '16px' }}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0 0 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ✨ Lazer e estrutura
                </p>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {property.leisure}
                </p>
              </div>
            )}

            {/* Delivery forecast */}
            {property.deliveryForecast && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '18px' }}>📅</span>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>
                  Entrega: {property.deliveryForecast}
                </span>
              </div>
            )}

            {/* Tipo / Finalidade / Status */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                paddingTop: '8px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <div>
                <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px', fontWeight: 600 }}>
                  TIPO
                </p>
                <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, margin: 0 }}>
                  {property.type}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px', fontWeight: 600 }}>
                  FINALIDADE
                </p>
                <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, margin: 0 }}>
                  {property.purpose}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px', fontWeight: 600 }}>
                  STATUS
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    margin: 0,
                    color:
                      property.status === 'Disponível' ? '#16a34a' :
                      property.status === 'Em lançamento' ? '#d97706' :
                      property.status === 'Em construção' ? '#2563eb' : '#64748b',
                  }}
                >
                  {property.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div
          style={{
            padding: '14px 20px',
            display: 'flex',
            gap: '10px',
            borderTop: '1px solid #e2e8f0',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          <button
            id={`btn-modal-visitar-${property.id}`}
            onClick={handleVisit}
            style={{
              flex: 1,
              padding: '13px 0',
              background: '#1d4ed8',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1e40af')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1d4ed8')}
          >
            Visitar
          </button>
          <button
            id={`btn-modal-whatsapp-${property.id}`}
            onClick={handleWhatsApp}
            style={{
              flex: 1,
              padding: '13px 0',
              background: '#16a34a',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
            onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
