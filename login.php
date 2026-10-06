<?php
require __DIR__ . '/includes/config.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    $user = dbValidateAdmin($username, $password);
    if ($user) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $user['name'] ?? $username;
        header('Location: /admin.php');
        exit;
    }

    $error = 'Username atau password salah.';
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin</title>
    <style>
        body { margin:0; font-family: Inter, sans-serif; background:#f3f3f1; display:grid; place-items:center; min-height:100vh; }
        .panel { width:min(420px, calc(100% - 32px)); background:#fff; border:1px solid #e5e5e5; border-radius:20px; padding:28px; }
        h1 { margin-top: 0; }
        form { display:grid; gap:14px; }
        input { width:100%; padding:12px 14px; border:1px solid #ddd; border-radius:12px; }
        button { background:#111; color:#fff; border:0; padding:12px; border-radius:12px; font-weight:700; cursor:pointer; }
        .error { color:#b00020; font-size:14px; }
        .link { margin-top: 12px; display:block; text-align:center; color:#666; }
    </style>
</head>
<body>
    <div class="panel">
        <h1>Login Admin</h1>
        <?php if ($error !== ''): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        <form method="post">
            <div>
                <label>Username</label>
                <input type="text" name="username" required>
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit">Masuk</button>
        </form>
        <a class="link" href="/index.php">Kembali ke toko</a>
    </div>
</body>
</html>
