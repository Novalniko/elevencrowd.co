import { INITIAL_PRODUCTS } from '../data/products.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const STORAGE_KEY = 'elevencrowd_products';
const UPDATE_EVENT_NAME = 'elevencrowd:catalog_updated';

function getDefaultVariantOptions(category) {
  if (category === 'T-Shirt' || category === 'Oversized') {
    return ['Lengan Pendek', 'Lengan Panjang'];
  }
  if (category === 'Jacket') {
    return ['Jaket Pendek', 'Jaket Panjang'];
  }
  return [];
}

/**
 * Migration helper to ensure every merchandise item has all required fields
 * (especially `stock` and `status` if coming from legacy data).
 */
function migrateProduct(item) {
  if (!item || typeof item !== 'object') return null;

  return {
    id: item.id || `ec-legacy-${Math.random().toString(36).substring(2, 9)}`,
    name: item.name || 'Untitled Merchandise',
    category: item.category || 'T-Shirt',
    price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0,
    stock: typeof item.stock === 'number' && !isNaN(item.stock) ? item.stock : 25,
    status: item.status || (item.stock === 0 ? 'Habis' : 'Tersedia'),
    badge: item.badge || '',
    image: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    images: Array.isArray(item.images) && item.images.length > 0
      ? item.images.slice(0, 4)
      : [item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'],
    sizes: Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes : ['S', 'M', 'L', 'XL'],
    specs: {
      ...(item.specs || {}),
      material: item.specs?.material || 'Cotton Combed 24s Premium Heavyweight',
      fit: item.specs?.fit || 'Standard Streetwear Cut',
      color: item.specs?.color || 'Standard',
      variantOptions: Array.isArray(item.specs?.variantOptions) && item.specs.variantOptions.length > 0
        ? item.specs.variantOptions
        : getDefaultVariantOptions(item.category)
    },
    description: item.description || '',
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString()
  };
}

/**
 * Broadcast update event for reactive synchronization across components
 */
function notifyCatalogChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  }
}

/**
 * Validates catalog input data.
 * Returns { isValid: boolean, errors: Record<string, string> }
 */
