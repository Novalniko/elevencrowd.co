# ElevenCrowd.co - Official Website & Streetwear Catalog

Website e-commerce katalog pakaian streetwear modern untuk brand **ElevenCrowd.co** dengan tema visual putih bersih (*Clean White Aesthetic*), sistem pemesanan otomatis langsung ke WhatsApp (`083896427726`), dan panel kemudahan menambah/mengedit produk baju sendiri.

---

## 🚀 Panduan Menjalankan Website di Komputer

### 1. Masuk ke Direktori Proyek
Buka PowerShell atau Command Prompt di folder ini:
```powershell
cd "C:\Users\DELL 5420\.gemini\antigravity\scratch\elevencrowd-co"
```

### 2. Jalankan Development Server
Ketik perintah berikut:
```powershell
npm.cmd run dev
```

Website akan berjalan dan dapat Anda akses di browser melalui:
👉 **`http://localhost:3001`**

Panel admin tersedia di:
👉 **`http://localhost:3001/admin`**

---

## 👕 Cara Menambahkan & Mengubah Katalog Baju Sendiri

Anda memiliki **2 cara praktis** untuk mengelola katalog pakaian:

### CARA 1: Langsung Melalui Website (Paling Mudah & Praktis)
1. Buka website di browser (`http://localhost:3001`).
2. Klik tombol **"Kelola Produk"** (dengan label **Admin**) di pojok kanan atas navbar atau di bagian katalog.
3. Form pop-up akan terbuka:
   - Masukkan **Nama Baju** (misal: *ElevenCrowd Heavy Boxy Tee*).
   - Pilih **Kategori** (*T-Shirt, Oversized, Hoodie, Jacket, Aksesoris*).
   - Masukkan **Harga Rupiah** (misal: *145000*).
   - Pilih **Ukuran** yang tersedia (*S, M, L, XL, XXL*).
   - Masukkan link **URL Foto** atau klik salah satu preset foto streetwear yang disediakan.
   - Masukkan bahan (*contoh: Cotton Combed 24s Heavyweight*).
4. Klik **"Simpan & Tambahkan ke Katalog"**.
5. Baju baru akan **langsung muncul di etalase katalog** seketika tanpa perlu restart!

---

### CARA 2: Melalui File Koding (`src/data/products.js`)
Jika ingin menambahkan puluhan baju secara permanen di kode sumber:
1. Buka file [`src/data/products.js`](file:///C:/Users/DELL%205420/.gemini/antigravity/scratch/elevencrowd-co/src/data/products.js).
2. Salin salah satu blok template produk di dalam array `INITIAL_PRODUCTS`:
   ```javascript
   {
     id: "ec-tee-custom-01",
     name: "ElevenCrowd New Release Tee",
     category: "T-Shirt",
     price: 135000,
     badge: "NEW DROP",
     image: "https://url-gambar-anda.jpg",
     sizes: ["S", "M", "L", "XL", "XXL"],
     specs: {
       material: "100% Cotton Combed 24s",
       print: "Plastisol Screenprint Micro High Density",
       fit: "Streetwear Cut",
       color: "Pure White"
     },
     description: "Deskripsi singkat tentang kelebihan baju ini."
   }
   ```
3. Simpan file (`Ctrl + S`), dan tampilan di browser akan otomatis terbarukan.

---

## 📱 Konfigurasi Nomor WhatsApp & Kontak Toko

Seluruh konfigurasi kontak tersimpan rapi di file [`src/data/config.js`](file:///C:/Users/DELL%205420/.gemini/antigravity/scratch/elevencrowd-co/src/data/config.js):
* **Nomor WhatsApp**: `6283896427726` (`083896427726`)
* **Format Pesan Pemesanan**: Tersusun rapi mencantumkan nama baju, size terpilih, jumlah, subtotal, dan template data nama/alamat pemesan.
* **Akun Instagram & TikTok**: Dapat disesuaikan di file config tersebut.

---

## Supabase dan Environment

Buat file `.env` berdasarkan `.env.example`, lalu isi kredensial dari Supabase:

```env
VITE_SUPABASE_URL=https://PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=ANON_PUBLIC_KEY
```

Jalankan isi `supabase/schema.sql` di Supabase SQL Editor sebelum menggunakan katalog online.
Jangan upload file `.env` atau gunakan `service_role key` di frontend.

## 🌐 Cara Mengunggah (Deploy) ke Internet Agar Bisa Dibuka Semua Orang

Website ini siap di-deploy secara **gratis** ke:
1. **Vercel** (rekomendasi): gunakan pengaturan berikut:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Project Settings → Environment Variables.
2. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Tambahkan environment variables yang sama di Site configuration → Environment variables.
   - File `public/_redirects` sudah disediakan agar rute `/admin` tidak menjadi 404.
3. Anda bisa menyambungkan domain sendiri seperti `elevencrowd.co` atau `elevencrowd.id`.
