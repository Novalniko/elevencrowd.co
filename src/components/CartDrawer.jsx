import React from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, Plus, Minus } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onExploreProducts,
  onCheckout
}) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 transform transition-transform animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-100 text-neutral-950 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-2xl text-neutral-950 leading-tight">
                KERANJANG BELANJA
              </h3>
              <p className="text-xs text-neutral-500">
                {totalItems} item pakaian terpilih
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="p-5 flex-1 overflow-y-auto divide-y divide-neutral-100 space-y-4">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.size}-${item.variantOption}-${item.color}-${idx}`} className="pt-4 first:pt-0 flex gap-4 items-center">
                
                {/* Thumbnail */}
                <div className="w-16 h-20 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading text-lg text-neutral-900 truncate leading-snug">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-800 border border-neutral-200">
                      Size: {item.size}
                    </span>
                    {item.variantOption && (
                      <span className="bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-800 border border-neutral-200">
                        {item.variantOption}
                      </span>
                    )}
                    {item.color && (
                      <span className="bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-800 border border-neutral-200">
                        {item.color}
                      </span>
                    )}
                    <span>{BRAND_CONFIG.formatPrice(item.price)}</span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.size, Math.max(1, item.quantity - 1), item.variantOption, item.color)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1, item.variantOption, item.color)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id, item.size, item.variantOption, item.color)}
                      className="text-neutral-400 hover:text-rose-500 p-1.5 transition-colors"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            /* Empty Cart */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-heading text-2xl text-neutral-900">
                  KERANJANG MASIH KOSONG
                </h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Kamu belum memilih baju apapun. Silakan jelajahi katalog pakaian ElevenCrowd.co kami!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
                className="px-5 py-2.5 bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Subtotal ({totalItems} item)</span>
                <span className="font-semibold text-neutral-900">{BRAND_CONFIG.formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Estimasi Ongkir</span>
                <span className="text-emerald-600 font-medium">Dihitung oleh Admin</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-heading text-xl text-neutral-950">TOTAL ESTIMASI</span>
                <span className="font-heading text-2xl text-neutral-950">
                  {BRAND_CONFIG.formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>CHECKOUT PESANAN</span>
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-2 text-center text-xs text-neutral-400 hover:text-neutral-700 font-medium transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
