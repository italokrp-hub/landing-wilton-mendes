export interface Broker {
  name: string;
  phone: string;
  whatsapp: string;
}

// Wilton's contact — single source imported from config/broker.ts
const WILTON_BROKER: Broker = {
  name: 'Wilton Mendes',
  phone: '92984179972',
  whatsapp: '5592984179972',
};

export type PropertyType =
  | 'Apartamento'
  | 'Prédio'
  | 'Casa'
  | 'Cobertura'
  | 'Sala Comercial'
  | 'Terreno';

export type PropertyPurpose = 'Venda' | 'Aluguel' | 'Venda e Aluguel';

export type PropertyStatus = 'Disponível' | 'Em lançamento' | 'Em construção' | 'Entregue';

export interface PropertyFeature {
  icon: string;  // emoji used as icon
  label: string;
}

export interface Property {
  id: string;
  code: string;
  title: string;
  neighborhood: string;
  city: string;
  state: string;
  price: number;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];            // gallery images (falls back to [image])
  broker: Broker;
  featured?: boolean;
  launchTag?: string;
  // Detail fields
  fullAddress?: string;         // e.g. "Av. Dr. Aldy Mentor, 2210 — Praia do Futuro, Fortaleza/CE"
  addressNote?: string;         // e.g. "(antiga Av. Padre Antônio Tomás)"
  features?: PropertyFeature[]; // list of attributes with emoji icons
  leisure?: string;             // free-text leisure description
  deliveryForecast?: string;    // e.g. "abril de 2028"
}

