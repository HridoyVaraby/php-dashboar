<?php
require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Model;
use App\Helpers\Env;

Env::load(__DIR__ . '/.env');

try {
    $pdo = Model::getConnection();
    echo "✅ Database connection successful!\n";

    // 1. Create Tables
    echo "🏗️ Creating tables...\n";

    $sql = "
    CREATE TABLE IF NOT EXISTS profiles (
        id CHAR(36) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        role ENUM('ADMIN', 'EDITOR', 'READER') DEFAULT 'READER',
        is_suspended BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subcategories (
        id CHAR(36) PRIMARY KEY,
        parent_category_id CHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(255),
        category_id CHAR(36) NOT NULL,
        subcategory_id CHAR(36),
        author_id CHAR(36) NOT NULL,
        status ENUM('PUBLISHED', 'DRAFT') DEFAULT 'PUBLISHED',
        is_featured BOOLEAN DEFAULT FALSE,
        featured_position INT,
        view_count INT DEFAULT 0,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
        FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS post_tags (
        id CHAR(36) PRIMARY KEY,
        post_id CHAR(36) NOT NULL,
        tag_id CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS videos (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        featured_position INT,
        author_id CHAR(36) NOT NULL,
        view_count INT DEFAULT 0,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS opinions (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_role VARCHAR(255),
        author_image VARCHAR(255),
        created_by CHAR(36),
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
        id CHAR(36) PRIMARY KEY,
        post_id CHAR(36) NOT NULL,
        user_id CHAR(36) NOT NULL,
        parent_id CHAR(36),
        content TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS advertisements (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        link_url VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
        id CHAR(36) PRIMARY KEY,
        site_name VARCHAR(255) DEFAULT 'NewsViewBD',
        site_description TEXT,
        site_url VARCHAR(255) DEFAULT 'https://newsviewbd.com',
        logo_url VARCHAR(255) DEFAULT '/logo.svg',
        favicon_url VARCHAR(255) DEFAULT '/favicon.ico',
        contact_email VARCHAR(255) DEFAULT 'contact@newsviewbd.com',
        social_facebook VARCHAR(255) DEFAULT '',
        social_twitter VARCHAR(255) DEFAULT '',
        social_youtube VARCHAR(255) DEFAULT '',
        enable_comments BOOLEAN DEFAULT TRUE,
        enable_newsletter BOOLEAN DEFAULT TRUE,
        maintenance_mode BOOLEAN DEFAULT FALSE,
        posts_per_page INT DEFAULT 10,
        enable_ads BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    ";

    $pdo->exec($sql);
    echo "✅ Tables created successfully!\n";

    // 2. Seed Data
    echo "🌱 Seeding data...\n";

    function uuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    // Default Admin
    $adminId = uuid();
    $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT IGNORE INTO profiles (id, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$adminId, 'Admin User', 'admin@example.com', $hashedPassword, 'ADMIN']);

    // Default Category
    $catId = uuid();
    $stmt = $pdo->prepare("INSERT IGNORE INTO categories (id, name, slug) VALUES (?, ?, ?)");
    $stmt->execute([$catId, 'জাতীয়', 'national']);

    // Default Site Settings
    $settingsId = uuid();
    $stmt = $pdo->prepare("INSERT IGNORE INTO site_settings (id, site_name) VALUES (?, ?)");
    $stmt->execute([$settingsId, 'NewsViewBD Admin']);

    echo "✅ Seeding completed!\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
