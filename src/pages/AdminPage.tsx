import {
  useState,
  useRef,
  useCallback,
  type FormEvent,
  type DragEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertiesContext';
import { WILTON, ADMIN_PASSWORD } from '../config/broker';
import type {
  Property,
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
  PropertyFeature,
} from '../data/properties';

// ─── Constants ────────────────────────────────────────────────────────────────
const PROPERTY_TYPES: PropertyType[] = [
  'Apartamento', 'Prédio', 'Casa', 'Cobertura', 'Sala Comercial', 'Terreno',
];
const PURPOSES: PropertyPurpose[] = ['Venda', 'Aluguel', 'Venda e Aluguel'];
const STATUSES: PropertyStatus[] = [
  'Disponível', 'Em lançamento', 'Em construção', 'Entregue',
];
const FEATURE_ICONS = [
  '🛏️','🛋️','📐','🚗','🌿','🏢','🏘️','🌳','🏗️','🌊','🏊','✨','📅','🔑','💡',
];

// ─── Form state ───────────────────────────────────────────────────────────────
const emptyForm = () => ({
  title: '',
  type: 'Apartamento' as PropertyType,
  purpose: 'Venda' as PropertyPurpose,
  status: 'Disponível' as PropertyStatus,
  city: '',
  neighborhood: '',
  state: '',
  price: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  code: '',
  launchTag: '',
  // Rich fields
  fullAddress: '',
  addressNote: '',
  leisure: '',
  deliveryForecast: '',
});

type FormState = ReturnType<typeof emptyForm>;

const formatPrice = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ─── Mini UI helpers ──────────────────────────────────────────────────────────
const inputCls =
  'w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-blue-500 hover:border-slate-600 transition-colors placeholder:text-slate-600';
const textareaCls =
  'w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-blue-500 hover:border-slate-600 transition-colors placeholder:text-slate-600 resize-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// ─── Live Card Mini-Preview ───────────────────────────────────────────────────
function MiniCardPreview({ form, images }: { form: FormState; images: string[] }) {
  const price = parseFloat(form.price) || 0;
  const beds  = parseInt(form.bedrooms)  || 0;
  const baths = parseInt(form.bathrooms) || 0;
  const area  = parseFloat(form.area)    || 0;
  const img   = images[0] || '/images/imovel_atlantico_1790896979412.png';

  return (
    <div style={{ fontSize: '11px', fontFamily: 'inherit' }}>
      <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 600 }}>
        Pré-visualização · Card
      </p>
      <div style={{
        background: '#fff', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)', border: '1px solid #e2e8f0',
        maxWidth: '240px', margin: '0 auto',
      }}>
        <div style={{ position: 'relative', height: '120px', background: '#f1f5f9' }}>
          <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {form.type && (
            <span style={{
              position: 'absolute', top: '6px', right: '6px',
              background: '#2563eb', color: '#fff', fontSize: '9px',
              fontWeight: 700, padding: '2px 7px', borderRadius: '20px',
            }}>{form.type}</span>
          )}
          {form.launchTag && (
            <span style={{
              position: 'absolute', top: '6px', left: '6px',
              background: '#f59e0b', color: '#fff', fontSize: '9px',
              fontWeight: 700, padding: '2px 7px', borderRadius: '20px',
            }}>{form.launchTag}</span>
          )}
        </div>
        <div style={{ padding: '8px 10px' }}>
          <p style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 600, margin: '0 0 1px', textTransform: 'uppercase' }}>Valor</p>
          <p style={{ fontSize: '14px', fontWeight: 900, color: '#1e40af', margin: '0 0 4px' }}>
            {price ? formatPrice(price) : 'R$ —'}
          </p>
          <p style={{ fontSize: '9px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', textTransform: 'uppercase', lineHeight: 1.3 }}>
            {form.title || '(sem título)'}
          </p>
          <p style={{ fontSize: '9px', color: '#64748b', margin: '0 0 6px' }}>
            {form.neighborhood || '—'}, {form.city || '—'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
            <span style={{ color: '#475569', fontSize: '9px' }}>🛏 {beds}</span>
            <span style={{ color: '#475569', fontSize: '9px' }}>🚿 {baths}</span>
            <span style={{ color: '#475569', fontSize: '9px' }}>📐 {area}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Live Modal Mini-Preview ──────────────────────────────────────────────────
function MiniModalPreview({
  form, images, features,
}: { form: FormState; images: string[]; features: PropertyFeature[] }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = images.length ? images : ['/images/imovel_atlantico_1790896979412.png'];
  const price = parseFloat(form.price) || 0;

  return (
    <div style={{ fontSize: '11px', fontFamily: 'inherit', marginTop: '16px' }}>
      <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 600 }}>
        Pré-visualização · Modal de Detalhes
      </p>
      <div style={{
        background: '#fff', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)', border: '1px solid #e2e8f0',
        maxWidth: '280px', margin: '0 auto',
      }}>
        {/* mini header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 10px', borderBottom: '1px solid #f1f5f9',
        }}>
          <span style={{ fontSize: '9px', color: '#3b82f6', fontWeight: 700 }}>← Voltar</span>
          <span style={{ fontSize: '8px', fontWeight: 800, color: '#0f172a', textAlign: 'center', textTransform: 'uppercase', flex: 1, padding: '0 4px' }}>
            {form.title || '(sem título)'}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>✕</span>
        </div>
        {/* mini gallery */}
        <div style={{ position: 'relative', height: '100px', background: '#f1f5f9' }}>
          <img src={imgs[imgIdx]} alt="mini" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {imgs.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                style={{ position: 'absolute', left: '4px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' }}>‹</button>
              <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' }}>›</button>
            </>
          )}
          <div style={{ position: 'absolute', bottom: '4px', right: '6px', background: 'rgba(15,23,42,0.75)', color: '#fff', fontSize: '8px', fontWeight: 800, borderRadius: '6px', padding: '2px 6px' }}>
            {price ? formatPrice(price) : 'R$ —'}
          </div>
        </div>
        {/* mini body */}
        <div style={{ padding: '8px 10px', maxHeight: '200px', overflowY: 'auto' }}>
          <p style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 6px' }}>DESCRIÇÃO</p>
          {form.fullAddress && (
            <p style={{ fontSize: '9px', color: '#2563eb', margin: '0 0 4px' }}>📍 {form.fullAddress}</p>
          )}
          {features.slice(0, 5).map((f, i) => (
            <p key={i} style={{ fontSize: '9px', color: '#334155', margin: '0 0 2px' }}>{f.icon} {f.label}</p>
          ))}
          {features.length > 5 && <p style={{ fontSize: '8px', color: '#94a3b8' }}>+{features.length - 5} mais...</p>}
          {form.leisure && (
            <div style={{ marginTop: '6px' }}>
              <p style={{ fontSize: '9px', fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>✨ Lazer e estrutura</p>
              <p style={{ fontSize: '9px', color: '#475569' }}>{form.leisure}</p>
            </div>
          )}
          {form.deliveryForecast && (
            <p style={{ fontSize: '9px', color: '#334155', marginTop: '4px' }}>📅 Entrega: {form.deliveryForecast}</p>
          )}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
            <div><p style={{ fontSize: '7px', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>TIPO</p><p style={{ fontSize: '9px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{form.type}</p></div>
            <div><p style={{ fontSize: '7px', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>FINALIDADE</p><p style={{ fontSize: '9px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{form.purpose}</p></div>
            <div><p style={{ fontSize: '7px', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>STATUS</p><p style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', margin: 0 }}>{form.status}</p></div>
          </div>
        </div>
        {/* mini footer */}
        <div style={{ display: 'flex', gap: '6px', padding: '6px 10px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ flex: 1, background: '#1d4ed8', color: '#fff', borderRadius: '8px', padding: '6px 0', textAlign: 'center', fontSize: '9px', fontWeight: 700 }}>Visitar</div>
          <div style={{ flex: 1, background: '#16a34a', color: '#fff', borderRadius: '8px', padding: '6px 0', textAlign: 'center', fontSize: '9px', fontWeight: 700 }}>WhatsApp</div>
        </div>
      </div>
    </div>
  );
}

// ─── Features Manager ─────────────────────────────────────────────────────────
function FeaturesManager({
  features, onChange,
}: { features: PropertyFeature[]; onChange: (f: PropertyFeature[]) => void }) {
  const [newIcon, setNewIcon] = useState('🛏️');
  const [newLabel, setNewLabel] = useState('');

  const add = () => {
    if (!newLabel.trim()) return;
    onChange([...features, { icon: newIcon, label: newLabel.trim() }]);
    setNewLabel('');
  };
  const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const arr = [...features];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium mb-2">
        Características do imóvel
      </label>
      {/* existing tags */}
      <div className="space-y-1.5 mb-3">
        {features.length === 0 && (
          <p className="text-xs text-slate-600 italic">Nenhuma característica adicionada.</p>
        )}
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 bg-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-base">{f.icon}</span>
            <span className="text-xs text-slate-200 flex-1 truncate">{f.label}</span>
            <button onClick={() => move(i, -1)} disabled={i === 0}
              className="text-slate-500 hover:text-slate-300 disabled:opacity-30 text-xs px-1" title="Mover para cima">↑</button>
            <button onClick={() => move(i, 1)} disabled={i === features.length - 1}
              className="text-slate-500 hover:text-slate-300 disabled:opacity-30 text-xs px-1" title="Mover para baixo">↓</button>
            <button onClick={() => remove(i)}
              className="text-red-500 hover:text-red-400 text-xs px-1 ml-1" title="Remover">✕</button>
          </div>
        ))}
      </div>
      {/* add new */}
      <div className="flex gap-2">
        <select
          value={newIcon}
          onChange={e => setNewIcon(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-xl px-2 py-2 text-base outline-none focus:border-blue-500 w-16 shrink-0"
        >
          {FEATURE_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
        </select>
        <input
          type="text"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Ex: 3 quartos"
          className={inputCls + ' flex-1'}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 px-3 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

// ─── Image Gallery Manager ────────────────────────────────────────────────────
function ImageGalleryManager({
  images, onChange,
}: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const readFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const url = ev.target?.result as string;
        onChange([...images, url]);
      };
      reader.readAsDataURL(file);
    });
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const setMain = (i: number) => {
    const arr = [...images];
    const [item] = arr.splice(i, 1);
    arr.unshift(item);
    onChange(arr);
  };

  const onDragStart = useCallback((e: DragEvent, i: number) => {
    e.dataTransfer.setData('idx', String(i));
  }, []);

  const onDrop = useCallback((e: DragEvent, targetIdx: number) => {
    e.preventDefault();
    const srcIdx = parseInt(e.dataTransfer.getData('idx'));
    if (srcIdx === targetIdx) return;
    const arr = [...images];
    const [item] = arr.splice(srcIdx, 1);
    arr.splice(targetIdx, 0, item);
    onChange(arr);
    setDragOver(null);
  }, [images, onChange]);

  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium mb-2">
        Galeria de fotos{' '}
        <span className="text-slate-600">(arraste para reordenar · primeira = capa)</span>
      </label>

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="w-full h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-600 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-blue-400 mb-3"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="text-xs font-medium">Clique para adicionar fotos</span>
        <span className="text-[10px] text-slate-600">PNG, JPG — múltiplos arquivos</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => readFiles(e.target.files)}
        className="hidden"
        id="input-gallery-upload"
      />

      {/* Thumbnails grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div
              key={i}
              draggable
              onDragStart={e => onDragStart(e, i)}
              onDragOver={e => { e.preventDefault(); setDragOver(i); }}
              onDrop={e => onDrop(e, i)}
              onDragLeave={() => setDragOver(null)}
              style={{
                border: dragOver === i ? '2px solid #3b82f6' : '2px solid transparent',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'grab',
              }}
            >
              <img src={src} alt={`Foto ${i + 1}`}
                style={{ width: '100%', height: '72px', objectFit: 'cover', display: 'block' }} />
              {/* overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '4px',
                opacity: 0, transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                {i !== 0 && (
                  <button type="button" onClick={() => setMain(i)}
                    style={{ fontSize: '9px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontWeight: 700 }}>
                    ★ Capa
                  </button>
                )}
                {i === 0 && (
                  <span style={{ fontSize: '9px', background: '#16a34a', color: '#fff', borderRadius: '4px', padding: '2px 6px', fontWeight: 700 }}>
                    ★ Capa
                  </span>
                )}
                <button type="button" onClick={() => remove(i)}
                  style={{ fontSize: '9px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontWeight: 700 }}>
                  Remover
                </button>
              </div>
              {/* index badge */}
              <span style={{
                position: 'absolute', bottom: '3px', left: '3px',
                background: 'rgba(0,0,0,0.6)', color: '#fff',
                fontSize: '8px', borderRadius: '4px', padding: '1px 4px',
              }}>{i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();
  const { properties, addProperty, deleteProperty, updateProperty } = useProperties();

  // Auth
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('wm_admin') === '1');
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  // Form state
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<PropertyFeature[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Preview tab
  const [previewTab, setPreviewTab] = useState<'card' | 'modal'>('card');

  // ── Auth wall ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="flex justify-center mb-6">
            <img src={WILTON.photo} alt="Wilton" className="w-16 h-16 rounded-full object-cover object-top border-2 border-blue-500/40" />
          </div>
          <h1 className="text-xl font-black text-white text-center mb-1">Área Administrativa</h1>
          <p className="text-slate-400 text-sm text-center mb-6">{WILTON.name} · Gestão de Imóveis</p>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (ADMIN_PASSWORD && pwInput === ADMIN_PASSWORD) {
                sessionStorage.setItem('wm_admin', '1');
                setAuthed(true);
              } else {
                setPwError(true);
                setTimeout(() => setPwError(false), 2000);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">Senha de acesso</label>
              <input
                id="input-senha-admin"
                type="password"
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                placeholder="••••••••••"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-700 border text-white text-sm outline-none transition-colors ${pwError ? 'border-red-500 bg-red-900/20' : 'border-slate-600 focus:border-blue-500'}`}
              />
              {pwError && <p className="text-red-400 text-xs mt-1">Senha incorreta. Tente novamente.</p>}
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-600 active:scale-95 transition-all">
              Entrar
            </button>
            <button type="button" onClick={() => navigate('/')}
              className="w-full py-2.5 bg-transparent border border-slate-600 text-slate-400 text-sm font-medium rounded-xl hover:text-white hover:border-slate-400 transition-all">
              ← Voltar ao portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const setField = (key: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm());
    setImages([]);
    setFeatures([]);
    setEditId(null);
  };

  const startEdit = (p: Property) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      type: p.type,
      purpose: p.purpose,
      status: p.status,
      city: p.city,
      neighborhood: p.neighborhood,
      state: p.state,
      price: String(p.price),
      bedrooms: String(p.bedrooms),
      bathrooms: String(p.bathrooms),
      area: String(p.area),
      code: p.code,
      launchTag: p.launchTag ?? '',
      fullAddress: p.fullAddress ?? '',
      addressNote: p.addressNote ?? '',
      leisure: p.leisure ?? '',
      deliveryForecast: p.deliveryForecast ?? '',
    });
    setImages(p.images?.length ? p.images : p.image ? [p.image] : []);
    setFeatures(p.features ? [...p.features] : []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fallbackImg = '/images/imovel_atlantico_1790896979412.png';
    const finalImages = images.length ? images : [fallbackImg];
    const property: Property = {
      id: editId ?? `custom-${Date.now()}`,
      code: form.code || `WM-${Date.now().toString().slice(-4)}`,
      title: form.title,
      type: form.type,
      purpose: form.purpose,
      status: form.status,
      city: form.city,
      neighborhood: form.neighborhood,
      state: form.state,
      price: parseFloat(form.price) || 0,
      bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0,
      area: parseFloat(form.area) || 0,
      image: finalImages[0],
      images: finalImages,
      launchTag: form.launchTag || undefined,
      fullAddress: form.fullAddress || undefined,
      addressNote: form.addressNote || undefined,
      features: features.length ? features : undefined,
      leisure: form.leisure || undefined,
      deliveryForecast: form.deliveryForecast || undefined,
      broker: { name: WILTON.name, phone: WILTON.phone, whatsapp: WILTON.whatsapp },
    };
    setTimeout(() => {
      if (editId) {
        updateProperty(property);
        setSuccessMsg('Imóvel atualizado com sucesso!');
      } else {
        addProperty(property);
        setSuccessMsg('Imóvel cadastrado com sucesso!');
      }
      setSaving(false);
      resetForm();
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 400);
  };

  // ── UI ────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-white">Painel Admin</span>
              <p className="text-[10px] text-slate-500 leading-none">{WILTON.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors">
              ← Ver portal
            </a>
            <button
              onClick={() => { sessionStorage.removeItem('wm_admin'); setAuthed(false); }}
              className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 border border-red-900/40 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Success banner */}
        {successMsg && (
          <div className="mb-6 px-4 py-3 bg-green-900/40 border border-green-700/40 rounded-xl text-green-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* ── FORM ──────────────────────────────────────────────────────── */}
          <div className="xl:col-span-5">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <h2 className="text-sm font-bold text-white">
                  {editId ? 'Editar imóvel' : 'Cadastrar novo imóvel'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* ── Galeria ── */}
                <ImageGalleryManager images={images} onChange={setImages} />

                <div className="border-t border-slate-800 pt-4" />

                {/* ── Título ── */}
                <Field label="Título do empreendimento *">
                  <input required id="input-titulo" type="text" value={form.title}
                    onChange={e => setField('title', e.target.value)}
                    placeholder="Ex: RESIDENCIAL BEIRA RIO" className={inputCls} />
                </Field>

                {/* ── Tipo + Finalidade ── */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tipo *">
                    <select required id="select-tipo-admin" value={form.type}
                      onChange={e => setField('type', e.target.value)} className={inputCls}>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Finalidade *">
                    <select required id="select-finalidade-admin" value={form.purpose}
                      onChange={e => setField('purpose', e.target.value)} className={inputCls}>
                      {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>

                {/* ── Status ── */}
                <Field label="Status *">
                  <select required id="select-status-admin" value={form.status}
                    onChange={e => setField('status', e.target.value)} className={inputCls}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>

                {/* ── Cidade + Estado + Bairro ── */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Field label="Cidade *">
                      <input required id="input-cidade" type="text" value={form.city}
                        onChange={e => setField('city', e.target.value)}
                        placeholder="Ex: Fortaleza" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Estado *">
                    <input required id="input-estado" type="text" maxLength={2} value={form.state}
                      onChange={e => setField('state', e.target.value.toUpperCase())}
                      placeholder="CE" className={inputCls} />
                  </Field>
                </div>
                <Field label="Bairro *">
                  <input required id="input-bairro" type="text" value={form.neighborhood}
                    onChange={e => setField('neighborhood', e.target.value)}
                    placeholder="Ex: Praia do Futuro" className={inputCls} />
                </Field>

                {/* ── Endereço completo ── */}
                <Field label="Endereço completo">
                  <input id="input-endereco" type="text" value={form.fullAddress}
                    onChange={e => setField('fullAddress', e.target.value)}
                    placeholder="Ex: Av. Dr. Aldy Mentor, 2210 — Praia do Futuro, Fortaleza/CE"
                    className={inputCls} />
                </Field>
                <Field label="Observação de endereço">
                  <input id="input-obs-endereco" type="text" value={form.addressNote}
                    onChange={e => setField('addressNote', e.target.value)}
                    placeholder="Ex: (antiga Av. Padre Antônio Tomás)"
                    className={inputCls} />
                </Field>

                {/* ── Preço ── */}
                <Field label="Preço (R$) *">
                  <input required id="input-preco" type="number" min={0} value={form.price}
                    onChange={e => setField('price', e.target.value)}
                    placeholder="Ex: 420000" className={inputCls} />
                </Field>

                {/* ── Dorms + Banhs + Área ── */}
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Dorms">
                    <input id="input-dorms" type="number" min={0} value={form.bedrooms}
                      onChange={e => setField('bedrooms', e.target.value)}
                      placeholder="2" className={inputCls} />
                  </Field>
                  <Field label="Banheiros">
                    <input id="input-banhs" type="number" min={0} value={form.bathrooms}
                      onChange={e => setField('bathrooms', e.target.value)}
                      placeholder="1" className={inputCls} />
                  </Field>
                  <Field label="Área (m²)">
                    <input id="input-area" type="number" min={0} step={0.01} value={form.area}
                      onChange={e => setField('area', e.target.value)}
                      placeholder="65" className={inputCls} />
                  </Field>
                </div>

                {/* ── Código + Tag ── */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Código (opcional)">
                    <input id="input-codigo" type="text" value={form.code}
                      onChange={e => setField('code', e.target.value)}
                      placeholder="WM-001" className={inputCls} />
                  </Field>
                  <Field label="Tag destaque">
                    <input id="input-tag" type="text" value={form.launchTag}
                      onChange={e => setField('launchTag', e.target.value)}
                      placeholder="Lançamento" className={inputCls} />
                  </Field>
                </div>

                <div className="border-t border-slate-800 pt-2" />

                {/* ── Features Manager ── */}
                <FeaturesManager features={features} onChange={setFeatures} />

                {/* ── Lazer e estrutura ── */}
                <Field label="Lazer e estrutura">
                  <textarea
                    id="input-lazer"
                    value={form.leisure}
                    onChange={e => setField('leisure', e.target.value)}
                    rows={3}
                    placeholder="Ex: Piscina | Academia | Salão de festas | Coworking | Pet Place"
                    className={textareaCls}
                  />
                  <p className="text-[10px] text-slate-600 mt-1">Separe os itens com &nbsp;|&nbsp; ou vírgulas.</p>
                </Field>

                {/* ── Previsão de entrega ── */}
                <Field label="Previsão de entrega">
                  <input id="input-entrega" type="text" value={form.deliveryForecast}
                    onChange={e => setField('deliveryForecast', e.target.value)}
                    placeholder="Ex: abril de 2028" className={inputCls} />
                </Field>

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    id="btn-salvar-imovel"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-60"
                  >
                    {saving ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    )}
                    {saving ? 'Salvando...' : editId ? 'Atualizar imóvel' : 'Cadastrar imóvel'}
                  </button>
                  {editId && (
                    <button type="button" onClick={resetForm}
                      className="px-4 py-3 bg-slate-800 text-slate-400 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Preview + List ──────────────────────────────── */}
          <div className="xl:col-span-7 flex flex-col gap-8">

            {/* ── Live Preview Panel ── */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h2 className="text-sm font-bold text-white">Pré-visualização em tempo real</h2>
                </div>
                {/* tab switcher */}
                <div className="flex bg-slate-800 rounded-lg p-0.5 gap-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('card')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${previewTab === 'card' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                  >Card</button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('modal')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${previewTab === 'modal' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                  >Modal</button>
                </div>
              </div>
              <div className="p-6 bg-slate-950/50 min-h-[280px] flex items-start justify-center">
                {previewTab === 'card' ? (
                  <MiniCardPreview form={form} images={images} />
                ) : (
                  <MiniModalPreview form={form} images={images} features={features} />
                )}
              </div>
            </div>

            {/* ── Property List ── */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <h2 className="text-sm font-bold text-white">Imóveis cadastrados</h2>
                </div>
                <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full font-medium">
                  {properties.length} imóveis
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {properties.map(p => (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/50 transition-colors">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-14 rounded-xl object-cover shrink-0 border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{p.title}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {p.neighborhood}, {p.city} · {p.type}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs font-semibold text-blue-400">
                          {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          p.status === 'Disponível' ? 'bg-green-900/40 text-green-400' :
                          p.status === 'Em lançamento' ? 'bg-amber-900/40 text-amber-400' :
                          p.status === 'Em construção' ? 'bg-blue-900/40 text-blue-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>{p.status}</span>
                      </div>
                      {/* feature count info */}
                      {(p.features?.length || p.images?.length) ? (
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          {p.images?.length ? `${p.images.length} foto(s)` : ''}
                          {p.images?.length && p.features?.length ? ' · ' : ''}
                          {p.features?.length ? `${p.features.length} característica(s)` : ''}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`btn-editar-${p.id}`}
                        onClick={() => startEdit(p)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-red-400 font-medium">Confirmar?</span>
                          <button
                            onClick={() => { deleteProperty(p.id); setDeleteConfirm(null); }}
                            className="px-2 py-1 text-xs bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >Sim</button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                          >Não</button>
                        </div>
                      ) : (
                        <button
                          id={`btn-excluir-${p.id}`}
                          onClick={() => setDeleteConfirm(p.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {properties.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                    <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <p className="text-sm font-medium">Nenhum imóvel cadastrado</p>
                    <p className="text-xs mt-1">Use o formulário ao lado para adicionar</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
