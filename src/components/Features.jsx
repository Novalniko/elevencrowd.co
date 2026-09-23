import React from 'react';
import { Sparkles, ShieldCheck, Truck, Users } from 'lucide-react';

export function Features() {
  const highlights = [
    {
      icon: <Sparkles className="w-6 h-6 text-neutral-950" />,
      title: "100% Premium Cotton",
      desc: "High Quality."
    },
    {
      icon: <Truck className="w-6 h-6 text-neutral-950" />,
      title: "Pengiriman Terpercaya",
      desc: "Bekerja sama dengan ekspedisi resmi (JNT) dengan tracking nomor resi akan dikirimkan ke WhatsApp kamu."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-neutral-950" />,
      title: "Sablon High Density",
      desc: "Teknik sablon plastisol dan Bordir komputer untuk hasil berkualitas tinggi, tidak mudah retak, dan tahan lama."
    },
    {
      icon: <Users className="w-6 h-6 text-neutral-950" />,
      title: "Bangga Brand Lokal",
      desc: "Original Local Brand Indonesia"
    }
  ];

  return (
    <section id="keunggulan" className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            HIGH QUALITY STREETWEAR
          </span>
          <h2 className="font-heading text-4xl sm:text-6xl text-neutral-950 tracking-tight">
            MENGAPA MEMILIH ELEVENCROWD.CO?
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-normal">
             High quality Original Local Brand 100% Made with pride for people pleasure.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 hover:bg-white transition-all duration-300 hover:shadow-card group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-heading text-2xl text-neutral-900 tracking-wide mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
