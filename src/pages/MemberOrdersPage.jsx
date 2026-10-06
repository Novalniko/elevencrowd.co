import React, { useMemo } from 'react';
import { ArrowLeft, LogOut, PackageCheck } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { orderService } from '../services/orderService';

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Tanggal tidak tersedia'
    : new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(date);
}

export function MemberOrdersPage({ member, onNavigateToStore, onLogout }) {
  const orders = useMemo(() => orderService.getMemberOrders(member), [member]);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-neutral-900 font-body">
      <header className="border-b border-[#d7d7d2] px-4 sm:px-8 py-5 flex items-center justify-between gap-4">
        <button onClick={onNavigateToStore} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-neutral-500">
          <ArrowLeft className="w-4 h-4" /> Kembali ke toko
        </button>
        <button onClick={onLogout} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Member / {member.name}</p>
        <h1 className="font-heading text-5xl sm:text-7xl leading-none mt-2">RIWAYAT PESANAN</h1>
        <p className="text-sm text-neutral-600 mt-4">Lihat pesanan yang dibuat menggunakan akun {member.email}.</p>

        {orders.length === 0 ? (
          <section className="mt-10 bg-white border border-neutral-200 p-8 sm:p-12 text-center">
            <PackageCheck className="w-8 h-8 mx-auto text-neutral-400" />
            <h2 className="font-heading text-2xl mt-4">BELUM ADA PESANAN</h2>
            <p className="text-sm text-neutral-500 mt-2">Pesanan Anda akan muncul di halaman ini setelah checkout.</p>
            <button onClick={onNavigateToStore} className="mt-6 bg-neutral-950 text-white px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800">
              Belanja sekarang
            </button>
          </section>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="bg-white border border-neutral-200 p-5 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-neutral-200 pb-4">
                  <div>
                    <p className="font-mono text-sm font-bold">{order.trackingId}</p>
                    <p className="text-xs text-neutral-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wider">{order.status || 'Pesanan diterima'}</p>
                    <p className={`text-xs mt-1 font-semibold ${order.paymentStatus === 'Pembayaran dikonfirmasi' ? 'text-emerald-700' : order.paymentStatus === 'Pembayaran ditolak' ? 'text-rose-700' : 'text-amber-700'}`}>
                      {order.paymentStatus || 'Menunggu konfirmasi pembayaran'}
                    </p>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  {(order.items || []).map((item, index) => (
                    <div key={`${item.id || item.name}-${item.size || ''}-${index}`} className="flex justify-between gap-4 text-sm">
                      <span className="text-neutral-700">
                        {item.name}{item.size ? ` / ${item.size}` : ''}{item.color ? ` / ${item.color}` : ''} × {item.quantity}
                      </span>
                      <span className="shrink-0 text-neutral-500">{BRAND_CONFIG.formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 flex justify-between items-center gap-4">
                  <span className="text-xs text-neutral-500">Total pesanan</span>
                  <strong className="text-sm">{BRAND_CONFIG.formatPrice(order.total)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
