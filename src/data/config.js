export const BRAND_CONFIG = {
  name: "ElevenCrowd.co",
  shortName: "ELEVEN CROWD",
  tagline: "Authentic Streetwear & Everyday Essentials",
  slogan: "Stay Real, Stand With The Crowd",
  whatsappNumber: "6283896427726", // 083896427726
  whatsappDisplay: "0838-9642-7726",
  instagram: "elevencrowd.co",
  instagramUrl: "https://instagram.com/elevencrowd.co",
  tiktok: "elevencrowd.co",
  tiktokUrl: "https://tiktok.com/@elevencrowd.co",
  email: "contact@elevencrowd.co",
  basecamp: "Based in MJ-Town Indonesia",
  operationalHours: "Senin - Minggu: 10.00 - 21.00 WIB",
  
  // Foto Banner Utama (Featured Item di sebelah kanan Hero)
  // Anda bisa mengganti URL di bawah ini, ATAU taruh foto Anda di folder 'public/images/foto.jpg' dan tulis "/images/foto.jpg"
  heroImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
  heroItemName: "ElevenCrowd Signature Boxy Tee",
  heroItemPrice: 145000,
  
  // Format harga ke Rupiah
  formatPrice: (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },

  // Helper untuk membuat link WhatsApp pemesanan 1 produk
  createOrderUrl: ({ product, size, variantOption = "", quantity = 1, notes = "" }) => {
    const text = `Halo Admin ElevenCrowd.co! 👋
Saya ingin order produk berikut:

📦 *PRODUK:* ${product.name}
📏 *UKURAN:* ${size}
${variantOption ? `👕 *PILIHAN:* ${variantOption}\n` : ''}🔢 *JUMLAH:* ${quantity} pcs
💰 *HARGA:* ${BRAND_CONFIG.formatPrice(product.price * quantity)}
${notes ? `📝 *CATATAN:* ${notes}\n` : ''}
---
*DATA PEMESAN:*
👤 Nama: 
📱 No. HP: 
📍 Alamat Lengkap: 

Mohon informasi ketersediaan stok & total ongkirnya ya. Terima kasih! 🙏`;

    return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  // Helper untuk membuat link WhatsApp pemesanan keranjang (multi-item)
  createCartOrderUrl: (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemList = cartItems.map((item, index) => {
      return `${index + 1}. *${item.name}*
   - Size: ${item.size}
    ${item.variantOption ? `- Pilihan: ${item.variantOption}\n  ` : ''}- Qty: ${item.quantity} pcs
   - Subtotal: ${BRAND_CONFIG.formatPrice(item.price * item.quantity)}`;
    }).join('\n\n');

    const text = `Halo Admin ElevenCrowd.co! 👋
Saya ingin melakukan Checkout Keranjang Belanja:

🛒 *DAFTAR PESANAN:*
${itemList}

------------------------------------
💵 *TOTAL PEMBELIAN:* ${BRAND_CONFIG.formatPrice(total)}
------------------------------------

*DATA PEMESAN:*
👤 Nama Lengkap: 
📱 No. WhatsApp: 
📍 Alamat Pengiriman (Kota/Kec/Kode Pos): 

Mohon total beserta ongkos kirim dan nomor rekeningnya ya min. Terima kasih! 🔥`;

    return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  // Helper pesan tanya admin
  createInquiryUrl: (topic = "") => {
    const text = topic 
      ? `Halo Admin ElevenCrowd.co! Saya ingin bertanya mengenai ${topic}. Bisa dibantu?`
      : `Halo Admin ElevenCrowd.co! Saya ingin tanya-tanya ketersediaan produk dan size. Terima kasih!`;
    return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};
