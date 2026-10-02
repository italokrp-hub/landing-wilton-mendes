import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertiesContext';
import { WILTON, ADMIN_PASSWORD } from '../config/broker';
import type { Property, PropertyType, PropertyPurpose, PropertyStatus } from '../data/properties';

const PROPERTY_TYPES: PropertyType[] = ['Apartamento', 'Prédio', 'Casa', 'Cobertura', 'Sala Comercial', 'Terreno'];
const PURPOSES: PropertyPurpose[] = ['Venda', 'Aluguel', 'Venda e Aluguel'];
const STATUSES: PropertyStatus[] = ['Disponível', 'Em lançamento', 'Em construção', 'Entregue'];

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
  image: '',
});

type FormState = ReturnType<typeof emptyForm>;

export default function AdminPage() {
  const navigate = useNavigate();
  const { properties, addProperty, deleteProperty, updateProperty } = useProperties();

  // Auth
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('wm_admin') === '1');
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  // Form
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
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
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-700 border text-white text-sm outline-none transition-colors ${
                  pwError ? 'border-red-500 bg-red-900/20' : 'border-slate-600 focus:border-blue-500'
                }`}
              />
              {pwError && <p className="text-red-400 text-xs mt-1">Senha incorreta. Tente novamente.</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-transparent border border-slate-600 text-slate-400 text-sm font-medium rounded-xl hover:text-white hover:border-slate-400 transition-all"
            >
              ← Voltar ao portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setField = (key: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setPreview(url);
      setField('image', url);
    };
    reader.readAsDataURL(file);
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
      image: p.image,
    });
    setPreview(p.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(emptyForm());
    setPreview('');
    setEditId(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const image = form.image || '/images/imovel_atlantico_1790896979412.png';
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
      image,
      images: [image],
      launchTag: form.launchTag || undefined,
      broker: {
        name: WILTON.name,
        phone: WILTON.phone,
        whatsapp: WILTON.whatsapp,
      },
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

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
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
            <a
              href="/"
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors"
            >
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

          {/* ── FORM (left) ───────────────────────────────────────────── */}
          <div className="xl:col-span-2">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <h2 className="text-sm font-bold text-white">
                  {editId ? 'Editar imóvel' : 'Cadastrar novo imóvel'}
                </h2>
              </div>

              {successMsg && (
                <div className="mx-6 mt-4 px-4 py-3 bg-green-900/40 border border-green-700/40 rounded-xl text-green-400 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5">Foto do imóvel</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-40 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-600 transition-colors cursor-pointer overflow-hidden relative group"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500 group-hover:text-blue-400 transition-colors">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-xs font-medium">Clique para selecionar foto</span>
                        <span className="text-[11px] text-slate-600">PNG, JPG até 10MB</span>
                      </div>
                    )}
                    {preview && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full">Trocar foto</span>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" id="input-foto-imovel" />
                </div>

                {/* Title */}
                <Field label="Título do empreendimento *">
                  <input
                    required
                    id="input-titulo"
                    type="text"
                    value={form.title}
                    onChange={e => setField('title', e.target.value)}
                    placeholder="Ex: RESIDENCIAL BEIRA RIO"
                    className={inputCls}
                  />
                </Field>

                {/* Type + Purpose */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tipo de imóvel *">
                    <select
                      required
                      id="select-tipo-admin"
                      value={form.type}
                      onChange={e => setField('type', e.target.value)}
                      className={inputCls}
                    >
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Finalidade *">
                    <select
                      required
                      id="select-finalidade-admin"
                      value={form.purpose}
                      onChange={e => setField('purpose', e.target.value)}
                      className={inputCls}
                    >
                      {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Status */}
                <Field label="Status *">
                  <select
                    required
                    id="select-status-admin"
                    value={form.status}
                    onChange={e => setField('status', e.target.value)}
                    className={inputCls}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>

                {/* City + State */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Field label="Cidade *">
                      <input
                        required
                        id="input-cidade"
                        type="text"
                        value={form.city}
                        onChange={e => setField('city', e.target.value)}
                        placeholder="Ex: Manaus"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                  <Field label="Estado *">
                    <input
                      required
                      id="input-estado"
                      type="text"
                      maxLength={2}
                      value={form.state}
                      onChange={e => setField('state', e.target.value.toUpperCase())}
                      placeholder="AM"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Neighborhood */}
                <Field label="Bairro *">
                  <input
                    required
                    id="input-bairro"
                    type="text"
                    value={form.neighborhood}
                    onChange={e => setField('neighborhood', e.target.value)}
                    placeholder="Ex: Ponta Negra"
                    className={inputCls}
                  />
                </Field>

                {/* Price */}
                <Field label="Preço (R$) *">
                  <input
                    required
                    id="input-preco"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={e => setField('price', e.target.value)}
                    placeholder="Ex: 450000"
                    className={inputCls}
                  />
                </Field>

                {/* Bedrooms + Bathrooms + Area */}
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Dorms">
                    <input
                      id="input-dorms"
                      type="number"
                      min={0}
                      value={form.bedrooms}
                      onChange={e => setField('bedrooms', e.target.value)}
                      placeholder="2"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Banheiros">
                    <input
                      id="input-banhs"
                      type="number"
                      min={0}
                      value={form.bathrooms}
                      onChange={e => setField('bathrooms', e.target.value)}
                      placeholder="1"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Área (m²)">
                    <input
                      id="input-area"
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.area}
                      onChange={e => setField('area', e.target.value)}
                      placeholder="65"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Code + Launch tag */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Código (opcional)">
                    <input
                      id="input-codigo"
                      type="text"
                      value={form.code}
                      onChange={e => setField('code', e.target.value)}
                      placeholder="WM-001"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Tag destaque">
                    <input
                      id="input-tag"
                      type="text"
                      value={form.launchTag}
                      onChange={e => setField('launchTag', e.target.value)}
                      placeholder="Lançamento"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Actions */}
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
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 bg-slate-800 text-slate-400 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* ── PROPERTY LIST (right) ──────────────────────────────────── */}
          <div className="xl:col-span-3">
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
                      <p className="text-xs text-slate-400 truncate">{p.neighborhood}, {p.city} · {p.type}</p>
                      <p className="text-xs font-semibold text-blue-400 mt-0.5">
                        {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
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
                          >
                            Sim
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                          >
                            Não
                          </button>
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

// ── Mini components ──────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-blue-500 hover:border-slate-600 transition-colors placeholder:text-slate-600';
