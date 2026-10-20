// Wilton Mendes — Consultoria Imobiliária
// WhatsApp: 92 98413-8859

export const WILTON = {
  name: 'Wilton Mendes',
  firstName: 'Wilton',
  phone: '92984138859',
  whatsapp: '5592984138859',
  creci: 'CRECI-AM 12.345-F',
  experience: 'Profissional com amplo conhecimento no mercado imobiliário',
  site: 'wiltonmendescorretor.com.br',
  instagram: '@wiltonmendescorretor',
  email: 'wilton@wiltonmendescorretor.com.br',
  photo: '/images/wilton.jpg',
} as const;

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
