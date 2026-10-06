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
    <section id="keunggulan" className="py-14 sm:py-20 bg-[#e5e5df] border-b border-[#d7d7d2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            The ElevenCrowd standard
          </span>
          <h2 className="font-heading text-4xl sm:text-6xl text-neutral-950 tracking-tight leading-none max-w-2xl">
            BUILT FOR THE EVERYDAY.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-normal max-w-md">
            High quality original local streetwear, made with pride for people pleasure.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-neutral-400">
          {highlights.map((item, idx) => (
            <div 
              key={idx}
              className="min-h-[245px] p-5 sm:p-6 border-r border-b border-neutral-400 transition-colors duration-300 hover:bg-[#efefe9] group"
            >
              <div className="w-10 h-10 border border-neutral-400 flex items-center justify-center mb-8 group-hover:bg-white transition-colors">
                {item.icon}
              </div>
              <h3 className="font-heading text-xl sm:text-2xl text-neutral-900 tracking-wide leading-[1.05] mb-2 max-w-[14rem]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal max-w-[18rem]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
