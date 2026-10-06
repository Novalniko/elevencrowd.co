import React from 'react';
import { Eye, ShoppingBag, MessageCircle, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function ProductCard({ product, onQuickView, onAddToCart }) {
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'All Size';

  return (
    <div className="group bg-white border-t border-[#d7d7d2] overflow-hidden transition-colors duration-300 flex flex-col">
      
      {/* Image Container with Badges & Hover Overlay */}
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        {product.status === 'Habis' || product.stock === 0 ? (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm bg-rose-600 text-white">
              HABIS
            </span>
          </div>
        ) : product.status === 'Pre-Order' ? (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm bg-amber-400 text-neutral-950">
              PRE-ORDER
            </span>
          </div>
        ) : product.badge ? (
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm ${
              product.badge === 'BEST SELLER' 
                ? 'bg-amber-400 text-neutral-950' 
                : product.badge === 'LIMITED'
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-950 text-white'
            }`}>
              {product.badge}
            </span>
          </div>
        ) : null}

        {/* Category Pill on image */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 text-neutral-800 text-[10px] font-semibold px-2 py-1 uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-3 bg-white text-neutral-950 rounded-full hover:bg-neutral-100 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
            title="Lihat Detail Produk"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.status === 'Habis' || product.stock === 0) return;
              onAddToCart(product, defaultSize);
            }}
            disabled={product.status === 'Habis' || product.stock === 0}
            className="p-3 bg-neutral-950 text-white rounded-full hover:bg-neutral-800 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
            title="Tambah ke Keranjang"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="py-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Sizes Available & Stock */}
          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mr-1">Size:</span>
              {product.sizes?.map((sz, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] font-medium text-neutral-600 border-b border-neutral-300 px-1.5 py-0.5"
                >
                  {sz}
                </span>
              ))}
            </div>
            {product.stock !== undefined && (
              <span className={`text-[10px] font-semibold ${product.stock <= 5 ? 'text-rose-600' : 'text-neutral-500'}`}>
                Stok: {product.stock}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-heading text-2xl text-neutral-900 tracking-wide hover:text-neutral-600 cursor-pointer line-clamp-2 transition-colors"
          >
            {product.name}
          </h3>

          {/* Specs Snippet */}
          <p className="text-xs text-neutral-500 line-clamp-1 mt-1 font-normal">
            {product.specs?.material || product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">Harga</span>
            <span className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight">
              {BRAND_CONFIG.formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-950 hover:text-neutral-600 border-b border-neutral-950 pb-1 transition-colors"
          >
            <span>Pesan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
