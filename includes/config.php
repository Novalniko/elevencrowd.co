<?php
session_start();
require __DIR__ . '/db.php';

const APP_NAME = 'ElevenCrowd.co';
const WHATSAPP_NUMBER = '6283896427726';
const LOGIN_PATH = '/login.php';
const ADMIN_PATH = '/admin.php';

function formatRupiah($value): string
{
    return 'Rp ' . number_format((float) $value, 0, ',', '.');
}

function loadProducts(): array
{
    $file = __DIR__ . '/../data/products.json';
    if (!file_exists($file)) {
        return [];
    }

    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function saveProducts(array $products): void
{
    $file = __DIR__ . '/../data/products.json';
    file_put_contents($file, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function loadUsers(): array
{
    $file = __DIR__ . '/../data/users.json';
    if (!file_exists($file)) {
        return [];
    }

    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function isLoggedIn(): bool
{
    return !empty($_SESSION['admin_logged_in']);
}

function requireAdmin(): void
{
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit;
    }
}

function createOrderUrl(array $product, string $size = 'M', int $quantity = 1): string
{
    $message = "Halo Admin ElevenCrowd.co! 👋\n";
    $message .= "Saya ingin order produk berikut:\n\n";
    $message .= "📦 *PRODUK:* {$product['name']}\n";
    $message .= "📏 *UKURAN:* {$size}\n";
    $message .= "🔢 *JUMLAH:* {$quantity} pcs\n";
    $message .= "💰 *HARGA:* " . formatRupiah((int) $product['price'] * $quantity) . "\n\n";
    $message .= "---\n";
    $message .= "👤 Nama: \n";
    $message .= "📱 No. HP: \n";
    $message .= "📍 Alamat Lengkap: \n";

    return 'https://wa.me/' . WHATSAPP_NUMBER . '?text=' . rawurlencode($message);
}

function categoryList(array $products): array
{
    $categories = ['all' => 'Semua Koleksi'];
    foreach ($products as $product) {
        $key = $product['category'];
        if (!isset($categories[$key])) {
            $categories[$key] = $product['category'];
        }
    }
    return $categories;
}
