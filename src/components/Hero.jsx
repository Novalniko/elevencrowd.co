import React from 'react';
import { ArrowDown, MessageCircle, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function Hero({ onExploreClick }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-neutral-200">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text & CTAs */}
          <div className="lg:col-span-12 space-y-6 text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-300 px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-neutral-900 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-800">
                NEW SEASON COLLECTION • 2026 DROP
              </span>
            </div>

            {/* Main Streetwear Heading */}
            <div className="space-y-1">
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl tracking-tight text-neutral-950 leading-[0.92]">
                HELLO,LADS CROWD!. <br />
                WELCOME TO OUR WEBSITE AND HAPPY SHOPPING!
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed pt-2">
              Koleksi terbaru dari kami yang selalu upgrade penampilan kalian,lads! <strong className="text-neutral-950 font-semibold">ElevenCrowd.co</strong>. Made with pride for people pleasure. 100% high quality cotton with plastisol ink
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm tracking-wider uppercase px-7 py-4 rounded-xl transition-all shadow-md hover:shadow-xl group"
              >
                <span>JELAJAHI KATALOG</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              <a
                href={BRAND_CONFIG.createInquiryUrl("Koleksi Terbaru ElevenCrowd")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-neutral-50 text-neutral-950 border-2 border-neutral-900 font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>KONSULTASI WA</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-2.5 text-neutral-700">
                <ShieldCheck className="w-5 h-5 text-neutral-950 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-neutral-900">100% Cotton</p>
                  <p className="text-neutral-500">High Quality Material</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-neutral-700">
                <Truck className="w-5 h-5 text-neutral-950 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-neutral-900">Kirim Cepat</p>
                  <p className="text-neutral-500">Seluruh Indonesia</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-neutral-700">
                <Zap className="w-5 h-5 text-neutral-950 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-neutral-900">Fast Response</p>
                  <p className="text-neutral-500">Admin 083896427726</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
