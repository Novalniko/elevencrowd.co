import React, { useState } from 'react';
import { ShoppingBag, Search, MessageCircle, Menu, X, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function Navbar({ 
  cartCount, 
  onOpenCart, 
  searchQuery, 
  setSearchQuery,
  onSelectCategory
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const targetId = id === 'More Information Order' ? 'basecamp' : id;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all duration-200">
      {/* Top Banner Promo */}
      <div className="bg-neutral-950 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
        <span>Welcome to our Official Website ELEVENCROWD.CO</span>
        <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex flex-col group">
              <img
                src="/images/el%20ireng.png"
                alt="ElevenCrowd.co"
                className="h-12 w-32 object-contain object-left group-hover:opacity-80 transition-opacity"
              />
              <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase -mt-1 font-semibold">
                Streetwear Culture
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide uppercase text-neutral-700">
              <button 
                onClick={() => scrollToSection('katalog')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                Katalog
              </button>
              <button 
                onClick={() => scrollToSection('kategori')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                Kategori
              </button>
              <button 
                onClick={() => scrollToSection('keunggulan')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                Keunggulan
              </button>
              <button 
                onClick={() => scrollToSection('basecamp')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                More Information Order
              </button>
            </nav>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-neutral-100 rounded-full px-3 py-1.5 border border-neutral-300 w-44 sm:w-64 animate-fadeIn">
                  <Search className="w-4 h-4 text-neutral-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari baju, hoodie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent text-sm w-full outline-none text-neutral-900 placeholder-neutral-400"
                  />
                  <button 
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="text-neutral-400 hover:text-neutral-700 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Cari produk"
                  className="p-2.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="Buka Keranjang Belanja"
              className="relative p-2.5 text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-neutral-950 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA Button */}
            <a
              href={BRAND_CONFIG.createInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>ORDER VIA WA</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-800 hover:text-neutral-950 rounded-lg"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-6 py-5 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3 font-semibold uppercase tracking-wider text-sm text-neutral-800">
            <button 
              onClick={() => scrollToSection('katalog')} 
              className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950"
            >
              Katalog Produk
            </button>
            <button 
              onClick={() => scrollToSection('kategori')} 
              className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950"
            >
              Kategori Pilihan
            </button>
            <button 
              onClick={() => scrollToSection('keunggulan')} 
              className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950"
            >
              Keunggulan Bahan
            </button>
            <button 
              onClick={() => scrollToSection('basecamp')} 
              className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950"
            >
              More Information Order
            </button>
          </div>

          {/* WhatsApp Contact on Mobile */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={BRAND_CONFIG.createInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Chat WhatsApp Admin (0838-9642-7726)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