export const properties: Property[] = [
  {
    id: '1',
    code: 'IMB-001',
    title: 'ATLÂNTICO CONDOMÍNIO CLUBE | PRAIA DO FUTURO',
    neighborhood: 'Praia do Futuro',
    city: 'Fortaleza',
    state: 'CE',
    price: 420000,
    type: 'Apartamento',
    purpose: 'Venda',
    status: 'Em construção',
    bedrooms: 2,
    bathrooms: 1,
    area: 48.95,
    image: '/images/imovel_atlantico_1790896979412.png',
    images: ['/images/imovel_atlantico_1790896979412.png'],
    broker: WILTON_BROKER,
    featured: true,
    fullAddress: 'Av. Dr. Aldy Mentor, 2210 — Praia do Futuro, Fortaleza/CE',
    addressNote: '(antiga Av. Padre Antônio Tomás)',
    features: [
      { icon: '🛏️', label: '2 quartos' },
      { icon: '🛋️', label: 'Opções com 1 suíte' },
      { icon: '📐', label: 'Plantas de 48,95 m² a 100,02 m²' },
      { icon: '🚗', label: '1 vaga' },
      { icon: '🌿', label: 'Opções Garden' },
      { icon: '🏢', label: '3 torres' },
      { icon: '🏘️', label: '322 unidades' },
      { icon: '🌳', label: '10.000 m² de terreno' },
      { icon: '🏗️', label: '14 pavimentos' },
    ],
    leisure:
      'Piscina | Academia | Salão de festas | Coworking | Lounge externo | Redário | Pet Place | Playground | Bicicletário | Espaço de jogos | Churrasqueira',
    deliveryForecast: 'abril de 2028',
  },
  {
    id: '2',
    code: 'IMB-002',
    title: 'VISTA COSTEIRA | LANÇAMENTO NO CUMBUCO',
    neighborhood: 'Cumbuco',
    city: 'Caucaia',
    state: 'CE',
    price: 429820,
    type: 'Apartamento',
    purpose: 'Venda',
    status: 'Em lançamento',
    bedrooms: 2,
    bathrooms: 1,
    area: 121.34,
    image: '/images/imovel_vista_costeira_1790896989045.png',
    images: ['/images/imovel_vista_costeira_1790896989045.png'],
    broker: WILTON_BROKER,
    launchTag: 'Lançamento',
    fullAddress: 'Rua da Praia, s/n — Cumbuco, Caucaia/CE',
    addressNote: '(próximo ao acesso principal da praia)',
    features: [
      { icon: '🛏️', label: '2 quartos' },
      { icon: '📐', label: 'Plantas de 60 m² a 121,34 m²' },
      { icon: '🚗', label: '1 a 2 vagas' },
      { icon: '🌊', label: 'Vista para o mar' },
      { icon: '🏢', label: '2 torres' },
      { icon: '🏘️', label: '160 unidades' },
      { icon: '🌳', label: '8.500 m² de terreno' },
      { icon: '🏗️', label: '12 pavimentos' },
    ],
    leisure:
      'Piscina | Deck molhado | Lounge de praia | Churrasqueira | Playground | Academia | Salão de festas | Pet Place | Espaço Gourmet',
    deliveryForecast: 'dezembro de 2027',
  },
  {
    id: '3',
    code: 'IMB-003',
    title: 'SMART TOWER ITAPURANGA II',
    neighborhood: 'Ponta Negra',
    city: 'Manaus',
    state: 'AM',
    price: 386500,
    type: 'Prédio',
    purpose: 'Venda',
    status: 'Disponível',
    bedrooms: 2,
    bathrooms: 1,
    area: 52.65,
    image: '/images/imovel_smart_tower_1790896998430.png',
    images: ['/images/imovel_smart_tower_1790896998430.png'],
    broker: WILTON_BROKER,
    fullAddress: 'Av. Coronel Teixeira, 5500 — Ponta Negra, Manaus/AM',
    addressNote: '(Setor empresarial e residencial integrado)',
    features: [
      { icon: '🛏️', label: '2 quartos' },
      { icon: '🛋️', label: '1 suíte' },
      { icon: '📐', label: '52,65 m²' },
      { icon: '🚗', label: '1 vaga coberta' },
      { icon: '🏢', label: '1 torre' },
      { icon: '🏘️', label: '200 unidades' },
      { icon: '🏗️', label: '20 pavimentos' },
    ],
    leisure:
      'Piscina | Academia completa | Coworking | Salão de festas | Playground | Bicicletário | Lavanderia coletiva | Lounge social',
    deliveryForecast: 'junho de 2026',
  },
  {
    id: '4',
    code: 'IMB-004',
    title: 'RESERVA JARDIM | CONDOMÍNIO CLUB RECIFE',
    neighborhood: 'Boa Viagem',
    city: 'Recife',
    state: 'PE',
    price: 695000,
    type: 'Apartamento',
    purpose: 'Venda',
    status: 'Disponível',
    bedrooms: 3,
    bathrooms: 2,
    area: 98.40,
    image: '/images/imovel_jardim_botanico_1790897174732.png',
    images: ['/images/imovel_jardim_botanico_1790897174732.png'],
    broker: WILTON_BROKER,
    featured: true,
    fullAddress: 'Rua Barão de Souza Leão, 440 — Boa Viagem, Recife/PE',
    addressNote: '(a 300 m da praia de Boa Viagem)',
    features: [
      { icon: '🛏️', label: '3 quartos' },
      { icon: '🛋️', label: '2 suítes' },
      { icon: '📐', label: '98,40 m²' },
      { icon: '🚗', label: '2 vagas cobertas' },
      { icon: '🏢', label: '4 torres' },
      { icon: '🏘️', label: '280 unidades' },
      { icon: '🌳', label: '15.000 m² de terreno' },
      { icon: '🏗️', label: '18 pavimentos' },
    ],
    leisure:
      'Piscinas adulto e infantil | Academia | Salão de festas | Salão de jogos | Playground | Espaço Gourmet | Quadra poliesportiva | Pet Place | Bicicletário | Sauna',
    deliveryForecast: 'março de 2026',
  },
  {
    id: '5',
    code: 'IMB-005',
    title: 'COSTA MAR TOWERS | BEIRA MAR MACEIÓ',
    neighborhood: 'Pajuçara',
    city: 'Maceió',
    state: 'AL',
    price: 548900,
    type: 'Apartamento',
    purpose: 'Venda',
    status: 'Disponível',
    bedrooms: 3,
    bathrooms: 2,
    area: 87.20,
    image: '/images/imovel_beira_rio_1790897184282.png',
    images: ['/images/imovel_beira_rio_1790897184282.png'],
    broker: WILTON_BROKER,
    fullAddress: 'Av. Álvaro Otacílio, 1800 — Pajuçara, Maceió/AL',
    addressNote: '(frente ao mar, próximo ao Parque Municipal)',
    features: [
      { icon: '🛏️', label: '3 quartos' },
      { icon: '🛋️', label: '1 suíte master' },
      { icon: '📐', label: '87,20 m²' },
      { icon: '🚗', label: '2 vagas' },
      { icon: '🌊', label: 'Vista para o mar' },
      { icon: '🏢', label: '2 torres' },
      { icon: '🏘️', label: '120 unidades' },
      { icon: '🏗️', label: '22 pavimentos' },
    ],
    leisure:
      'Piscina com raia | Deck molhado | Lounge de beira-mar | Academia | Salão de festas | Churrasqueira | Playground | Coworking | Spa',
    deliveryForecast: 'agosto de 2026',
  },
  {
    id: '6',
    code: 'IMB-006',
    title: 'AURA PENTHOUSES | PONTA NEGRA',
    neighborhood: 'Ponta Negra',
    city: 'Natal',
    state: 'RN',
    price: 1250000,
    type: 'Cobertura',
    purpose: 'Venda',
    status: 'Disponível',
    bedrooms: 4,
    bathrooms: 3,
    area: 210.00,
    image: '/images/imovel_solar_palace_1790897250792.png',
    images: ['/images/imovel_solar_palace_1790897250792.png'],
    broker: WILTON_BROKER,
    featured: true,
    fullAddress: 'Via Costeira, 4500 — Ponta Negra, Natal/RN',
    addressNote: '(a 50 m das dunas do Morro do Careca)',
    features: [
      { icon: '🛏️', label: '4 quartos' },
      { icon: '🛋️', label: '3 suítes' },
      { icon: '📐', label: '210 m² privativos + 80 m² terraço' },
      { icon: '🚗', label: '3 vagas privativas' },
      { icon: '🏊', label: 'Piscina privativa no terraço' },
      { icon: '🏢', label: '1 torre exclusiva' },
      { icon: '🏘️', label: '24 unidades' },
      { icon: '🏗️', label: '25 pavimentos' },
    ],
    leisure:
      'Piscina de borda infinita | Spa completo | Academia premium | Wine Lounge | Salão de festas | Coworking executivo | Heliponto | Concierge 24h',
    deliveryForecast: 'outubro de 2027',
  },
];

export const cities = ['Todas as cidades', ...Array.from(new Set(properties.map(p => p.city)))];
export const types: string[] = ['Todos os tipos', 'Apartamento', 'Prédio', 'Casa', 'Cobertura', 'Sala Comercial', 'Terreno'];
export const purposes: string[] = ['Venda e Aluguel', 'Venda', 'Aluguel'];
export const priceRanges = [
  { label: 'Todos os preços', min: 0, max: Infinity },
  { label: 'Até R$ 300.000', min: 0, max: 300000 },
  { label: 'R$ 300k - R$ 500k', min: 300000, max: 500000 },
  { label: 'R$ 500k - R$ 800k', min: 500000, max: 800000 },
  { label: 'R$ 800k - R$ 1.2M', min: 800000, max: 1200000 },
  { label: 'Acima de R$ 1.2M', min: 1200000, max: Infinity },
];
