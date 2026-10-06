import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';
import { Search, SlidersHorizontal, PackageOpen } from 'lucide-react';

export function ProductCatalog({ 
  products, 
  activeCategory, 
  onSelectCategory, 
  searchQuery, 
  setSearchQuery,
  onQuickView,
  onAddToCart
}) {
  const [sortBy, setSortBy] = useState('featured');

  // Filter products by category & search query
  const filteredProducts = products.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // Default
  });

  return (
    <section id="katalog" className="py-16 sm:py-24 bg-[#f7f7f5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b editorial-rule gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              NEW DROPS ART RELEASE - LIMITED STOCK
            </span>
            <h2 className="font-heading text-4xl sm:text-7xl text-neutral-950 tracking-tight mt-2 leading-none">
              ENOY YOUR SHOPPING EXPERIENCE
            </h2>
            <p className="text-sm text-neutral-500 mt-3 max-w-md">
              {sortedProducts.length} Take advantage while stock last  -- YOU SNOOZE, YOU LOSE!
            </p>
          </div>

        </div>

        {/* Filter Toolbar & Search */}
        <div className="bg-transparent py-4 border-b border-[#d7d7d2] mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                  className={`text-[10px] font-bold uppercase tracking-[0.14em] px-0 py-2 mr-5 whitespace-nowrap transition-colors border-b ${
                  activeCategory === cat.id
                    ? 'text-neutral-950 border-neutral-950'
                    : 'text-neutral-500 border-transparent hover:text-neutral-950'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Search Box */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel baju..."
                className="w-full bg-transparent border-b border-neutral-300 pl-8 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-950 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-neutral-300 text-[11px] font-semibold text-neutral-800 px-1 py-2 outline-none focus:border-neutral-950 cursor-pointer appearance-none pr-8"
              >
                <option value="featured">Urutkan: Rekomendasi</option>
                <option value="price-low">Harga: Terendah</option>
                <option value="price-high">Harga: Tertinggi</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-neutral-200 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl text-neutral-900">
              TIDAK ADA PRODUK DITEMUKAN
            </h3>
            <p className="text-sm text-neutral-500 mt-2 mb-6">
              Tidak ada artikel yang cocok dengan pencarian "{searchQuery}" pada kategori ini.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => { onSelectCategory('all'); setSearchQuery(''); }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