export function validateCatalog(data) {
  const errors = {};

  // 1. Nama merchandise
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.name = 'Nama merchandise tidak boleh kosong.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Nama merchandise minimal 3 karakter.';
  }

  // 2. Kategori
  if (!data.category || typeof data.category !== 'string' || !data.category.trim()) {
    errors.category = 'Kategori wajib dipilih.';
  }

  // 3. Harga
  const numericPrice = Number(data.price);
  if (data.price === '' || data.price === null || data.price === undefined || isNaN(numericPrice)) {
    errors.price = 'Harga harus berupa angka.';
  } else if (numericPrice <= 0) {
    errors.price = 'Harga harus lebih besar dari 0.';
  }

  // 4. Stok
  const numericStock = Number(data.stock);
  if (data.stock === '' || data.stock === null || data.stock === undefined || isNaN(numericStock)) {
    errors.stock = 'Stok harus berupa angka.';
  } else if (numericStock < 0) {
    errors.stock = 'Stok tidak boleh bernilai negatif.';
  }

  // 5. Status
  const validStatuses = ['Tersedia', 'Habis', 'Pre-Order'];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.status = 'Status wajib dipilih (Tersedia, Habis, atau Pre-Order).';
  }

  // 6. Warna
  if (!data.color || typeof data.color !== 'string' || !data.color.trim()) {
    errors.color = 'Warna produk wajib diisi.';
  }

  // 7. Gambar
  if (!data.image || typeof data.image !== 'string' || !data.image.trim()) {
    errors.image = 'Foto/gambar merchandise wajib diisi atau diunggah.';
  } else if (!data.image.startsWith('http') && !data.image.startsWith('data:image/') && !data.image.startsWith('/')) {
    errors.image = 'Format URL gambar atau file tidak valid.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export const catalogService = {
  EVENT_NAME: UPDATE_EVENT_NAME,

  /**
   * Fetch all products from storage with fallback and migration
   */
  getRawList: async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((item) => migrateProduct(item)).filter(Boolean);
        }
      } catch (e) {
        console.error('[catalogService] Supabase read failed, fallback to local storage:', e);
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map(migrateProduct).filter(Boolean);
          return migrated;
        }
      }
    } catch (e) {
      console.error('[catalogService] Error reading storage:', e);
    }
    // Return initial products migrated
    return INITIAL_PRODUCTS.map(migrateProduct);
  },

  /**
   * Query catalog items with filtering, search, sorting, and pagination
   */
  getAll: async ({
    search = '',
    category = 'all',
    status = 'all',
    sortBy = 'newest',
    page = 1,
    limit = 8
  } = {}) => {
    const list = await catalogService.getRawList();

    // 1. Filter
    let filtered = list.filter((item) => {
      // Category filter
      if (category !== 'all' && item.category !== category) return false;

      // Status filter
      if (status !== 'all' && item.status !== status) return false;

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchCategory = item.category.toLowerCase().includes(query);
        const matchDesc = item.description && item.description.toLowerCase().includes(query);
        const matchId = item.id.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchDesc && !matchId) return false;
      }

      return true;
    });

    // 2. Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'stock-low') return a.stock - b.stock;
      if (sortBy === 'stock-high') return b.stock - a.stock;
      if (sortBy === 'oldest') return (new Date(a.createdAt || 0)) - (new Date(b.createdAt || 0));
      // Default: newest
      return (new Date(b.createdAt || 0)) - (new Date(a.createdAt || 0));
    });

    // 3. Stats Calculation across entire database
    const totalCount = list.length;
    const totalStock = list.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
    const totalAssetValue = list.reduce((acc, curr) => acc + ((Number(curr.price) || 0) * (Number(curr.stock) || 0)), 0);
    const uniqueCategories = Array.from(new Set(list.map((i) => i.category))).length;
    const activeCount = list.filter((i) => i.status === 'Tersedia').length;
    const outOfStockCount = list.filter((i) => i.status === 'Habis' || i.stock === 0).length;

    // 4. Pagination
    const totalFiltered = filtered.length;
    const safeLimit = Math.max(1, limit);
    const totalPages = Math.max(1, Math.ceil(totalFiltered / safeLimit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * safeLimit;
    const paginatedItems = filtered.slice(startIndex, startIndex + safeLimit);

    return {
      data: paginatedItems,
      total: totalFiltered,
      page: safePage,
      totalPages,
      limit: safeLimit,
      summary: {
        totalProducts: totalCount,
        totalStock,
        totalAssetValue,
        totalCategories: uniqueCategories,
        activeProducts: activeCount,
        outOfStockProducts: outOfStockCount
      }
    };
  },

  /**
   * Get single merchandise by ID
   */
  getById: async (id) => {
    const list = await catalogService.getRawList();
    const item = list.find((p) => p.id === id);
    if (!item) {
      throw new Error(`Merchandise dengan ID "${id}" tidak ditemukan.`);
    }
    return item;
  },

  /**
   * Create new merchandise item
   */
  create: async (data) => {
    const validation = validateCatalog(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      const error = new Error(firstError);
      error.validationErrors = validation.errors;
      throw error;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        name: data.name.trim(),
        category: data.category.trim(),
        price: Number(data.price),
        stock: Number(data.stock),
        status: data.status,
        badge: data.badge ? data.badge.trim() : '',
        image: data.image.trim(),
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images.slice(0, 4) : [data.image.trim()],
        sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['All Size'],
        specs: {
          material: (data.specs?.material || data.material || 'Cotton Combed 24s Heavyweight').trim(),
          fit: (data.specs?.fit || data.fit || 'Standard Streetwear Cut').trim(),
          color: (data.specs?.color || data.color || 'Standard Edition').trim(),
          variantOptions: Array.isArray(data.variantOptions) ? data.variantOptions : []
        },
        description: (data.description || `Koleksi eksklusif ${data.name} dari ElevenCrowd.co`).trim()
      };

      const { data: created, error } = await supabase.from('products').insert([payload]).select().single();
      if (!error && created) {
        notifyCatalogChange();
        return migrateProduct(created);
      }
      console.error('[catalogService] Supabase create failed:', error);
    }

    const list = await catalogService.getRawList();

    const timestamp = Date.now();
    const cleanNameSlug = (data.name || 'item')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .substring(0, 15);

    const newId = `ec-${cleanNameSlug}-${timestamp.toString().slice(-4)}`;

    const newProduct = {
      id: newId,
      name: data.name.trim(),
      category: data.category.trim(),
      price: Number(data.price),
      stock: Number(data.stock),
      status: data.status,
      badge: data.badge ? data.badge.trim() : '',
      image: data.image.trim(),
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images.slice(0, 4) : [data.image.trim()],
      sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['All Size'],
      specs: {
        material: (data.specs?.material || data.material || 'Cotton Combed 24s Heavyweight').trim(),
        fit: (data.specs?.fit || data.fit || (data.category === 'Oversized' ? 'Drop Shoulder Boxy Cut' : 'Standard Streetwear Cut')).trim(),
        color: (data.specs?.color || data.color || 'Standard Edition').trim(),
        variantOptions: Array.isArray(data.variantOptions) ? data.variantOptions : []
      },
      description: (data.description || `Koleksi eksklusif ${data.name} dari ElevenCrowd.co`).trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedList = [newProduct, ...list];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      notifyCatalogChange();
    } catch (e) {
      console.error('[catalogService] Error saving to storage:', e);
      throw new Error('Gagal menyimpan ke penyimpanan lokal browser. Kapasitas mungkin penuh.');
    }

    return newProduct;
  },

  /**
   * Update existing merchandise item
   */
  update: async (id, data) => {
    const validation = validateCatalog(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      const error = new Error(firstError);
      error.validationErrors = validation.errors;
      throw error;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        name: data.name.trim(),
        category: data.category.trim(),
        price: Number(data.price),
        stock: Number(data.stock),
        status: data.status,
        badge: data.badge !== undefined ? data.badge.trim() : '',
        image: data.image.trim(),
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images.slice(0, 4) : [data.image.trim()],
        sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['All Size'],
        specs: {
          material: (data.specs?.material || data.material || 'Cotton Combed 24s Heavyweight').trim(),
          fit: (data.specs?.fit || data.fit || 'Standard Streetwear Cut').trim(),
          color: (data.specs?.color || data.color || 'Standard Edition').trim(),
          variantOptions: Array.isArray(data.variantOptions) ? data.variantOptions : []
        },
        description: (data.description !== undefined ? data.description : '').trim(),
        updated_at: new Date().toISOString()
      };

      const { data: updated, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
      if (!error && updated) {
        notifyCatalogChange();
        return migrateProduct(updated);
      }
      console.error('[catalogService] Supabase update failed:', error);
    }

    const list = await catalogService.getRawList();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Merchandise dengan ID "${id}" tidak ditemukan untuk diperbarui.`);
    }

    const oldItem = list[index];
    const updatedProduct = {
      ...oldItem,
      name: data.name.trim(),
      category: data.category.trim(),
      price: Number(data.price),
      stock: Number(data.stock),
      status: data.status,
      badge: data.badge !== undefined ? data.badge.trim() : oldItem.badge,
      image: data.image.trim() || oldItem.image,
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images.slice(0, 4)
        : (oldItem.images || [data.image.trim() || oldItem.image]),
      sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : oldItem.sizes,
      specs: {
        ...oldItem.specs,
        material: (data.specs?.material || data.material || oldItem.specs?.material || 'Cotton Combed 24s').trim(),
        fit: (data.specs?.fit || data.fit || oldItem.specs?.fit || (data.category === 'Oversized' ? 'Drop Shoulder Boxy Cut' : 'Standard Cut')).trim(),
        color: (data.specs?.color || data.color || oldItem.specs?.color || 'Clean').trim(),
        variantOptions: Array.isArray(data.variantOptions) ? data.variantOptions : (oldItem.specs?.variantOptions || [])
      },
      description: (data.description !== undefined ? data.description : oldItem.description).trim(),
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedProduct;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      notifyCatalogChange();
    } catch (e) {
      console.error('[catalogService] Error updating storage:', e);
      throw new Error('Gagal memperbarui data di penyimpanan browser.');
    }

    return updatedProduct;
  },

  /**
   * Delete merchandise item by ID
   */
  delete: async (id) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        notifyCatalogChange();
        return { id };
      }
      console.error('[catalogService] Supabase delete failed:', error);
    }

    const list = await catalogService.getRawList();
    const itemToDelete = list.find((p) => p.id === id);
    if (!itemToDelete) {
      throw new Error(`Merchandise dengan ID "${id}" tidak ditemukan.`);
    }

    const filtered = list.filter((p) => p.id !== id);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      notifyCatalogChange();
    } catch (e) {
      console.error('[catalogService] Error deleting from storage:', e);
      throw new Error('Gagal menghapus data dari penyimpanan browser.');
    }

    return itemToDelete;
  },

  deleteMany: async (ids) => {
    const selectedIds = new Set(ids);
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().in('id', [...selectedIds]);
      if (!error) {
        notifyCatalogChange();
        return [...selectedIds];
      }
      console.error('[catalogService] Supabase deleteMany failed:', error);
    }

    const list = await catalogService.getRawList();
    const deletedItems = list.filter((product) => selectedIds.has(product.id));
    if (deletedItems.length === 0) {
      throw new Error('Tidak ada merchandise yang dipilih untuk dihapus.');
    }

    const filtered = list.filter((product) => !selectedIds.has(product.id));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      notifyCatalogChange();
    } catch (e) {
      console.error('[catalogService] Error deleting multiple items:', e);
      throw new Error('Gagal menghapus merchandise dari penyimpanan browser.');
    }

    return deletedItems;
  },

  /**
   * Reset data to initial seed products
   */
  resetDefaults: () => {
    try {
      const migrated = INITIAL_PRODUCTS.map(migrateProduct);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      notifyCatalogChange();
      return migrated;
    } catch (e) {
      console.error('[catalogService] Error resetting storage:', e);
      throw new Error('Gagal mereset data produk.');
    }
  }
};
