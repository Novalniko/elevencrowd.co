import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export function FloatingWA() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      
      {/* Tooltip Badge */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-neutral-900 px-4 py-2 rounded-full shadow-float border border-neutral-200 text-xs font-bold animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Tanya Admin? Tekan Ini!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-700 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={BRAND_CONFIG.createInquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Admin ElevenCrowd.co"
        className="relative group p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-float hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
      </a>

    </div>
  );
}
