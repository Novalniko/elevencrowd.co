<?php
$host = getenv('DB_HOST') ?: '127.0.0.1';
$dbName = getenv('DB_NAME') ?: 'elevencrowd';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    $pdo = null;
}

function dbProducts(): array
{
    global $pdo;

    if (!$pdo) {
        return loadProducts();
    }

    $stmt = $pdo->query('SELECT * FROM products ORDER BY created_at DESC');
    return $stmt->fetchAll();
}

function dbUpsertProduct(array $product): void
{
    global $pdo;

    if (!$pdo) {
        $products = loadProducts();
        $exists = false;
        foreach ($products as $index => $item) {
            if (($item['id'] ?? '') === ($product['id'] ?? '')) {
                $products[$index] = $product['id'] ? $product : $item;
                $exists = true;
                break;
            }
        }
        if (!$exists) {
            $products[] = $product;
        }
        saveProducts($products);
        return;
    }

    $sql = 'INSERT INTO products (id, name, category, price, stock, status, badge, image, sizes, material, print_info, fit_info, color_info, description)
            VALUES (:id, :name, :category, :price, :stock, :status, :badge, :image, :sizes, :material, :print_info, :fit_info, :color_info, :description)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name), category = VALUES(category), price = VALUES(price), stock = VALUES(stock), status = VALUES(status),
            badge = VALUES(badge), image = VALUES(image), sizes = VALUES(sizes), material = VALUES(material),
            print_info = VALUES(print_info), fit_info = VALUES(fit_info), color_info = VALUES(color_info), description = VALUES(description), updated_at = CURRENT_TIMESTAMP';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id' => $product['id'],
        ':name' => $product['name'],
        ':category' => $product['category'],
        ':price' => (int) ($product['price'] ?? 0),
        ':stock' => (int) ($product['stock'] ?? 0),
        ':status' => $product['status'] ?? 'Tersedia',
        ':badge' => $product['badge'] ?? '',
        ':image' => $product['image'] ?? '',
        ':sizes' => implode(',', $product['sizes'] ?? ['S','M','L','XL','XXL']),
        ':material' => $product['specs']['material'] ?? '',
        ':print_info' => $product['specs']['print'] ?? '',
        ':fit_info' => $product['specs']['fit'] ?? '',
        ':color_info' => $product['specs']['color'] ?? '',
        ':description' => $product['description'] ?? '',
    ]);
}

function dbDeleteProduct(string $id): void
{
    global $pdo;

    if (!$pdo) {
        $products = loadProducts();
        $products = array_values(array_filter($products, fn($p) => ($p['id'] ?? '') !== $id));
        saveProducts($products);
        return;
    }

    $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $stmt->execute([':id' => $id]);
}

function dbValidateAdmin(string $username, string $password): ?array
{
    global $pdo;

    if (!$pdo) {
        $users = loadUsers();
        foreach ($users as $user) {
            if (($user['username'] ?? '') === $username && ($user['password'] ?? '') === $password) {
                return $user;
            }
        }
        return null;
    }

    $stmt = $pdo->prepare('SELECT * FROM admins WHERE username = :username AND password = :password LIMIT 1');
    $stmt->execute([':username' => $username, ':password' => $password]);
    $user = $stmt->fetch();
    return $user ?: null;
}
