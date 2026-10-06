import React, { useState } from 'react';
import { ArrowLeft, Search, PackageCheck } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { orderService } from '../services/orderService';

export function TrackingPage({ onNavigateToStore }) {
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    setOrder(orderService.getByTrackingId(trackingId));
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-neutral-900 font-body">
      <header className="border-b border-[#d7d7d2] px-4 sm:px-8 py-5">
        <button onClick={onNavigateToStore} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-neutral-500"><ArrowLeft className="w-4 h-4" /> Kembali ke toko</button>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Order / Tracking</p>
        <h1 className="font-heading text-5xl sm:text-7xl leading-none mt-2">LACAK PESANAN</h1>
        <p className="text-sm text-neutral-600 mt-4 max-w-lg">Masukkan ID tracking yang Anda terima setelah checkout untuk melihat status pesanan.</p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mt-8">
          <input value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder="Contoh: EC-20260925-8F4K2" className="flex-1 border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-950" />
          <button className="inline-flex items-center justify-center gap-2 bg-neutral-950 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"><Search className="w-4 h-4" /> Cari pesanan</button>
        </form>

        {hasSearched && !order && <p className="mt-6 text-sm text-rose-600">ID tracking tidak ditemukan pada perangkat ini.</p>}
        {order && (
          <section className="mt-10 bg-white border border-neutral-200 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-5">
              <div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Tracking ID</p><p className="font-mono text-lg mt-1">{order.trackingId}</p></div>
              <PackageCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-xs text-neutral-500 mt-5">Pemesan: <strong className="text-neutral-900">{order.customer.name}</strong></p>
            <p className="text-xs text-neutral-500 mt-2">Pembayaran: <strong className={order.paymentStatus === 'Pembayaran dikonfirmasi' ? 'text-emerald-600' : order.paymentStatus === 'Pembayaran ditolak' ? 'text-rose-600' : 'text-amber-600'}>{order.paymentStatus || 'Menunggu konfirmasi pembayaran'}</strong></p>
            <div className="mt-7 space-y-5">
              {order.timeline.map((step) => <div key={step.label} className="flex items-center gap-3 text-sm"><span className={`w-3 h-3 rounded-full ${step.complete ? 'bg-emerald-500' : 'bg-neutral-200'}`} /><span className={step.complete ? 'font-bold text-neutral-950' : 'text-neutral-400'}>{step.label}</span></div>)}
            </div>
            <p className="text-xs text-neutral-500 mt-8">Total: <strong className="text-neutral-950">{BRAND_CONFIG.formatPrice(order.total)}</strong></p>
          </section>
        )}
      </main>
    </div>
  );
}
