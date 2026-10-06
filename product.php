<?php
require __DIR__ . '/includes/config.php';

$id = $_GET['id'] ?? '';
$products = dbProducts();
$product = null;
foreach ($products as $item) {
    if (($item['id'] ?? '') === $id) {
        $product = $item;
        break;
    }
}

if (!$product) {
    header('Location: /index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($product['name']); ?> - <?php echo APP_NAME; ?></title>
    <style>
        body { margin:0; font-family:Inter, sans-serif; background:#f5f5f3; color:#111; }
        .container { width:min(1100px, calc(100% - 32px)); margin:0 auto; }
        .nav { display:flex; justify-content:space-between; align-items:center; height:72px; }
        .brand { font-weight:800; letter-spacing:.08em; }
        .product-box { display:grid; grid-template-columns:1.1fr 1fr; gap:36px; padding:32px 0 60px; }
        img { width:100%; border-radius:24px; object-fit:cover; height:560px; }
        .price { font-size:2rem; font-weight:800; margin:12px 0; }
        .specs { margin-top: 20px; display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; }
        .spec { background:#fff; border:1px solid #e5e5e5; border-radius:16px; padding:14px; }
        .btn { display:inline-block; background:#111; color:#fff; padding:14px 18px; border-radius:999px; text-decoration:none; margin-top:18px; }
        .small { color:#666; }
        @media (max-width: 768px) { .product-box { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <header class="container nav">
        <div class="brand"><?php echo APP_NAME; ?></div>
        <a href="/index.php">← Kembali</a>
    </header>

    <main class="container product-box">
        <div>
            <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
        </div>
        <div>
            <?php if (!empty($product['badge'])): ?><div style="display:inline-block;padding:7px 10px;background:#111;color:#fff;border-radius:999px;font-size:11px;letter-spacing:.12em;"><?php echo htmlspecialchars($product['badge']); ?></div><?php endif; ?>
            <h1><?php echo htmlspecialchars($product['name']); ?></h1>
            <div class="small"><?php echo htmlspecialchars($product['category']); ?> • <?php echo htmlspecialchars($product['status']); ?></div>
            <div class="price"><?php echo formatRupiah($product['price']); ?></div>
            <p class="small"><?php echo htmlspecialchars($product['description']); ?></p>
            <a class="btn" href="<?php echo createOrderUrl($product, $product['sizes'][0] ?? 'M'); ?>" target="_blank" rel="noreferrer">Order via WhatsApp</a>

            <div class="specs">
                <?php foreach ($product['specs'] as $key => $value): ?>
                    <div class="spec">
                        <div class="small" style="text-transform:capitalize"><?php echo htmlspecialchars($key); ?></div>
                        <strong><?php echo htmlspecialchars($value); ?></strong>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>
</body>
</html>
