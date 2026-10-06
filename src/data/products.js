/**
 * =======================================================================
 * KATALOG PRODUK ELEVENCROWD.CO
 * =======================================================================
 * 
 * PANDUAN MENAMBAH PRODUK BARU SENDIRI:
 * 1. Pengelolaan katalog dan stok dilakukan melalui panel admin setelah login.
 *    (produk otomatis tersimpan di browser Anda tanpa perlu edit coding).
 * 2. ATAU Anda bisa menduplikasi salah satu objek produk di bawah ini dan mengubah isinya:
 * 
 *   {
 *     id: "ec-baju-baru",
 *     name: "ElevenCrowd New Release Tee",
 *     category: "T-Shirt", // Pilihan: "T-Shirt", "Oversized", "Hoodie", "Jacket", "Aksesoris"
 *     price: 135000,       // Angka tanpa titik (contoh: 135000 untuk Rp 135.000)
 *     image: "https://url-gambar-anda.jpg",
 *     badge: "NEW DROP",   // Opsional: "NEW DROP", "BEST SELLER", "LIMITED", atau ""
 *     sizes: ["S", "M", "L", "XL", "XXL"],
 *     specs: {
 *       material: "Cotton Combed 24s Premium Heavyweight",
 *       print: "Plastisol Ink High Density",
 *       fit: "Regular Fit / Oversized Fit",
 *       color: "White / Black"
 *     },
 *     description: "Deskripsi singkat tentang kelebihan dan detail baju ini."
 *   }
 */

export const INITIAL_PRODUCTS = [
  {
    id: "ec-tee-01",
    name: "ElevenCrowd Signature Boxy Tee - White",
    category: "Oversized",
    price: 145000,
    stock: 42,
    status: "Tersedia",
    badge: "BEST SELLER",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    specs: {
      material: "100% Heavyweight Cotton 20s (210 GSM)",
      print: "Plastisol Screenprint Micro High Density",
      fit: "Drop Shoulder Boxy Cut",
      color: "Clean Off-White"
    },
    description: "Kaos potongan boxy kontemporer dengan bahan katun tebal tidak menerawang, sangat adem dan nyaman digunakan sehari-hari. Aksen grafis minimalis di bagian dada dan punggung."
  },
  {
    id: "ec-tee-02",
    name: "ElevenCrowd Heritage Typo T-Shirt - Black on White",
    category: "T-Shirt",
    price: 130000,
    stock: 28,
    status: "Tersedia",
    badge: "NEW DROP",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    specs: {
      material: "Cotton Combed 24s Premium Soft Touch",
      print: "Discharge & Plastisol Finishing",
      fit: "Regular Streetwear Fit",
      color: "Pure White"
    },
    description: "T-Shirt esensial bergaya streetwear klasik dengan tipografi khas ElevenCrowd. Jahitan rantai pada pundak untuk durabilitas maksimal."
  },
  {
    id: "ec-hoodie-01",
    name: "ElevenCrowd Heavyweight Pullover Hoodie - Cream Stone",
    category: "Hoodie",
    price: 265000,
    stock: 15,
    status: "Tersedia",
    badge: "LIMITED",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    sizes: ["M", "L", "XL", "XXL"],
    specs: {
      material: "Cotton Fleece Heavy 330 GSM (Warm & Breathable)",
      print: "Embroidered Monogram Patch & HD Screenprint",
      fit: "Relaxed Streetwear Silhouette",
      color: "Cream / Light Sand"
    },
    description: "Hoodie tebal dan lembut dengan lapisan dalam brushed fleece. Dilengkapi tali hoodie berbahan katun tenun dan saku kangaroo yang luas."
  },

  {
    id: "ec-hoodie-02",
    name: "ElevenCrowd Arch Logo Crewneck Sweatshirt",
    category: "Hoodie",
    price: 220000,
    stock: 0,
    status: "Habis",
    badge: "",
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80",
    sizes: ["S", "M", "L", "XL"],
    specs: {
      material: "French Terry 300 GSM Premium Softness",
      print: "Chenille Embroidery & Raised Plastisol",
      fit: "Modern Regular Fit",
      color: "Heather Light Gray / White"
    },
    description: "Crewneck minimalis yang fleksibel dipadukan dengan celana cargo atau denim favoritmu. Rib kerah anti-melar dengan rajutan ganda."
  },
  {
    id: "ec-tee-04",
    name: "ElevenCrowd Monochrome Bold Pocket Tee",
    category: "T-Shirt",
    price: 125000,
    stock: 20,
    status: "Tersedia",
    badge: "",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
    specs: {
      material: "Cotton Combed 30s Super Comfort",
      print: "Woven Label & Minimalist Chest Pocket",
      fit: "Slim to Regular",
      color: "Optical White"
    },
    description: "Kaos saku simpel dengan sentuhan woven label eksklusif di bagian saku dada. Pilihan sempurna untuk layering atau gaya kasual harian."
  },
  {
    id: "ec-acc-01",
    name: "ElevenCrowd Corduroy 6-Panel Cap - Off White",
    category: "Aksesoris",
    price: 95000,
    stock: 50,
    status: "Tersedia",
    badge: "BEST SELLER",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80",
    sizes: ["All Size (Adjustable)"],
    specs: {
      material: "Premium Fine Wale Corduroy Cotton",
      print: "3D Puff Embroidery Logo",
      fit: "Unstructured 6-Panel with Brass Buckle",
      color: "Off White"
    },
    description: "Topi corduroy klasik dengan strap kulit/kuningan yang dapat disesuaikan. Melengkapi gaya streetwear harianmu dengan sempurna."
  }
];

export const CATEGORIES = [
  { id: "all", name: "Semua Koleksi", count: 6 },
  { id: "T-Shirt", name: "T-Shirt", count: 2 },
  { id: "Oversized", name: "Oversized", count: 1 },
  { id: "Hoodie", name: "Hoodie & Crewneck", count: 2 },
  { id: "Jacket", name: "Jacket & Outerwear", count: 0 },
  { id: "Aksesoris", name: "Aksesoris", count: 1 },
];
