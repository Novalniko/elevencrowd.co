import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Boxes,
  DollarSign,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
  Copy,
  Check,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { catalogService, validateCatalog } from '../services/catalogService';
import { authService } from '../services/authService';
import { BRAND_CONFIG } from '../data/config';

const CATEGORY_OPTIONS = ['T-Shirt', 'Oversized', 'Hoodie', 'Jacket', 'Aksesoris'];
const STATUS_OPTIONS = ['Tersedia', 'Habis', 'Pre-Order'];
const BADGE_OPTIONS = [
  { value: '', label: 'Tanpa Badge' },
  { value: 'NEW DROP', label: 'NEW DROP' },
  { value: 'BEST SELLER', label: 'BEST SELLER' },
  { value: 'LIMITED', label: 'LIMITED EDITION' }
];

const getVariantConfig = (category) => {
  if (category === 'T-Shirt' || category === 'Oversized') {
    return { label: 'Pilihan Lengan', options: ['Lengan Pendek', 'Lengan Panjang'] };
  }
  if (category === 'Jacket') {
    return { label: 'Pilihan Panjang', options: ['Jaket Pendek', 'Jaket Panjang'] };
  }
  return null;
};

export function AdminPage({ onNavigateToStore, onLogout }) {
  const currentUser = authService.getCurrentUser();

  // Query & Table State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  // Data State
  const [catalogResult, setCatalogResult] = useState({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 8,
    summary: {
      totalProducts: 0,
      totalStock: 0,
      totalAssetValue: 0,
      totalCategories: 0,
      activeProducts: 0,
      outOfStockProducts: 0
    }
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  const [deleteTargets, setDeleteTargets] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAccountSubmitting, setIsAccountSubmitting] = useState(false);
  const [accountForm, setAccountForm] = useState({
    username: currentUser?.username || '',
    currentPassword: '',
    newPassword: ''
  });

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    category: 'T-Shirt',
    price: '',
    stock: '',
    status: 'Tersedia',
    badge: 'NEW DROP',
    image: '',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Cotton Combed 24s Premium Heavyweight',
    fit: 'Standard Streetwear Cut',
    color: '',
    variantOptions: [],
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null); // { type: 'success' | 'error' | 'info', message: '' }
  const toastTimeoutRef = useRef(null);

  const showToast = (type, message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load catalog items from catalogService
  const loadCatalog = async () => {
    try {
      const result = await catalogService.getAll({
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
        sortBy,
        page,
        limit
      });
      setCatalogResult(result);
    } catch (err) {
      console.error('Error fetching catalog:', err);
      showToast('error', 'Gagal memuat katalog merchandise.');
    }
  };

  // Trigger load when filters or pagination change
  useEffect(() => {
    loadCatalog();
  }, [searchQuery, categoryFilter, statusFilter, sortBy, page, limit]);

  // Listen to service catalog update event
  useEffect(() => {
    const handleStorageChange = async () => {
      await loadCatalog();
    };
    window.addEventListener(catalogService.EVENT_NAME, handleStorageChange);
    return () => {
      window.removeEventListener(catalogService.EVENT_NAME, handleStorageChange);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [searchQuery, categoryFilter, statusFilter, sortBy, page, limit]);

  // Open Create Form Modal
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'T-Shirt',
      price: '',
      stock: '25',
      status: 'Tersedia',
      badge: 'NEW DROP',
      image: '',
      images: [],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      material: 'Cotton Combed 24s Premium Heavyweight',
      color: '',
      variantOptions: getVariantConfig('T-Shirt').options,
      description: ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Edit Form Modal
  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setEditingProduct(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'T-Shirt',
      price: item.price !== undefined ? String(item.price) : '',
      stock: item.stock !== undefined ? String(item.stock) : '0',
      status: item.status || 'Tersedia',
      badge: item.badge || '',
      image: item.image || '',
      images: Array.isArray(item.images) ? item.images.slice(0, 4) : (item.image ? [item.image] : []),
      sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
      material: item.specs?.material || 'Cotton Combed 24s',
      fit: item.specs?.fit || 'Standard Streetwear Cut',
      color: item.specs?.color || '',
      variantOptions: Array.isArray(item.specs?.variantOptions) && item.specs.variantOptions.length > 0
        ? item.specs.variantOptions
        : (getVariantConfig(item.category)?.options || []),
      description: item.description || ''
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle Form Input Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'category'
        ? { variantOptions: getVariantConfig(value)?.options || [] }
        : {})
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Toggle Size in Form
  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  // Handle File Upload (Image) with conversion to base64 Data URL
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 4 - formData.images.length;
    if (availableSlots <= 0) {
      showToast('error', 'Maksimal 4 foto produk.');
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      showToast('info', `Hanya ${availableSlots} foto yang ditambahkan karena batas maksimal 4 foto.`);
    }

    const invalidFile = selectedFiles.find((file) => !file.type.startsWith('image/'));
    if (invalidFile) {
      showToast('error', 'Semua file yang diunggah harus berupa gambar.');
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > 2 * 1024 * 1024);
    if (oversizedFile) {
      showToast('error', 'Setiap foto maksimal berukuran 2MB.');
      return;
    }

    Promise.all(selectedFiles.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => resolve(uploadEvent.target?.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then((uploadedImages) => {
      setFormData((prev) => {
        const images = [...prev.images, ...uploadedImages.filter(Boolean)].slice(0, 4);
        return { ...prev, images, image: images[0] || prev.image };
      });
      showToast('info', `${uploadedImages.length} foto berhasil diunggah.`);
    }).catch(() => {
      showToast('error', 'Gagal membaca salah satu file gambar.');
    });
    e.target.value = '';
  };

  const removeUploadedImage = (index) => {
    setFormData((prev) => {
      const images = prev.images.filter((_, imageIndex) => imageIndex !== index);
      return { ...prev, images, image: images[0] || '' };
    });
  };

  // Form Submission (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateCatalog(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      const firstMessage = Object.values(validation.errors)[0];
      showToast('error', firstMessage || 'Mohon lengkapi formulir dengan benar.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (modalMode === 'create') {
        const created = await catalogService.create(formData);
        showToast('success', `Merchandise "${created.name}" berhasil ditambahkan ke katalog!`);
      } else {
        const updated = await catalogService.update(editingProduct.id, formData);
        showToast('success', `Merchandise "${updated.name}" berhasil diperbarui!`);
      }
      setIsFormModalOpen(false);
      loadCatalog();
    } catch (err) {
      console.error('Submit error:', err);
      showToast('error', err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (deleteTargets.length === 0) return;
    setIsDeleting(true);
    try {
      const deletedItems = await catalogService.deleteMany(deleteTargets.map((item) => item.id));
      showToast('success', `${deletedItems.length} merchandise berhasil dihapus.`);
      setDeleteTargets([]);
      setSelectedProductIds([]);
      loadCatalog();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', err.message || 'Gagal menghapus merchandise.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllVisibleSelected = catalogResult.data.length > 0 && catalogResult.data.every((item) => selectedProductIds.includes(item.id));

  const toggleProductSelection = (productId) => {
    setSelectedProductIds((currentIds) => currentIds.includes(productId)
      ? currentIds.filter((id) => id !== productId)
      : [...currentIds, productId]
    );
  };

  const toggleAllVisibleProducts = () => {
    const visibleIds = catalogResult.data.map((item) => item.id);
    setSelectedProductIds((currentIds) => {
      if (visibleIds.every((id) => currentIds.includes(id))) {
        return currentIds.filter((id) => !visibleIds.includes(id));
      }
      return [...new Set([...currentIds, ...visibleIds])];
    });
  };

  const openDeleteConfirmation = (items) => {
    setDeleteTargets(items);
  };

  // Reset to default seeds
  const handleResetDefaults = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh katalog kembali ke data awal ElevenCrowd? Data custom Anda akan terhapus.')) {
      try {
        catalogService.resetDefaults();
        showToast('success', 'Katalog berhasil direset ke data awal default.');
        loadCatalog();
      } catch (err) {
        showToast('error', 'Gagal mereset katalog.');
      }
    }
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    setIsAccountSubmitting(true);
    try {
      await authService.updateCredentials(accountForm);
      setAccountForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      setIsAccountModalOpen(false);
      showToast('success', 'Pengaturan akun berhasil diperbarui.');
    } catch (err) {
      showToast('error', err.message || 'Gagal memperbarui akun.');
    } finally {
      setIsAccountSubmitting(false);
    }
  };


  const { summary } = catalogResult;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-body selection:bg-neutral-950 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-fadeIn max-w-md shadow-2xl">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-neutral-950 text-white border-neutral-800'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-neutral-900 text-white border-neutral-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-200 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />}
            <div className="flex-1 pr-2">
              <p className="font-bold text-xs uppercase tracking-wider mb-0.5">
                {toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Kesalahan' : 'Pemberitahuan'}
              </p>
              <p className="text-xs text-neutral-200 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950 text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand / Admin Identity */}
            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateToStore}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all"
                title="Kembali ke Halaman Welcome"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kembali ke Beranda</span>
              </button>

              <div className="h-5 w-px bg-neutral-800" />

              <div className="flex items-center gap-2.5">
                <img
                  src="/images/el%20pote.png"
                  alt="ElevenCrowd.co"
                  className="h-10 w-auto max-w-[150px] object-contain"
                />
                <span className="bg-white text-neutral-950 font-bold text-[10px] tracking-wider px-2 py-0.5 rounded uppercase">
                  ADMIN DASHBOARD
                </span>
              </div>
            </div>

            {/* Right: Quick Store Link & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Active Admin User Badge */}
              {currentUser && (
                <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-neutral-300 font-medium">{currentUser.email || currentUser.username}</span>
                  <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded uppercase font-bold tracking-wider">
                    Admin
                  </span>
                </div>
              )}

              <button
                onClick={handleResetDefaults}
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 transition-colors"
                title="Reset seluruh katalog ke data awal default"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Data Awal</span>
              </button>

              <button
                onClick={onNavigateToStore}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-100 text-neutral-950 px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
              >
                <Eye className="w-3.5 h-3.5 text-neutral-800" />
                <span>Lihat Toko</span>
              </button>

              <button
                onClick={() => {
                  setAccountForm({
                    username: currentUser?.username || '',
                    currentPassword: '',
                    newPassword: ''
                  });
                  setIsAccountModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-white px-3.5 py-1.5 rounded-lg transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Akun</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-rose-600/90 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
                title="Keluar dari sesi Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Manajemen Catalog Merchandise</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl text-neutral-950 tracking-tight">
              KELOLA KATALOG MERCHANDISE
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              Tambah artikel merchandise baru, perbarui harga, pantau stok persediaan, dan kelola status katalog untuk toko ElevenCrowd.co.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all self-start sm:self-auto group"
          >
            <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>+ Tambah Merchandise</span>
          </button>
        </div>

        {/* Dashboard Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Total Merchandise */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Artikel</span>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-heading text-neutral-950 tracking-wide">
                {summary.totalProducts} <span className="text-sm font-body text-neutral-400 font-normal">Item</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                {summary.activeProducts} Tersedia • {summary.outOfStockProducts} Habis
              </p>
            </div>
          </div>

          {/* Card 2: Total Stok */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Stok Fisik</span>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-heading text-neutral-950 tracking-wide">
                {summary.totalStock.toLocaleString('id-ID')} <span className="text-sm font-body text-neutral-400 font-normal">Pcs</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Persediaan barang di basecamp
              </p>
            </div>
          </div>

          {/* Card 3: Total Nilai Merchandise */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Nilai Aset Barang</span>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-heading text-neutral-950 tracking-wide truncate">
                {BRAND_CONFIG.formatPrice(summary.totalAssetValue)}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Estimasi nilai perputaran stok
              </p>
            </div>
          </div>

          {/* Card 4: Kategori Terdaftar */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Kategori Aktif</span>
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-heading text-neutral-950 tracking-wide">
                {summary.totalCategories} <span className="text-sm font-body text-neutral-400 font-normal">Kategori</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                T-Shirt, Hoodie, Jacket, Aksesoris
              </p>
            </div>
          </div>

        </div>

        {/* Filter Toolbar & Search */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari merchandise berdasarkan ID, nama baju, atau spesifikasi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-950 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px] font-semibold text-neutral-500 uppercase">Kategori:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs font-semibold text-neutral-900 outline-none cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs font-semibold text-neutral-900 outline-none cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px] font-semibold text-neutral-500 uppercase">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-neutral-900 outline-none cursor-pointer"
                >
                  <option value="newest">Terbaru Ditambahkan</option>
                  <option value="oldest">Terlama Ditambahkan</option>
                  <option value="name-asc">Nama (A - Z)</option>
                  <option value="name-desc">Nama (Z - A)</option>
                  <option value="price-low">Harga: Rendah ke Tinggi</option>
                  <option value="price-high">Harga: Tinggi ke Rendah</option>
                  <option value="stock-low">Stok: Terendah</option>
                  <option value="stock-high">Stok: Tertinggi</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* Catalog Table Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          
          {/* Table Header Info */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-50/50">
            <div>
              <h2 className="font-heading text-xl text-neutral-900 tracking-wide">
                DAFTAR CATALOG MERCHANDISE
              </h2>
              <p className="text-xs text-neutral-500">
                Menampilkan {catalogResult.data.length} dari total {catalogResult.total} merchandise yang sesuai filter.
              </p>
            </div>

            {/* Selection and Items Per Page Controls */}
            <div className="flex items-center gap-3 text-xs text-neutral-600">
              {selectedProductIds.length > 0 && (
                <button
                  onClick={() => openDeleteConfirmation(catalogResult.data.filter((item) => selectedProductIds.includes(item.id)))}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] uppercase tracking-wider"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Terpilih ({selectedProductIds.length})
                </button>
              )}
              <span>Tampilkan per halaman:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-neutral-300 rounded-lg px-2 py-1 text-xs bg-white text-neutral-900 outline-none"
              >
                <option value={5}>5 item</option>
                <option value={8}>8 item</option>
                <option value={15}>15 item</option>
                <option value={30}>30 item</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllVisibleSelected}
                      onChange={toggleAllVisibleProducts}
                      aria-label="Pilih semua merchandise yang terlihat"
                      className="h-4 w-4 accent-neutral-950 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Foto</th>
                  <th className="py-3.5 px-4">Nama Merchandise</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga</th>
                  <th className="py-3.5 px-4">Stok</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {catalogResult.data.length > 0 ? (
                  catalogResult.data.map((item) => {
                    const isLowStock = item.stock > 0 && item.stock <= 10;
                    const isOutOfStock = item.stock === 0 || item.status === 'Habis';

                    return (
                      <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">

                        {/* Selection */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(item.id)}
                            onChange={() => toggleProductSelection(item.id)}
                            aria-label={`Pilih ${item.name}`}
                            className="h-4 w-4 accent-neutral-950 cursor-pointer"
                          />
                        </td>
                        
                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 font-semibold whitespace-nowrap">
                          {item.id}
                        </td>

                        {/* Foto / Gambar */}
                        <td className="py-3.5 px-4">
                          <div className="w-12 h-14 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 relative group">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </td>

                        {/* Nama Merchandise & Details */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-heading text-base text-neutral-950 tracking-wide line-clamp-1">
                            {item.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 text-white uppercase tracking-wider">
                                {item.badge}
                              </span>
                            )}
                            <span className="text-[10px] text-neutral-500 line-clamp-1">
                              {item.specs?.material || item.description || 'Streetwear Series'}
                            </span>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="bg-neutral-100 text-neutral-700 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-neutral-200">
                            {item.category}
                          </span>
                        </td>

                        {/* Harga */}
                        <td className="py-3.5 px-4 font-bold text-neutral-950 whitespace-nowrap">
                          {BRAND_CONFIG.formatPrice(item.price)}
                        </td>

                        {/* Stok */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-neutral-900">
                              {item.stock}
                            </span>
                            <span className="text-[11px] text-neutral-500">pcs</span>

                            {isOutOfStock ? (
                              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                                Habis
                              </span>
                            ) : isLowStock ? (
                              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                Menipis
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                              item.status === 'Tersedia'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.status === 'Habis'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'Tersedia'
                                  ? 'bg-emerald-500'
                                  : item.status === 'Habis'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>

                        {/* Action: Edit & Delete */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/80 rounded-lg transition-colors"
                              title="Edit Merchandise"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openDeleteConfirmation([item])}
                              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Merchandise"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                          <Package className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl text-neutral-900">
                          TIDAK ADA MERCHANDISE DITEMUKAN
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Tidak ada artikel yang sesuai dengan filter atau kata kunci "{searchQuery}".
                        </p>
                        <div className="pt-2 flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setCategoryFilter('all');
                              setStatusFilter('all');
                            }}
                            className="text-xs font-semibold px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700"
                          >
                            Reset Filter
                          </button>
                          <button
                            onClick={handleOpenCreateModal}
                            className="text-xs font-bold px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg"
                          >
                            + Tambah Baru
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {catalogResult.totalPages > 1 && (
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-neutral-500">
                Halaman <strong className="text-neutral-900">{catalogResult.page}</strong> dari{' '}
                <strong className="text-neutral-900">{catalogResult.totalPages}</strong>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={catalogResult.page <= 1}
                  className="p-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: catalogResult.totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        catalogResult.page === pNum
                          ? 'bg-neutral-950 text-white'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((prev) => Math.min(catalogResult.totalPages, prev + 1))}
                  disabled={catalogResult.page >= catalogResult.totalPages}
                  className="p-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Footer Info */}
      <footer className="bg-white border-t border-neutral-200 py-6 mt-12 text-center text-xs text-neutral-500">
        <p className="font-semibold text-neutral-700">ElevenCrowd.co Admin Panel • Authentic Streetwear Catalog</p>
        <p className="mt-1">Penyimpanan Tersinkronisasi Otomatis dengan Halaman Toko (Welcome Page)</p>
      </footer>

      {/* ======================================================================== */}
      {/* MODAL: FORM TAMBAH / EDIT MERCHANDISE                                  */}
      {/* ======================================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden animate-scaleIn my-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {modalMode === 'create' ? 'FORM CREATE MERCHANDISE' : 'FORM UPDATE MERCHANDISE'}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl text-neutral-950 mt-0.5">
                  {modalMode === 'create' ? 'TAMBAH MERCHANDISE BARU' : `EDIT: ${editingProduct?.name}`}
                </h3>
              </div>

              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-200 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Row 1: Nama Merchandise */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                  Nama Merchandise <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: ElevenCrowd Heavyweight Boxy Tee - Black"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none transition-colors ${
                    formErrors.name ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-300 focus:border-neutral-950'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Row 2: Kategori & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Kategori */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Kategori <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Status Merchandise <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Row 3: Harga & Stok */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Harga */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Harga (Rupiah) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="145000"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 outline-none transition-colors ${
                        formErrors.price ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-300 focus:border-neutral-950'
                      }`}
                    />
                  </div>
                  {formData.price && !isNaN(Number(formData.price)) && (
                    <p className="text-[11px] text-neutral-500 font-semibold mt-1">
                      Format: {BRAND_CONFIG.formatPrice(Number(formData.price))}
                    </p>
                  )}
                  {formErrors.price && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.price}</p>
                  )}
                </div>

                {/* Stok */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Jumlah Stok <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none transition-colors ${
                      formErrors.stock ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-300 focus:border-neutral-950'
                    }`}
                  />
                  {formErrors.stock && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.stock}</p>
                  )}
                </div>

              </div>

              {/* Row 4: Badge & Bahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Badge Promo */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Label / Badge Promo
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                {/* Bahan / Material */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Bahan / Material
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Heavyweight Cotton 20s (210 GSM)"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                  />
                </div>

                {/* Warna */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Warna Produk <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hitam, Putih, Navy"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                    required
                  />
                </div>

                {/* Cutting */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Cutting
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Standard Streetwear Cut"
                    value={formData.fit}
                    onChange={(e) => handleInputChange('fit', e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                  />
                </div>

              </div>

              {/* Row 5: Foto / Gambar Merchandise */}
              <div className="space-y-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                  Foto / Gambar Merchandise <span className="text-rose-600">*</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  
                  {/* Image Preview Grid */}
                  <div className="w-full sm:w-52 grid grid-cols-4 sm:grid-cols-2 gap-2 flex-shrink-0">
                    {formData.images.length > 0 ? formData.images.map((image, index) => (
                      <div key={`${image.slice(0, 20)}-${index}`} className="relative aspect-square rounded-xl bg-white border border-neutral-300 overflow-hidden shadow-sm">
                        <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover object-center" />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-neutral-950/80 text-white hover:bg-rose-600"
                          title={`Hapus foto ${index + 1}`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 text-[8px] font-bold uppercase bg-white/90 text-neutral-900 px-1.5 py-0.5 rounded">
                            Utama
                          </span>
                        )}
                      </div>
                    )) : (
                      <div className="col-span-4 sm:col-span-2 aspect-[4/3] rounded-xl bg-white border border-neutral-300 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Input Options: File Upload & Preset */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div>
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase block mb-1">
                        Upload File Gambar dari Komputer:
                      </span>
                      <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-800 cursor-pointer shadow-sm transition-colors">
                        <Upload className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Pilih Gambar (JPG/PNG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          multiple
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Quick Presets */}
                  </div>

                </div>
                {formErrors.image && (
                  <p className="text-[11px] text-rose-600 font-semibold">{formErrors.image}</p>
                )}
              </div>

              {/* Row 6: Ukuran Tersedia */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                  Ukuran yang Tersedia
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['S', 'M', 'L', 'XL', 'XXL', 'All Size'].map((sz) => {
                    const isSelected = formData.sizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {sz} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Pilihan Lengan / Panjang */}
              {getVariantConfig(formData.category) && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    {getVariantConfig(formData.category).label}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {getVariantConfig(formData.category).options.map((option) => {
                      const isSelected = formData.variantOptions.includes(option);
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setFormData((prev) => ({
                            ...prev,
                            variantOptions: isSelected
                              ? prev.variantOptions.filter((item) => item !== option)
                              : [...prev.variantOptions, option]
                          }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          {option} {isSelected ? '✓' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Row 8: Deskripsi */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-1.5">
                  Deskripsi Merchandise
                </label>
                <textarea
                  rows="3"
                  placeholder="Ceritakan detail keunggulan bahan, potongan baju, dan karakter streetwear artikel ini..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-950"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Menyimpan...</span>
                  ) : modalMode === 'create' ? (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Simpan Merchandise</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Perbarui Merchandise</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================================== */}
      {/* MODAL: KONFIRMASI HAPUS MERCHANDISE                                    */}
      {/* ======================================================================== */}
      {deleteTargets.length > 0 && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-neutral-200 shadow-2xl p-6 space-y-5 animate-scaleIn">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-neutral-950">
                  HAPUS MERCHANDISE?
                </h3>
                <p className="text-xs text-neutral-500">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            {/* Target Preview */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 max-h-40 overflow-y-auto">
              {deleteTargets.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-12 object-cover rounded-xl bg-white border border-neutral-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-heading text-base text-neutral-900 truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{BRAND_CONFIG.formatPrice(item.price)}</span>
                      <span>•</span>
                      <span>Stok: {item.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus {deleteTargets.length} merchandise dari katalog toko ElevenCrowd.co?
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargets([])}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl border border-neutral-200 shadow-2xl p-6 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-2xl text-neutral-950">PENGATURAN AKUN</h3>
                <p className="text-xs text-neutral-500 mt-1">Ubah username atau password admin.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900"
                aria-label="Tutup pengaturan akun"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Username Baru</span>
                <input
                  type="text"
                  value={accountForm.username}
                  onChange={(event) => setAccountForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-950"
                  required
                  minLength={3}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Password Saat Ini</span>
                <input
                  type="password"
                  value={accountForm.currentPassword}
                  onChange={(event) => setAccountForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-950"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Password Baru <span className="font-normal normal-case">(kosongkan jika tidak diubah)</span></span>
                <input
                  type="password"
                  value={accountForm.newPassword}
                  onChange={(event) => setAccountForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-950"
                  minLength={6}
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAccountSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {isAccountSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
