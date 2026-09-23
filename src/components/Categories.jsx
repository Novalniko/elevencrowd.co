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
      case 'Hoodie': return <Shield className="w-5 h-5" />;
      case 'Jacket': return <Compass className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="kategori" className="py-12 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              KATEGORI KOLEKSI
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl text-neutral-950 tracking-tight mt-1">
              Upgrage your style in here
            </h2>
          </div>
          <p className="text-sm text-neutral-500 mt-2 md:mt-0 max-w-sm">
            Temukan artikel pakaian streetwear berkualitas terbaik dari ElevenCrowd.co sesuai preferensi harianmu.
          </p>
        </div>

        {/* Categories Grid / Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                className={`group flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                  isActive
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-md transform -translate-y-0.5'
                    : 'bg-neutral-50 hover:bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:shadow-sm'
                }`}
              >
                <div className={`p-2.5 rounded-full mb-2.5 transition-colors ${
                  isActive ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900 group-hover:bg-neutral-100'
                }`}>
                  {getCategoryIcon(cat.id)}
                </div>

                <span className="font-heading text-lg tracking-wider block">
                  {cat.name}
                </span>

                <span className={`text-[11px] font-medium mt-0.5 ${
                  isActive ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  {count} Artikel
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
