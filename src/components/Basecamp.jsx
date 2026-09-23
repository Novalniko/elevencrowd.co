import React from 'react';
import { MapPin, Clock, MessageCircle, Instagram, Send } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function Basecamp() {
  return (
    <section id="basecamp" className="py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Location Info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                OFFICIAL STUDIO & BASECAMP
              </span>
              <h2 className="font-heading text-4xl sm:text-6xl text-neutral-950 tracking-tight mt-1">
                KUNJUNGI & HUBUNGI KAMI
              </h2>
              <p className="text-sm text-neutral-600 mt-2 max-w-xl font-normal">
                Punya pertanyaan seputar ketersediaan ukuran, kolaborasi, atau ingin konsultasi produk langsung dengan admin ElevenCrowd.co? Kami siap membantu setiap hari.
              </p>
            </div>

            {/* Info Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Basecamp Store</span>
                </div>
                <p className="text-xs text-neutral-600 font-normal">
                  {BRAND_CONFIG.basecamp}
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Jam Operasional</span>
                </div>
                <p className="text-xs text-neutral-600 font-normal">
                  {BRAND_CONFIG.operationalHours}
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Admin</span>
                </div>
                <p className="text-xs text-neutral-900 font-bold">
                  {BRAND_CONFIG.whatsappDisplay}
                </p>
              </div>

            </div>

            {/* Social Media Link Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={BRAND_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <Instagram className="w-4 h-4 text-rose-500" />
                <span>Instagram @{BRAND_CONFIG.instagram}</span>
              </a>

              <a
                href={BRAND_CONFIG.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <span className="font-black text-sm">♪</span>
                <span>TikTok @{BRAND_CONFIG.tiktok}</span>
              </a>
            </div>

          </div>

          {/* Right Direct WhatsApp Card */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-neutral-800 rounded-full opacity-30 pointer-events-none" />

              <span className="bg-neutral-800 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                FAST RESPONSE
              </span>

              <h3 className="font-heading text-3xl sm:text-4xl mt-4 leading-tight">
                BUTUH BANTUAN ATAU INGIN CUSTOM ORDER?
              </h3>

              <p className="text-xs text-neutral-300 mt-2 font-normal leading-relaxed">
                Tim admin kami standby untuk menjawab pertanyaan Anda seputar detail baju, rekomendasi ukuran, dan konfirmasi ongkos kirim.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href={BRAND_CONFIG.createInquiryUrl("Konsultasi Produk ElevenCrowd")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-950 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>CHAT ADMIN SEKARANG ({BRAND_CONFIG.whatsappDisplay})</span>
                </a>

                <p className="text-[11px] text-neutral-400 text-center">
                  Rata-rata dibalas dalam 5 - 15 menit pada jam operasional
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
