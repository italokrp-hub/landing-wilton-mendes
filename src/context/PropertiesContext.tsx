import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { properties as initialProperties, type Property } from '../data/properties';

interface PropertiesContextValue {
  properties: Property[];
  addProperty: (p: Property) => void;
  updateProperty: (p: Property) => void;
  deleteProperty: (id: string) => void;
}

const PropertiesContext = createContext<PropertiesContextValue | null>(null);

const STORAGE_KEY = 'wilton_properties';

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Property[]) : initialProperties;
    } catch {
      return initialProperties;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  const addProperty = (p: Property) => setProperties(prev => [p, ...prev]);

  const updateProperty = (updated: Property) =>
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));

  const deleteProperty = (id: string) =>
    setProperties(prev => prev.filter(p => p.id !== id));

  return (
    <PropertiesContext.Provider value={{ properties, addProperty, updateProperty, deleteProperty }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const ctx = useContext(PropertiesContext);
  if (!ctx) throw new Error('useProperties must be used within PropertiesProvider');
  return ctx;
}
