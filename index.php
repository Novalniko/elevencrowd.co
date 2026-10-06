<?php
require __DIR__ . '/includes/config.php';
$products = dbProducts();
$categories = categoryList($products);
$selectedCategory = $_GET['category'] ?? 'all';
$filteredProducts = $selectedCategory === 'all'
    ? $products
    : array_values(array_filter($products, fn($p) => ($p['category'] ?? '') === $selectedCategory));
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #f5f5f3;
            --panel: #ffffff;
            --panel-2: #f3f3f1;
            --text: #121212;
            --muted: #666;
            --line: #e7e3df;
            --primary: #111;
            --accent: #d9a441;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text);
        }
        a { text-decoration: none; color: inherit; }
        .container { width: min(1200px, calc(100% - 32px)); margin: 0 auto; }
        header { position: sticky; top: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); z-index: 10; }
        .nav { display: flex; justify-content: space-between; align-items: center; height: 72px; }
        .brand { font-weight: 800; letter-spacing: 0.08em; }
        .nav-links { display: flex; align-items: center; gap: 22px; }
        .nav-links a { color: var(--muted); font-size: 14px; }
        .nav-links .btn { background: var(--primary); color: white; padding: 10px 16px; border-radius: 999px; }
        .hero { padding: 48px 0 28px; }
        .hero-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 28px; align-items: center; }
        .eyebrow { display: inline-block; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
        h1 { font-size: clamp(2.5rem, 5vw, 4.4rem); line-height: 1; margin: 0 0 18px; }
        .hero p { font-size: 1.05rem; line-height: 1.7; color: var(--muted); max-width: 560px; }
        .cta-row { display: flex; gap: 14px; margin-top: 24px; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--line); padding: 12px 18px; border-radius: 999px; font-weight: 600; }
        .btn.primary { background: var(--primary); color: white; border-color: var(--primary); }
        .hero-card { background: var(--panel); border: 1px solid var(--line); border-radius: 28px; padding: 18px; }
        .hero-card img { width:100%; height: 440px; object-fit: cover; border-radius: 20px; }
        .mini-card { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
        .section { padding: 32px 0; }
        .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .filters { display: flex; flex-wrap: wrap; gap: 10px; }
        .chip { padding: 10px 14px; border: 1px solid var(--line); border-radius: 999px; background: var(--panel); font-size: 13px; }
        .chip.active { background: var(--primary); color: white; border-color: var(--primary); }
        .catalog-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; }
        .product { background: var(--panel); border: 1px solid var(--line); border-radius: 22px; overflow: hidden; }
        .product img { width:100%; height: 300px; object-fit: cover; display: block; }
        .product-body { padding: 16px; }
        .badge { display:inline-block; background:#111; color:#fff; font-size:10px; letter-spacing:.12em; padding:6px 8px; border-radius:999px; }
        .product h3 { margin: 14px 0 8px; font-size: 1rem; }
        .meta { display: flex; justify-content: space-between; align-items: center; color: var(--muted); font-size: 12px; }
        .price { margin: 14px 0; font-size: 1.15rem; font-weight: 700; }
        .product-actions { display: flex; gap: 8px; }
        .product-actions a { flex: 1; text-align:center; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; }
        .product-actions .primary { background: var(--primary); border-color: var(--primary); color: white; }
        .footer { padding: 28px 0 48px; color: var(--muted); font-size: 14px; }
        @media (max-width: 900px) {
            .hero-grid, .catalog-grid { grid-template-columns: 1fr 1fr; }
            .nav-links { display: none; }
        }
        @media (max-width: 640px) {
            .hero-grid, .catalog-grid { grid-template-columns: 1fr; }
            .hero-card img { height: 320px; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container nav">
            <div class="brand"><?php echo APP_NAME; ?></div>
            <nav class="nav-links">
                <a href="#catalog">Katalog</a>
                <a href="#about">Tentang</a>
                <a href="login.php">Admin</a>
                <a class="btn" href="https://wa.me/<?php echo WHATSAPP_NUMBER; ?>" target="_blank" rel="noreferrer">Chat WhatsApp</a>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container hero-grid">
                <div>
                    <div class="eyebrow">Authentic Streetwear</div>
                    <h1>Wear the culture.<br>Own the moment.</h1>
                    <p>ElevenCrowd.co menghadirkan koleksi streetwear modern dengan desain yang simpel, premium, dan tetap nyaman dipakai setiap hari.</p>
                    <div class="cta-row">
                        <a href="#catalog" class="btn primary">Lihat Koleksi</a>
                        <a href="https://wa.me/<?php echo WHATSAPP_NUMBER; ?>" class="btn" target="_blank" rel="noreferrer">Pesan via WhatsApp</a>
                    </div>
                </div>
                <div class="hero-card">
                    <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80" alt="Hero product">
                    <div class="mini-card">
                        <div>
                            <strong>ElevenCrowd Signature Boxy Tee</strong><br>
                            <small>Rp 145.000</small>
                        </div>
                        <a class="btn primary" href="https://wa.me/<?php echo WHATSAPP_NUMBER; ?>?text=<?php echo rawurlencode('Halo Admin ElevenCrowd.co, saya mau order ElevenCrowd Signature Boxy Tee'); ?>" target="_blank" rel="noreferrer">Order</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="catalog">
            <div class="container">
                <div class="section-head">
                    <h2>Produk Terbaru</h2>
                    <div class="filters">
                        <?php foreach ($categories as $key => $name): ?>
                            <a class="chip <?php echo ($selectedCategory === $key ? 'active' : ''); ?>" href="?category=<?php echo urlencode($key); ?>"><?php echo htmlspecialchars($name); ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="catalog-grid">
                    <?php foreach ($filteredProducts as $product): ?>
                        <article class="product">
                            <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                            <div class="product-body">
                                <?php if (!empty($product['badge'])): ?>
                                    <span class="badge"><?php echo htmlspecialchars($product['badge']); ?></span>
                                <?php endif; ?>
                                <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                                <div class="meta">
                                    <span><?php echo htmlspecialchars($product['category']); ?></span>
                                    <span><?php echo htmlspecialchars($product['status']); ?></span>
                                </div>
                                <div class="price"><?php echo formatRupiah($product['price']); ?></div>
                                <div class="product-actions">
                                    <a href="product.php?id=<?php echo urlencode($product['id']); ?>">Detail</a>
                                    <a class="primary" href="<?php echo createOrderUrl($product, $product['sizes'][0] ?? 'M'); ?>" target="_blank" rel="noreferrer">Order</a>
                                </div>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section class="section" id="about">
            <div class="container">
                <h2>Tentang ElevenCrowd</h2>
                <p style="color: var(--muted); max-width: 760px; line-height: 1.8;">
                    ElevenCrowd.co adalah brand streetwear yang dibuat untuk mereka yang ingin tampil beda tanpa kehilangan kenyamanan. Koleksi kami dibuat untuk keseharian, komunitas, dan gaya hidup yang tetap authentic.
                </p>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">© <?php echo date('Y'); ?> <?php echo APP_NAME; ?> — Built with PHP Native</div>
    </footer>
</body>
</html>
