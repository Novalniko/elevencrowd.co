import React, { useState } from 'react';
import { X, MessageCircle, ShoppingBag, Check, ZoomIn, ShieldAlert } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function ProductModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart
}) {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'All Size'
  );
  const variantOptions = product.specs?.variantOptions || [];
  const [selectedVariant, setSelectedVariant] = useState(variantOptions[0] || '');
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const productImages = product.images?.length > 0 ? product.images : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleOrderWA = () => {
    const orderSize = selectedSize || 'Request size di atas XXL';
    const waUrl = BRAND_CONFIG.createOrderUrl({
      product,
      size: orderSize,
      variantOption: selectedVariant,
      quantity
    });
    window.open(waUrl, '_blank');
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize || 'Request size di atas XXL', quantity, selectedVariant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden animate-scaleIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 hover:bg-white text-neutral-900 rounded-full shadow-md backdrop-blur-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image with Zoom Lightbox */}
          <div className="relative bg-neutral-100 p-6 flex flex-col items-center justify-center min-h-[360px] md:min-h-[500px]">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-inner group">
              <img
                src={productImages[activeImageIndex]}
                alt={product.name}
                className={`w-full h-full object-cover object-center transition-all duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-neutral-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition-all"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isZoomed ? 'Kecilkan' : 'Perbesar Foto'}</span>
              </button>
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-2 mt-3 w-full overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={`${image.slice(0, 20)}-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(index);
                      setIsZoomed(false);
                    }}
                    className={`w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      activeImageIndex === index ? 'border-neutral-950' : 'border-neutral-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {product.badge && (
              <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-900 bg-neutral-200 px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right Column: Details & Ordering */}
          <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-[600px]">
            <div className="space-y-4">
              
              {/* Category & Title */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  {product.category}
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl text-neutral-950 tracking-tight mt-1 leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-2xl font-bold text-neutral-950">
                    {BRAND_CONFIG.formatPrice(product.price)}
                  </div>
                  {product.status && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      product.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      product.status === 'Habis' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {product.status}
                    </span>
                  )}
                  {product.stock !== undefined && (
                    <span className="text-xs text-neutral-500">
                      • Stok: <strong className={product.stock <= 5 ? 'text-rose-600' : 'text-neutral-800'}>{product.stock} pcs</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Product Specifications */}
              {product.specs && (
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                  <span className="font-bold text-neutral-900 block uppercase tracking-wider">
                    Spesifikasi Produk:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-neutral-600">
                    <div>
                      <span className="text-neutral-400 block">Material:</span>
                      <strong className="text-neutral-800 font-semibold">{product.specs.material}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Cutting:</span>
                      <strong className="text-neutral-800 font-semibold">{product.specs.fit}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Warna:</span>
                      <strong className="text-neutral-800 font-semibold">{product.specs.color}</strong>
                    </div>
                  </div>
                </div>
              )}

              {variantOptions.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                    {product.category === 'Jacket' ? 'Pilih Panjang:' : 'Pilih Lengan:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variantOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedVariant(option)}
                        className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all ${
                          selectedVariant === option
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm scale-105'
                            : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-950'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                  Pilih Ukuran (Size):
                </label>

                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setCustomSize('');
                        setIsCustomSizeOpen(false);
                      }}
                      className={`min-w-[48px] py-2.5 px-4 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === size
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm scale-105'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-950'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSizeOpen((open) => !open);
                      setSelectedSize('');
                    }}
                    className={`text-xs font-bold underline underline-offset-2 transition-colors ${
                      isCustomSizeOpen ? 'text-neutral-950' : 'text-neutral-500 hover:text-neutral-950'
                    }`}
                  >
                    Request size di atas XXL
                  </button>

                  {isCustomSizeOpen && (
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customSize}
                        onChange={(event) => {
                          const value = event.target.value.toUpperCase();
                          setCustomSize(value);
                          setSelectedSize(value);
                        }}
                        placeholder="Contoh: XXXL, 4XL, atau ukuran custom"
                        className="flex-1 bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                        autoFocus
                      />
                      <span className="text-[11px] text-neutral-500 self-center">
                        Dikonfirmasi admin
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Counter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                  Jumlah Pesanan:
                </label>
                <div className="inline-flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-xs font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 mt-4 border-t border-neutral-100">
              {/* WhatsApp Direct Order */}
              <button
                onClick={handleOrderWA}
                className="w-full flex items-center justify-center gap-3 bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>PESAN SEKARANG VIA WHATSAPP</span>
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-900 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>TAMBAH KE KERANJANG</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 text-center pt-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pesanan akan dikirimkan langsung ke admin WhatsApp <strong>{BRAND_CONFIG.whatsappDisplay}</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
