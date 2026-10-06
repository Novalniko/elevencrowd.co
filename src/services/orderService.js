import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const ORDERS_STORAGE_KEY = 'elevencrowd_orders';
const PAYMENT_STORAGE_KEY = 'elevencrowd_payment_methods';
const PAYMENT_SETTINGS_ID = 'checkout';
const DEFAULT_PAYMENT_METHODS = [
  { id: 'bank-transfer', label: 'Transfer Bank', provider: 'BCA', accountNumber: '', accountName: 'ElevenCrowd.co', enabled: true },
  { id: 'e-wallet', label: 'E-Wallet', provider: 'DANA / GoPay', accountNumber: '', accountName: 'ElevenCrowd.co', enabled: true },
  { id: 'qris', label: 'QRIS', provider: 'QRIS', accountNumber: '', accountName: 'ElevenCrowd.co', qrCode: '', enabled: true }
];

function normalizePaymentMethods(methods) {
  const savedQrCode = methods.find((method) => method.id === 'qris')?.qrCode
    || methods.find((method) => method.qrCode)?.qrCode
    || '';
  const cleanedMethods = methods
    .filter((method) => method.id !== 'qris')
    .map(({ qrCode, ...method }) => method);

  return [
    ...cleanedMethods,
    {
      ...DEFAULT_PAYMENT_METHODS.find((method) => method.id === 'qris'),
      qrCode: savedQrCode
    }
  ];
}

function readOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    const orders = saved ? JSON.parse(saved) : [];
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error('[orderService] Error reading orders:', error);
    return [];
  }
}

function createTrackingId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const token = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `EC-${date}-${token}`;
}

function readLocalPaymentMethods() {
  try {
    const saved = localStorage.getItem(PAYMENT_STORAGE_KEY);
    const methods = saved ? JSON.parse(saved) : DEFAULT_PAYMENT_METHODS;
    return Array.isArray(methods) ? normalizePaymentMethods(methods) : DEFAULT_PAYMENT_METHODS;
  } catch (error) {
    console.error('[orderService] Error reading payment methods:', error);
    return DEFAULT_PAYMENT_METHODS;
  }
}

async function readPaymentMethods() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('store_settings')
      .select('payment_methods')
      .eq('id', PAYMENT_SETTINGS_ID)
      .maybeSingle();

    if (error) {
      console.error('[orderService] Error reading shared payment methods:', error);
      throw new Error('Gagal memuat pembayaran bersama. Pastikan tabel store_settings sudah dibuat di Supabase.');
    }

    return Array.isArray(data?.payment_methods) ? normalizePaymentMethods(data.payment_methods) : [];
  }

  return readLocalPaymentMethods();
}

function writeOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    if (error?.name !== 'QuotaExceededError') throw error;
    const compactOrders = orders.slice(0, 5).map((order, index) => index === 0
      ? order
      : { ...order, paymentProofs: [] });
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(compactOrders));
    } catch (compactError) {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([orders[0]]));
    }
  }
}

export const orderService = {
  getPaymentMethods: async () => (await readPaymentMethods()).filter((method) => method.enabled),

  savePaymentMethods: async (methods) => {
    const cleaned = normalizePaymentMethods(methods).map((method) => ({
      ...method,
      provider: (method.provider || '').trim(),
      accountNumber: (method.accountNumber || '').trim(),
      accountName: (method.accountName || '').trim(),
      qrCode: (method.qrCode || '').trim()
    }));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('store_settings').upsert({
        id: PAYMENT_SETTINGS_ID,
        payment_methods: cleaned,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('[orderService] Error saving shared payment methods:', error);
        throw new Error('Gagal menyimpan pembayaran bersama. Periksa koneksi dan izin tabel Supabase.');
      }
    } else {
      localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(cleaned));
    }

    return cleaned;
  },

  getOrders: () => readOrders(),

  getMemberOrders: (member) => {
    if (!member?.id || !member?.email) return [];
    const email = member.email.trim().toLowerCase();
    return readOrders()
      .filter((order) => order.memberId === member.id || order.customer?.email?.trim().toLowerCase() === email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  updateStatus: (trackingId, status) => {
    const orders = readOrders();
    const index = orders.findIndex((order) => order.trackingId === trackingId);
    if (index === -1) throw new Error('Pesanan tidak ditemukan.');
    const order = orders[index];
    const statusIndex = order.timeline.findIndex((step) => step.label === status);
    order.status = status;
    order.timeline = order.timeline.map((step, currentIndex) => ({
      ...step,
      complete: currentIndex <= statusIndex,
      date: currentIndex <= statusIndex ? (step.date || new Date().toISOString()) : null
    }));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return order;
  },

  updatePaymentStatus: (trackingId, paymentStatus) => {
    const orders = readOrders();
    const index = orders.findIndex((order) => order.trackingId === trackingId);
    if (index === -1) throw new Error('Pesanan tidak ditemukan.');
    orders[index].paymentStatus = paymentStatus;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return orders[index];
  },

  create: async ({ customer, items, paymentMethod, paymentProofs = [], member }) => {
    const order = {
      id: `order-${Date.now()}`,
      trackingId: createTrackingId(),
      orderLabel: `ORDER-${Date.now().toString().slice(-6)}`,
      memberId: member?.id || null,
      memberEmail: member?.email || customer.email,
      customer,
      items,
      paymentMethod,
      paymentStatus: 'Menunggu konfirmasi pembayaran',
      paymentProofs,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Pesanan diterima',
      createdAt: new Date().toISOString(),
      timeline: [
        { label: 'Pesanan diterima', date: new Date().toISOString(), complete: true },
        { label: 'Sedang diproses', date: null, complete: false },
        { label: 'Dikirim', date: null, complete: false },
        { label: 'Selesai', date: null, complete: false }
      ]
    };

    const orders = readOrders();
    writeOrders([order, ...orders]);
    return order;
  },

  getByTrackingId: (trackingId) => {
    const normalizedId = (trackingId || '').trim().toUpperCase();
    return readOrders().find((order) => order.trackingId === normalizedId) || null;
  }
};
