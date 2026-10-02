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
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  broker: Broker;
  featured?: boolean;
  launchTag?: string;
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
    bedrooms: 2,
    bathrooms: 1,
    area: 48.95,
    image: '/images/imovel_atlantico_1790896979412.png',
    broker: WILTON_BROKER,
    featured: true,
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
    bedrooms: 2,
    bathrooms: 1,
    area: 121.34,
    image: '/images/imovel_vista_costeira_1790896989045.png',
    broker: WILTON_BROKER,
    launchTag: 'Lançamento',
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
    bedrooms: 2,
    bathrooms: 1,
    area: 52.65,
    image: '/images/imovel_smart_tower_1790896998430.png',
    broker: WILTON_BROKER,
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
    bedrooms: 3,
    bathrooms: 2,
    area: 98.40,
    image: '/images/imovel_jardim_botanico_1790897174732.png',
    broker: WILTON_BROKER,
    featured: true,
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
    bedrooms: 3,
    bathrooms: 2,
    area: 87.20,
    image: '/images/imovel_beira_rio_1790897184282.png',
    broker: WILTON_BROKER,
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
    bedrooms: 4,
    bathrooms: 3,
    area: 210.00,
    image: '/images/imovel_solar_palace_1790897250792.png',
    broker: WILTON_BROKER,
    featured: true,
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
