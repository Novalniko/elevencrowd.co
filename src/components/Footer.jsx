import React from 'react';
import { BRAND_CONFIG } from '../data/config';
import { Instagram, MessageCircle, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-200">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-col">
              <span className="font-heading text-4xl tracking-widest text-neutral-950">
                ELEVEN CROWD<span className="text-neutral-400">.CO</span>
              </span>
              <span className="text-[11px] tracking-[0.25em] text-neutral-500 uppercase -mt-1 font-semibold">
                Authentic Streetwear & Apparel
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed font-normal">
              Brand fashion streetwear lokal.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white rounded-full transition-colors text-neutral-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={BRAND_CONFIG.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white rounded-full transition-colors text-neutral-800"
                aria-label="TikTok"
              >
                <span className="font-bold text-xs">TikTok</span>
              </a>

              <a
                href={BRAND_CONFIG.createInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white rounded-full transition-colors text-neutral-800"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-xl text-neutral-950 tracking-wider">
              NAVIGASI
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              <li><a href="#katalog" className="hover:text-neutral-950 transition-colors">Katalog Pakaian</a></li>
              <li><a href="#kategori" className="hover:text-neutral-950 transition-colors">Kategori Produk</a></li>
              <li><a href="#keunggulan" className="hover:text-neutral-950 transition-colors">Keunggulan Bahan</a></li>
              <li><a href="#basecamp" className="hover:text-neutral-950 transition-colors">Basecamp & Toko</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-xl text-neutral-950 tracking-wider">
              KATEGORI
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-600">
              <li><span>Regular T-Shirt</span></li>
              <li><span>Hoodie & Crewneck</span></li>
              <li><span>Streetwear Accessories</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xl text-neutral-950 tracking-wider">
              HUBUNGI KAMI
            </h4>
            <p className="text-xs text-neutral-600">
              WhatsApp CS: <strong className="text-neutral-950">{BRAND_CONFIG.whatsappDisplay}</strong>
            </p>
            <p className="text-xs text-neutral-600">
              Jam Kerja: <br /><span className="text-neutral-500">{BRAND_CONFIG.operationalHours}</span>
            </p>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. Seluruh Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-neutral-950 fill-neutral-950" /> untuk Streetwear Culture Indonesia
          </p>
        </div>

      </div>
    </footer>
  );
}
