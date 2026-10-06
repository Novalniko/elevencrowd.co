import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function Navbar({ 
  cartCount, 
  onOpenCart, 
  searchQuery, 
  setSearchQuery,
  onSelectCategory,
  onOpenTracking,
  onOpenMember,
  member
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
    <header className="sticky top-0 z-40 bg-[#f7f7f5]/95 backdrop-blur-md border-b border-[#d7d7d2] transition-all duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between min-h-16 sm:min-h-20 gap-6">
          
          {/* Brand Logo */}
          <div className="flex min-w-0 items-center gap-8 sm:gap-14">
            <a href="#" className="flex items-center gap-0.5 sm:gap-1 group shrink-0">
              <img
                src="/images/el%20ireng.png"
                alt="ElevenCrowd.co"
                className="h-9 w-16 sm:h-11 sm:w-20 object-contain object-left -mr-3 sm:-mr-4 group-hover:opacity-60 transition-opacity"
              />
              <span className="flex flex-col border-l border-neutral-300 pl-1 sm:pl-1.5">
                <span className="font-heading text-sm sm:text-base tracking-[0.08em] text-neutral-950 whitespace-nowrap">
                  ELEVEN CROWD
                </span>
                <span className="text-[7px] sm:text-[8px] tracking-[0.2em] text-neutral-500 uppercase mt-0.5 font-semibold whitespace-nowrap">
                  Authentic streetwear
                </span>
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-[11px] font-bold tracking-[0.14em] uppercase text-neutral-700">
              <button 
                onClick={() => scrollToSection('katalog')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                Shop
              </button>
              <button 
                onClick={() => scrollToSection('kategori')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                Collections
              </button>
              <button 
                onClick={() => scrollToSection('keunggulan')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                Journal
              </button>
              <button 
                onClick={() => scrollToSection('basecamp')} 
                className="hover:text-neutral-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-neutral-950 hover:after:w-full after:transition-all"
              >
                About
              </button>
              <button onClick={onOpenTracking} className="hover:text-neutral-950 transition-colors py-1">Tracking</button>
              <button onClick={onOpenMember} className="hover:text-neutral-950 transition-colors py-1">{member ? 'Member' : 'Login'}</button>
            </nav>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            
            {/* Search Input Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-white rounded-none px-3 py-1.5 border border-neutral-300 w-44 sm:w-64 animate-fadeIn">
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
                  className="p-2 sm:p-2.5 text-neutral-700 hover:text-neutral-950 hover:bg-white rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="Buka Keranjang Belanja"
              className="relative p-2 sm:p-2.5 text-neutral-800 hover:text-neutral-950 hover:bg-white rounded-full transition-colors"
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
              className="hidden lg:inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-2.5 rounded-none transition-all"
            >
              <span>Order via WA</span>
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
              Shop
            </button>
            <button 
              onClick={() => scrollToSection('kategori')} 
              className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950"
            >
              Collections
            </button>
            <button 
              onClick={() => scrollToSection('keunggulan')} 
              className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950"
            >
              Journal
            </button>
            <button 
              onClick={() => scrollToSection('basecamp')} 
              className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950"
            >
              About
            </button>
            <button onClick={onOpenTracking} className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950">Tracking</button>
            <button onClick={onOpenMember} className="text-left py-2 border-b border-neutral-100 hover:text-neutral-950">{member ? 'Member' : 'Login Member'}</button>
          </div>

          {/* WhatsApp Contact on Mobile */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={BRAND_CONFIG.createInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800"
            >
              Chat WhatsApp Admin (0838-9642-7726)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
