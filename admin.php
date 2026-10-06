<?php
require __DIR__ . '/includes/config.php';
requireAdmin();

$products = dbProducts();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $newProduct = [
            'id' => $_POST['id'] ?? 'product-' . time(),
            'name' => trim($_POST['name'] ?? ''),
            'category' => $_POST['category'] ?? 'T-Shirt',
            'price' => (int) ($_POST['price'] ?? 0),
            'stock' => (int) ($_POST['stock'] ?? 0),
            'status' => $_POST['status'] ?? 'Tersedia',
            'badge' => $_POST['badge'] ?? '',
            'image' => $_POST['image'] ?? '',
            'sizes' => array_values(array_filter(array_map('trim', explode(',', $_POST['sizes'] ?? '')), fn($v) => $v !== '')),
            'specs' => [
                'material' => $_POST['material'] ?? '',
                'print' => $_POST['print'] ?? '',
                'fit' => $_POST['fit'] ?? '',
                'color' => $_POST['color'] ?? '',
            ],
            'description' => $_POST['description'] ?? '',
        ];

        if ($newProduct['name'] === '') {
            $message = 'Nama produk tidak boleh kosong.';
        } else {
            dbUpsertProduct($newProduct);
            $products = dbProducts();
            $message = 'Produk berhasil disimpan.';
        }
    }

    if ($action === 'delete') {
        $deleteId = $_POST['id'] ?? '';
        dbDeleteProduct($deleteId);
        $products = dbProducts();
        $message = 'Produk berhasil dihapus.';
    }

    if ($action === 'edit') {
        $editId = $_POST['id'] ?? '';
        $payload = [
            'id' => $editId,
            'name' => trim($_POST['name'] ?? ''),
            'category' => $_POST['category'] ?? 'T-Shirt',
            'price' => (int) ($_POST['price'] ?? 0),
            'stock' => (int) ($_POST['stock'] ?? 0),
            'status' => $_POST['status'] ?? 'Tersedia',
            'badge' => $_POST['badge'] ?? '',
            'image' => $_POST['image'] ?? '',
            'sizes' => array_values(array_filter(array_map('trim', explode(',', $_POST['sizes'] ?? '')), fn($v) => $v !== '')),
            'specs' => [
                'material' => $_POST['material'] ?? '',
                'print' => $_POST['print'] ?? '',
                'fit' => $_POST['fit'] ?? '',
                'color' => $_POST['color'] ?? '',
            ],
            'description' => $_POST['description'] ?? '',
        ];

        dbUpsertProduct($payload);
        $products = dbProducts();
        $message = 'Produk berhasil diperbarui.';
    }
}

