import React from 'react';
import { ArrowDown, ShieldCheck, Truck, Zap } from 'lucide-react';

export function Hero({ onExploreClick }) {
  return (
    <section className="relative overflow-hidden bg-[#f7f7f5] border-b border-[#d7d7d2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 lg:pt-16">
        <div className="flex items-center justify-between border-y border-[#d7d7d2] py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          <span>ElevenCrowd.co / 2026</span>
          <span>New season / </span>
        </div>

        <div className="py-14 sm:py-20 lg:py-24">
          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500 mb-5">
              Welcome to our official website - ElevenCrowd.co
            </p>
            <h1 className="font-heading text-[clamp(3.6rem,9vw,9.5rem)] text-neutral-950 leading-[0.86] max-w-4xl">
              MADE FOR<br />PEOPLE PLEASURE
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-8 max-w-2xl">
              <p className="text-sm leading-relaxed text-neutral-600 max-w-sm">
              Upgrade your look when support the club. ElevenCrowd.co is built on the foundation of modern football culture.
              </p>
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-3 shrink-0 text-[11px] font-bold uppercase tracking-[0.15em] border-b-2 border-neutral-950 pb-2 hover:gap-5 transition-all"
              >
                Enter the shop <ArrowDown className="w-4 h-4 -rotate-45" />
              </button>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#d7d7d2] py-5 gap-5 text-[11px] uppercase tracking-[0.12em] text-neutral-600">
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-neutral-950" /> Premium cotton / high density print</div>
          <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-neutral-950" /> Ships across Indonesia</div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-neutral-950" /> New drops, limited quantities</div>
        </div>
      </div>
    </section>
  );
}
