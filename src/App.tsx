import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroFilters from './components/HeroFilters';
import PropertyGrid from './components/PropertyGrid';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { PropertiesProvider, useProperties } from './context/PropertiesContext';
import { priceRanges } from './data/properties';

export interface Filters {
  search: string;
  city: string;
  type: string;
  purpose: string;
  priceRange: string;
}

const defaultFilters: Filters = {
  search: '',
  city: 'Todas as cidades',
  type: 'Todos os tipos',
  purpose: 'Venda e Aluguel',
  priceRange: 'Todos os preços',
};

function PortalHome() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const { properties } = useProperties();

  const filteredProperties = useMemo(() => {
    const priceRange = priceRanges.find(r => r.label === filters.priceRange) ?? priceRanges[0];
    return properties.filter(p => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.city !== 'Todas as cidades' && p.city !== filters.city) return false;
      if (filters.type !== 'Todos os tipos' && p.type !== filters.type) return false;
      if (filters.purpose !== 'Venda e Aluguel' && p.purpose !== filters.purpose) return false;
      if (p.price < priceRange.min || p.price > priceRange.max) return false;
      return true;
    });
  }, [filters, properties]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <HeroFilters filters={filters} onFilterChange={setFilters} />
        <PropertyGrid properties={filteredProperties} totalCount={filteredProperties.length} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PropertiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortalHome />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </PropertiesProvider>
  );
}
