import React, { useEffect, useState } from 'react';
import { Check, Printer, Save, Truck, Upload } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { isSupabaseConfigured } from '../lib/supabase';
import { orderService } from '../services/orderService';

const TRACKING_STATUSES = ['Pesanan diterima', 'Sedang diproses', 'Dikirim', 'Selesai'];

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewOrder, setPreviewOrder] = useState(null);

  const loadData = async () => {
    setOrders(orderService.getOrders());
    try {
      const methods = await orderService.getPaymentMethods();
      setPaymentMethods(methods.length > 0 ? methods : [
        { id: 'bank-transfer', label: 'Transfer Bank', provider: 'BCA', accountNumber: '', accountName: BRAND_CONFIG.name, enabled: true },
        { id: 'e-wallet', label: 'E-Wallet', provider: 'DANA / GoPay', accountNumber: '', accountName: BRAND_CONFIG.name, enabled: true },
        { id: 'qris', label: 'QRIS', provider: 'QRIS', accountNumber: '', accountName: BRAND_CONFIG.name, qrCode: '', enabled: true }
      ]);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat pengaturan pembayaran.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updatePaymentMethod = (id, field, value) => {
    setPaymentMethods((current) => current.map((method) => method.id === id ? { ...method, [field]: value } : method));
  };

  const handleQrUpload = (methodId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Foto QRIS harus berupa file gambar.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Ukuran foto QRIS maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentMethods((current) => current.map((method) => method.id === methodId ? { ...method, qrCode: String(reader.result || '') } : method));
      setErrorMessage('');
    };
    reader.onerror = () => setErrorMessage('Gagal membaca foto QRIS.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const savePayments = async () => {
    setErrorMessage('');
    try {
      await orderService.savePaymentMethods(paymentMethods);
      setMessage('Nomor pembayaran berhasil disimpan.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal menyimpan pengaturan pembayaran.');
    }
  };

  const updateOrderStatus = (trackingId, status) => {
    orderService.updateStatus(trackingId, status);
    loadData();
    setMessage(`Status ${trackingId} berhasil diperbarui.`);
    setTimeout(() => setMessage(''), 3000);
  };

  const updatePaymentStatus = (trackingId, paymentStatus) => {
    orderService.updatePaymentStatus(trackingId, paymentStatus);
    loadData();
    setMessage(`Pembayaran ${trackingId} diperbarui.`);
    setTimeout(() => setMessage(''), 3000);
  };

  const printShippingLabel = (order) => {
    const printWindow = window.open('', '_blank', 'width=720,height=900');
    if (!printWindow) return;
    const items = order.items.map((item) => `<li>${escapeHtml(item.name)} - Size: ${escapeHtml(item.size)}${item.color ? ` - Warna: ${escapeHtml(item.color)}` : ''}${item.variantOption ? ` - Pilihan: ${escapeHtml(item.variantOption)}` : ''} - ${item.quantity} pcs</li>`).join('');
    printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(order.orderLabel || order.trackingId)}</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#111}h1{font-size:24px;margin:0 0 8px}.label{border:2px solid #111;padding:24px;max-width:560px}.meta{border-top:1px solid #ccc;margin-top:18px;padding-top:14px;font-size:14px;line-height:1.6}.code{font-family:monospace;font-size:20px;font-weight:bold;letter-spacing:2px;margin:14px 0}ul{padding-left:20px}@media print{body{padding:0}.label{max-width:none}}</style></head><body><div class="label"><h1>${escapeHtml(BRAND_CONFIG.name)}</h1><div class="code">${escapeHtml(order.orderLabel || `ORDER-${order.trackingId}`)}</div><div class="meta"><strong>TRACKING:</strong> ${escapeHtml(order.trackingId)}<br><strong>PENERIMA:</strong> ${escapeHtml(order.customer.name)}<br><strong>WHATSAPP PENERIMA:</strong> ${escapeHtml(order.customer.phone)}<br><strong>ALAMAT:</strong> ${escapeHtml(order.customer.address)}<br><strong>PEMBAYARAN:</strong> ${escapeHtml(order.paymentStatus || 'Menunggu konfirmasi')}</div><div class="meta"><strong>PENGIRIM:</strong> ${escapeHtml(BRAND_CONFIG.name)}<br><strong>WHATSAPP TOKO:</strong> ${escapeHtml(BRAND_CONFIG.whatsappDisplay)}</div><div class="meta"><strong>ITEM:</strong><ul>${items}</ul></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <section className="space-y-6 mt-8">
      {message && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm"><Check className="w-4 h-4" />{message}</div>}
      {errorMessage && <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm">{errorMessage}</div>}

      <div className="bg-white border border-neutral-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-5"><Printer className="w-5 h-5 text-neutral-950" /><div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Shipping labels</p><h2 className="font-heading text-2xl text-neutral-950 mt-1">LABEL PEMESANAN</h2></div></div>
        {orders.length === 0 ? <p className="text-sm text-neutral-500">Belum ada label order.</p> : <div className="space-y-2">{orders.map((order) => <div key={`label-${order.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-200 pt-3"><div><p className="font-mono text-sm font-bold">{order.orderLabel || `ORDER-${order.trackingId}`}</p><p className="text-xs text-neutral-500">Tracking: {order.trackingId} · {order.customer.name}</p></div><button onClick={() => setPreviewOrder(order)} className="inline-flex items-center justify-center gap-2 border border-neutral-900 px-3 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-950 hover:text-white"><Printer className="w-3.5 h-3.5" /> Preview Label</button></div>)}</div>}
      </div>

      <div className="bg-white border border-neutral-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Checkout / Payment</p><h2 className="font-heading text-2xl text-neutral-950 mt-1">NOMOR PEMBAYARAN</h2><p className="text-xs text-neutral-500 mt-1">Nomor ini akan tampil pada form checkout pembeli.</p></div>
          <button onClick={savePayments} className="inline-flex items-center gap-2 bg-neutral-950 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"><Save className="w-4 h-4" /> Simpan</button>
        </div>
        {!isSupabaseConfigured && <p className="mt-4 text-xs text-amber-700">Supabase belum dikonfigurasi. Nomor pembayaran hanya tersimpan di browser admin ini dan tidak tersedia bagi pelanggan di perangkat lain.</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {paymentMethods.filter((method) => method.id !== 'qris').map((method) => (
            <div key={method.id} className="border border-neutral-200 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-[11px] font-bold uppercase tracking-wider">Label<input value={method.label} onChange={(e) => updatePaymentMethod(method.id, 'label', e.target.value)} className="w-full border border-neutral-300 px-3 py-2 mt-1 text-sm font-normal outline-none focus:border-neutral-950" /></label>
                <label className="text-[11px] font-bold uppercase tracking-wider">Provider<input value={method.provider} onChange={(e) => updatePaymentMethod(method.id, 'provider', e.target.value)} className="w-full border border-neutral-300 px-3 py-2 mt-1 text-sm font-normal outline-none focus:border-neutral-950" /></label>
              </div>
              <label className="block text-[11px] font-bold uppercase tracking-wider">Nomor rekening / e-wallet<input value={method.accountNumber} onChange={(e) => updatePaymentMethod(method.id, 'accountNumber', e.target.value)} placeholder="Masukkan nomor pembayaran" className="w-full border border-neutral-300 px-3 py-2 mt-1 text-sm font-normal outline-none focus:border-neutral-950" /></label>
              <label className="block text-[11px] font-bold uppercase tracking-wider">Nama pemilik<input value={method.accountName} onChange={(e) => updatePaymentMethod(method.id, 'accountName', e.target.value)} className="w-full border border-neutral-300 px-3 py-2 mt-1 text-sm font-normal outline-none focus:border-neutral-950" /></label>
            </div>
          ))}
        </div>
        <div className="mt-5 border border-neutral-200 p-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Pembayaran QRIS</p>
            <h3 className="font-heading text-xl text-neutral-950 mt-1">SATU FOTO QRIS</h3>
            <p className="text-xs text-neutral-500 mt-1">Foto QRIS ini digunakan bersama dan tampil sebagai satu pilihan di checkout.</p>
          </div>
          {paymentMethods.find((method) => method.id === 'qris')?.qrCode ? (
            <div className="mt-4 flex flex-col items-center gap-3">
              <img src={paymentMethods.find((method) => method.id === 'qris').qrCode} alt="QRIS pembayaran" className="w-40 h-40 object-contain border border-neutral-200 bg-white p-2" />
              <button type="button" onClick={() => updatePaymentMethod('qris', 'qrCode', '')} className="border border-neutral-300 px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-50">Hapus foto QRIS</button>
            </div>
          ) : (
            <label className="mt-4 flex items-center justify-center gap-2 border border-dashed border-neutral-400 px-4 py-5 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-50">
              <Upload className="w-4 h-4" /> Pilih foto QRIS
              <input type="file" accept="image/*" onChange={(event) => handleQrUpload('qris', event)} className="sr-only" />
            </label>
          )}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-5"><Truck className="w-5 h-5 text-neutral-950" /><div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Order management</p><h2 className="font-heading text-2xl text-neutral-950 mt-1">PESANAN & TRACKING</h2></div></div>
        {orders.length === 0 ? <p className="text-sm text-neutral-500 border-t border-neutral-200 pt-5">Belum ada pesanan masuk.</p> : <div className="space-y-4">{orders.map((order) => {
          const paymentStatus = order.paymentStatus || 'Menunggu konfirmasi pembayaran';
          const isPaymentPending = paymentStatus === 'Menunggu konfirmasi pembayaran';
          const paymentStatusColor = paymentStatus === 'Pembayaran dikonfirmasi'
            ? 'text-emerald-700'
            : paymentStatus === 'Pembayaran ditolak'
              ? 'text-rose-700'
              : 'text-amber-700';

          return (
            <div key={order.id} className="border-t border-neutral-200 pt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
              <div>
                <p className="font-mono text-sm font-bold">{order.trackingId}</p>
                <p className="text-sm text-neutral-800 mt-1">{order.customer.name} · {order.customer.email}</p>
                <p className="text-xs text-neutral-500 mt-1">{order.customer.phone} · {BRAND_CONFIG.formatPrice(order.total)}</p>
                <p className="text-xs text-neutral-500 mt-2">Pembayaran: {order.paymentMethod?.provider || 'Belum dipilih'} {order.paymentMethod?.accountNumber || ''}</p>
                <p className={`text-xs font-bold mt-2 ${paymentStatusColor}`}>Status pembayaran: {paymentStatus}</p>
                <div className="flex flex-wrap gap-2 mt-3">{(order.paymentProofs || []).map((image, index) => <a key={`${image.slice(0, 12)}-${index}`} href={image} target="_blank" rel="noreferrer"><img src={image} alt={`Bukti transfer ${index + 1}`} className="w-16 h-16 object-cover border border-neutral-300" /></a>)}</div>
                {isPaymentPending && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => updatePaymentStatus(order.trackingId, 'Pembayaran dikonfirmasi')} className="px-3 py-2 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-700">Konfirmasi pembayaran</button>
                    <button onClick={() => updatePaymentStatus(order.trackingId, 'Pembayaran ditolak')} className="px-3 py-2 bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-rose-700">Tolak</button>
                  </div>
                )}
              </div>
              <label className="text-[11px] font-bold uppercase tracking-wider">Update tracking<select value={order.status} onChange={(e) => updateOrderStatus(order.trackingId, e.target.value)} className="block border border-neutral-300 bg-white px-3 py-2 mt-1 text-sm font-normal outline-none focus:border-neutral-950">{TRACKING_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
            </div>
          );
        })}</div>}
      </div>
      {previewOrder && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 p-5">
              <div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Preview shipping label</p><h3 className="font-heading text-2xl mt-1">{previewOrder.orderLabel || `ORDER-${previewOrder.trackingId}`}</h3></div>
              <button onClick={() => setPreviewOrder(null)} className="text-neutral-500 hover:text-neutral-950" aria-label="Tutup preview">X</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="border-2 border-neutral-950 p-5 space-y-2">
                <p className="font-heading text-2xl">{BRAND_CONFIG.name}</p>
                <p><strong>Label:</strong> {previewOrder.orderLabel || `ORDER-${previewOrder.trackingId}`}</p>
                <p><strong>Tracking:</strong> {previewOrder.trackingId}</p>
                <p><strong>Penerima:</strong> {previewOrder.customer.name}</p>
                <p><strong>WhatsApp Penerima:</strong> {previewOrder.customer.phone}</p>
                <p><strong>Alamat:</strong> {previewOrder.customer.address}</p>
                <div className="border-t border-neutral-300 pt-3 mt-3">
                  <p><strong>Pengirim:</strong> {BRAND_CONFIG.name}</p>
                  <p><strong>WhatsApp Toko:</strong> {BRAND_CONFIG.whatsappDisplay}</p>
                </div>
                <div className="border-t border-neutral-300 pt-3"><strong>Item:</strong>{previewOrder.items.map((item) => <p key={`${item.id}-${item.size}-${item.color || ''}`} className="text-xs mt-1">{item.name} / Size: {item.size}{item.color ? ` / Warna: ${item.color}` : ''}{item.variantOption ? ` / Pilihan: ${item.variantOption}` : ''} / {item.quantity} pcs</p>)}</div>
              </div>
              <div className="flex justify-end gap-2"><button onClick={() => setPreviewOrder(null)} className="border border-neutral-300 px-4 py-2 text-xs font-bold uppercase tracking-wider">Tutup</button><button onClick={() => printShippingLabel(previewOrder)} className="inline-flex items-center gap-2 bg-neutral-950 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"><Printer className="w-4 h-4" /> Cetak / Simpan PDF</button></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
