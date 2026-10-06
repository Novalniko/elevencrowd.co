import React from 'react';
import { CATEGORIES } from '../data/products';
import { Shirt, Sparkles, Layers, Shield, Compass } from 'lucide-react';

export function Categories({ activeCategory, onSelectCategory, products }) {
  // Hitung jumlah produk dinamis per kategori
  const getCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.category === catId).length;
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'T-Shirt': return <Shirt className="w-5 h-5" />;
      case 'Oversized': return <Layers className="w-5 h-5" />;
      case 'Hoodie': return <Shield className="w-5 h-5" />;
      case 'Jacket': return <Compass className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="kategori" className="py-16 sm:py-24 bg-white border-b border-[#d7d7d2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Collections / Index
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl text-neutral-950 tracking-tight mt-2 leading-none">
              FIND YOUR UNIFORM
            </h2>
          </div>
          <p className="text-sm text-neutral-500 md:mb-1 max-w-sm">
            Potongan harian, heavyweight essentials, dan benda-benda kecil untuk bergerak di kota.
          </p>
        </div>

        {/* Categories Grid / Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-[#d7d7d2]">
          {CATEGORIES.map((cat) => {
            const count = getCount(cat.id);
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const el = document.getElementById('katalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group flex items-center justify-between gap-4 py-5 px-1 border-b border-r-[#d7d7d2] text-left transition-colors duration-200 ${
                  isActive
                    ? 'bg-neutral-950 text-white border-neutral-950'
                    : 'bg-white hover:bg-[#f3f3ef] text-neutral-800 border-[#d7d7d2]'
                }`}
              >
                <div className={`p-2 transition-colors ${
                  isActive ? 'text-white' : 'text-neutral-900 group-hover:text-neutral-500'
                }`}>
                  {getCategoryIcon(cat.id)}
                </div>

                <span className="font-heading text-lg tracking-wider block flex-1">{cat.name}</span>
                <span className={`text-[11px] font-medium ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}>{String(count).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
