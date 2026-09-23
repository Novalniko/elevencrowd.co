import React from 'react';
import { Eye, ShoppingBag, MessageCircle, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function ProductCard({ product, onQuickView, onAddToCart }) {
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'All Size';

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-400 hover:shadow-card transition-all duration-300 flex flex-col">
      
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
          <span className="bg-white/80 backdrop-blur-sm text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
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
              onAddToCart(product, defaultSize);
            }}
            className="p-3 bg-neutral-950 text-white rounded-full hover:bg-neutral-800 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
            title="Tambah ke Keranjang"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Sizes Available & Stock */}
          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mr-1">Size:</span>
              {product.sizes?.map((sz, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200"
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
            className="font-heading text-xl text-neutral-900 tracking-wide hover:text-neutral-600 cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          {/* Specs Snippet */}
          <p className="text-xs text-neutral-500 line-clamp-1 mt-1 font-normal">
            {product.specs?.material || product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">Harga</span>
            <span className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight">
              {BRAND_CONFIG.formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-lg transition-colors"
          >
            <span>Pesan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
