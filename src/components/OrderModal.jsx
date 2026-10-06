import React, { useEffect, useState } from 'react';
import { Check, Mail, MapPin, Phone, Upload, User, X } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { orderService } from '../services/orderService';

function getQrCodeFilename(qrCode) {
  const imageType = qrCode.match(/^data:image\/([^;]+)/i)?.[1]?.toLowerCase();
  const extension = imageType === 'jpeg' ? 'jpg' : imageType || 'png';
  return `QRIS-ElevenCrowd.${extension}`;
}

export function OrderModal({ isOpen, items, onClose, onOrderCreated, member }) {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [trackingId, setTrackingId] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;
    setErrorMessage('');
    orderService.getPaymentMethods().then((methods) => {
      if (!isCurrent) return;
      setPaymentMethods(methods);
      setPaymentMethodId(methods[0]?.id || '');
    }).catch((error) => {
      if (isCurrent) setErrorMessage(error.message || 'Gagal memuat metode pembayaran.');
    });

    return () => {
      isCurrent = false;
    };
  }, [isOpen]);

  if (!isOpen || items.length === 0) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProofUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0 && paymentProofs.length === 0) {
      setErrorMessage('Foto bukti transfer wajib diunggah.');
      return;
    }
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setErrorMessage('Bukti transfer harus berupa file gambar.');
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setErrorMessage('Ukuran setiap foto maksimal 5MB.');
      return;
    }
    Promise.all(files.slice(0, 4).map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const maxDimension = 1200;
          const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.65));
        };
        image.onerror = reject;
        image.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then((images) => {
      setPaymentProofs((current) => [...current, ...images].slice(0, 4));
      setErrorMessage('');
    }).catch(() => setErrorMessage('Gagal membaca foto bukti transfer.'));
    event.target.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setErrorMessage('Nama, email, nomor WhatsApp, dan alamat wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentMethod = paymentMethods.find((method) => method.id === paymentMethodId);
      if (!paymentMethod || (!paymentMethod.accountNumber && !paymentMethod.qrCode)) {
        setErrorMessage('Metode pembayaran belum dikonfigurasi admin.');
        return;
      }
      if (paymentProofs.length < 1) {
        setErrorMessage('Foto bukti transfer wajib diunggah.');
        return;
      }
      const order = await orderService.create({ customer, items, paymentMethod, paymentProofs, member });
      setTrackingId(order.trackingId);
      onOrderCreated?.(order);
    } catch (error) {
      setErrorMessage(error.message || 'Pesanan gagal dibuat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-neutral-950" aria-label="Tutup form order">
          <X className="w-5 h-5" />
        </button>

        {trackingId ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-5 border border-emerald-500 text-emerald-600 flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Order confirmed</p>
            <h2 className="font-heading text-4xl text-neutral-950 mt-2">PESANAN DITERIMA</h2>
            <p className="text-sm text-neutral-600 mt-4">Simpan ID berikut untuk memantau pesanan Anda.</p>
            <div className="my-6 border-y border-neutral-300 py-4 font-mono text-xl tracking-[0.16em] text-neutral-950">{trackingId}</div>
            <p className="text-xs text-neutral-500 mb-7">Email konfirmasi akan dikirim ke {customer.email} setelah layanan email diaktifkan.</p>
            <button onClick={onClose} className="bg-neutral-950 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800">Selesai</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-9">
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Checkout / Customer details</p>
            <h2 className="font-heading text-4xl text-neutral-950 mt-2">SELESAIKAN PESANAN</h2>
            <p className="text-sm text-neutral-600 mt-3 max-w-lg">Isi data pengiriman. Setelah pesanan dibuat, Anda menerima ID tracking untuk memantau statusnya.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Nama
                <span className="relative block mt-1.5"><User className="absolute left-3 top-3 w-4 h-4 text-neutral-400" /><input required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="w-full border border-neutral-300 pl-10 pr-3 py-3 text-sm outline-none focus:border-neutral-950" /></span>
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Email
                <span className="relative block mt-1.5"><Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" /><input required type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className="w-full border border-neutral-300 pl-10 pr-3 py-3 text-sm outline-none focus:border-neutral-950" /></span>
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Nomor WhatsApp
                <span className="relative block mt-1.5"><Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" /><input required type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className="w-full border border-neutral-300 pl-10 pr-3 py-3 text-sm outline-none focus:border-neutral-950" /></span>
              </label>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-700">Total
                <p className="font-heading text-2xl text-neutral-950 mt-2">{BRAND_CONFIG.formatPrice(total)}</p>
              </div>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mt-5">Alamat lengkap
              <span className="relative block mt-1.5"><MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" /><textarea required rows="3" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className="w-full border border-neutral-300 pl-10 pr-3 py-3 text-sm outline-none focus:border-neutral-950 resize-none" /></span>
            </label>

            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">Pilihan pembayaran</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <div key={method.id} className={`border p-3 ${paymentMethodId === method.id ? 'border-neutral-950 bg-neutral-50' : 'border-neutral-300'}`}>
                    <label className="block cursor-pointer">
                      <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethodId === method.id} onChange={() => setPaymentMethodId(method.id)} className="sr-only" />
                      <span className="block text-xs font-bold">{method.label} / {method.provider}</span>
                      <span className="block text-xs text-neutral-500 mt-1">{method.accountNumber || 'QRIS / transfer'}</span>
                      <span className="block text-[11px] text-neutral-500">a.n. {method.accountName || 'ElevenCrowd.co'}</span>
                    </label>
                    {method.qrCode && (
                      <a
                        href={method.qrCode}
                        download={getQrCodeFilename(method.qrCode)}
                        className="mt-3 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950"
                        aria-label="Unduh foto QRIS"
                      >
                        <img src={method.qrCode} alt={`QRIS ${method.label}`} className="w-24 h-24 object-contain border border-neutral-200 bg-white" />
                        <span>Klik foto untuk simpan QRIS</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
              {paymentMethods.length === 0 && <p className="text-sm text-rose-600">Metode pembayaran belum tersedia.</p>}
            </div>

            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">Bukti transfer</label>
              <label className="flex items-center justify-center gap-2 border border-dashed border-neutral-400 px-4 py-4 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-50">
                <Upload className="w-4 h-4" /> Pilih foto bukti transfer
                <input type="file" accept="image/*" multiple onChange={handleProofUpload} className="sr-only" />
              </label>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {paymentProofs.map((image, index) => <div key={`${image.slice(0, 20)}-${index}`} className="aspect-square border border-neutral-200 overflow-hidden"><img src={image} alt={`Bukti transfer ${index + 1}`} className="w-full h-full object-cover" /></div>)}
              </div>
            </div>

            {errorMessage && <p className="mt-4 text-sm text-rose-600">{errorMessage}</p>}
            <button disabled={isSubmitting} className="w-full mt-6 bg-neutral-950 text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50">
              {isSubmitting ? 'Menyimpan pesanan...' : 'Buat pesanan & dapatkan ID tracking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