$editingId = $_GET['edit'] ?? '';
$editingProduct = null;
if ($editingId !== '') {
    foreach ($products as $product) {
        if (($product['id'] ?? '') === $editingId) {
            $editingProduct = $product;
            break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <style>
        body { margin:0; font-family: Inter, sans-serif; background:#f3f3f1; color:#111; }
        .container { width:min(1200px, calc(100% - 32px)); margin:0 auto; }
        header { background:#fff; border-bottom:1px solid #e5e5e5; }
        .nav { display:flex; justify-content:space-between; align-items:center; height:72px; }
        .grid { display:grid; grid-template-columns: 1.1fr 0.9fr; gap:24px; padding:32px 0; }
        .panel { background:#fff; border:1px solid #e5e5e5; border-radius:20px; padding:22px; }
        form { display:grid; gap:12px; }
        .row { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; }
        input, select, textarea { width:100%; padding:12px 14px; border:1px solid #ddd; border-radius:12px; }
        textarea { min-height:120px; resize: vertical; }
        button { background:#111; color:#fff; border:0; border-radius:12px; padding:12px 16px; cursor:pointer; }
        .logout { text-decoration:none; color:#666; }
        table { width:100%; border-collapse: collapse; }
        th, td { padding:12px 8px; border-bottom:1px solid #ececec; text-align:left; }
        .mini { display:inline-block; padding:6px 8px; border-radius:999px; background:#f2f2f2; font-size:12px; }
        .success { padding:12px 14px; background:#eefaf0; color:#126b35; border-radius:10px; margin-bottom:12px; }
        @media (max-width: 900px) { .grid, .row { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <header>
        <div class="container nav">
            <div><strong><?php echo APP_NAME; ?></strong> Admin</div>
            <a class="logout" href="/logout.php">Logout</a>
        </div>
    </header>

    <div class="container grid">
        <section class="panel">
            <h2>Daftar Produk</h2>
            <?php if ($message !== ''): ?>
                <div class="success"><?php echo htmlspecialchars($message); ?></div>
            <?php endif; ?>
            <table>
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $product): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($product['name']); ?></td>
                            <td><span class="mini"><?php echo htmlspecialchars($product['category']); ?></span></td>
                            <td><?php echo formatRupiah($product['price']); ?></td>
                            <td>
                                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                    <a class="mini" href="/admin.php?edit=<?php echo urlencode($product['id']); ?>">Edit</a>
                                    <form method="post" onsubmit="return confirm('Hapus produk ini?')" style="margin:0;">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($product['id']); ?>">
                                        <button type="submit">Hapus</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>

        <aside class="panel">
            <h2><?php echo $editingProduct ? 'Edit Produk' : 'Tambah Produk'; ?></h2>
            <form method="post">
                <input type="hidden" name="action" value="<?php echo $editingProduct ? 'edit' : 'create'; ?>">
                <div class="row">
                    <input type="text" name="id" placeholder="ID Produk" value="<?php echo htmlspecialchars($editingProduct['id'] ?? ''); ?>" <?php echo $editingProduct ? 'readonly' : 'required'; ?>>
                    <input type="text" name="name" placeholder="Nama Produk" value="<?php echo htmlspecialchars($editingProduct['name'] ?? ''); ?>" required>
                </div>
                <div class="row">
                    <select name="category">
                        <?php
                        $categories = ['T-Shirt','Oversized','Hoodie','Jacket','Aksesoris'];
                        foreach ($categories as $cat) {
                            $selected = ($editingProduct['category'] ?? 'T-Shirt') === $cat ? 'selected' : '';
                            echo '<option value="' . htmlspecialchars($cat) . '" ' . $selected . '>' . htmlspecialchars($cat) . '</option>';
                        }
                        ?>
                    </select>
                    <input type="number" name="price" placeholder="Harga" value="<?php echo htmlspecialchars($editingProduct['price'] ?? ''); ?>" required>
                </div>
                <div class="row">
                    <input type="number" name="stock" placeholder="Stok" value="<?php echo htmlspecialchars($editingProduct['stock'] ?? '0'); ?>">
                    <input type="text" name="badge" placeholder="Badge (opsional)" value="<?php echo htmlspecialchars($editingProduct['badge'] ?? ''); ?>">
                </div>
                <input type="url" name="image" placeholder="URL Gambar" value="<?php echo htmlspecialchars($editingProduct['image'] ?? ''); ?>" required>
                <input type="text" name="sizes" placeholder="Ukuran, pisahkan dengan koma (S,M,L)" value="<?php echo htmlspecialchars(implode(',', $editingProduct['sizes'] ?? ['S','M','L','XL','XXL'])); ?>">
                <div class="row">
                    <input type="text" name="material" placeholder="Material" value="<?php echo htmlspecialchars($editingProduct['specs']['material'] ?? ''); ?>">
                    <input type="text" name="print" placeholder="Print" value="<?php echo htmlspecialchars($editingProduct['specs']['print'] ?? ''); ?>">
                </div>
                <div class="row">
                    <input type="text" name="fit" placeholder="Fit" value="<?php echo htmlspecialchars($editingProduct['specs']['fit'] ?? ''); ?>">
                    <input type="text" name="color" placeholder="Color" value="<?php echo htmlspecialchars($editingProduct['specs']['color'] ?? ''); ?>">
                </div>
                <textarea name="description" placeholder="Deskripsi produk"><?php echo htmlspecialchars($editingProduct['description'] ?? ''); ?></textarea>
                <select name="status">
                    <option value="Tersedia" <?php echo (($editingProduct['status'] ?? 'Tersedia') === 'Tersedia' ? 'selected' : ''); ?>>Tersedia</option>
                    <option value="Habis" <?php echo (($editingProduct['status'] ?? 'Tersedia') === 'Habis' ? 'selected' : ''); ?>>Habis</option>
                </select>
                <button type="submit"><?php echo $editingProduct ? 'Update Produk' : 'Simpan Produk'; ?></button>
            </form>
        </aside>
    </div>
</body>
</html>
