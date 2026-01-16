<?php
require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Model;
use App\Helpers\Env;

Env::load(__DIR__ . '/.env');

try {
    $pdo = Model::getConnection();
    echo "✅ Database connection successful!\n";
    
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "ℹ️ No tables found in the database.\n";
    } else {
        echo "📁 Existing tables:\n";
        foreach ($tables as $table) {
            echo "  - $table\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
