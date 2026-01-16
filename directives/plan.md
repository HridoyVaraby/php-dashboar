# Implementation Plan: Port Next.js Admin Dashboard to Native PHP

## Overview

This plan details the technical approach to port a Next.js admin dashboard to a stand-alone native PHP boilerplate. The goal is **pixel-perfect replication** of the UI and **full feature parity** with the source application.

---

## User Decisions (Confirmed)

| Decision | Choice |
|----------|--------|
| **Database** | MySQL (new database) |
| **Image Storage** | Local file storage (`/uploads/`) |
| **Rich Text Editor** | TinyMCE |
| **Deployment Target** | cPanel (shared hosting) |
| **Composer** | Use for development, but deployment must work via FTP/file upload without requiring Composer on server |

---

## Phase 1: Project Foundation

### 1.1 Directory Structure

#### [NEW] `backend/` (Complete project)

Create the following structure:

```
backend/
├── public/                    # Document root (point cPanel here)
│   ├── index.php              # Front controller
│   ├── .htaccess              # Apache URL rewriting
│   ├── css/
│   │   └── style.css          # Compiled Tailwind output
│   ├── js/
│   │   └── app.js             # Custom JavaScript
│   ├── uploads/               # User uploaded files
│   │   ├── images/
│   │   └── thumbnails/
│   └── assets/
│       ├── Icon.svg           # Copied from source
│       └── logo.svg           # Copied from source
├── src/
│   ├── Router.php             # URL routing
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── PostController.php
│   │   ├── CategoryController.php
│   │   ├── TagController.php
│   │   ├── UserController.php
│   │   ├── CommentController.php
│   │   ├── VideoController.php
│   │   ├── OpinionController.php
│   │   ├── NewsletterController.php
│   │   ├── AdController.php
│   │   ├── ProfileController.php
│   │   └── SettingsController.php
│   ├── Models/
│   │   ├── Model.php          # Base model class
│   │   ├── User.php
│   │   ├── Post.php
│   │   ├── Category.php
│   │   ├── Subcategory.php
│   │   ├── Tag.php
│   │   ├── Comment.php
│   │   ├── Video.php
│   │   ├── Opinion.php
│   │   ├── NewsletterSubscriber.php
│   │   ├── Advertisement.php
│   │   └── SiteSettings.php
│   ├── Middleware/
│   │   └── AuthMiddleware.php
│   └── Helpers/
│       ├── Auth.php
│       ├── CSRF.php
│       ├── Sanitizer.php
│       ├── FileUpload.php
│       └── DateHelper.php
├── views/
│   ├── layouts/
│   │   └── admin_layout.php
│   ├── components/
│   │   ├── sidebar.php
│   │   ├── header.php
│   │   ├── pagination.php
│   │   ├── table.php
│   │   ├── card.php
│   │   ├── button.php
│   │   ├── badge.php
│   │   ├── input.php
│   │   ├── select.php
│   │   ├── modal.php
│   │   └── toast.php
│   ├── auth/
│   │   └── login.php
│   └── admin/
│       ├── dashboard.php
│       ├── posts/
│       │   ├── index.php
│       │   ├── create.php
│       │   └── edit.php
│       ├── categories/
│       ├── subcategories/
│       ├── tags/
│       ├── comments/
│       ├── videos/
│       ├── opinions/
│       ├── users/
│       ├── newsletter/
│       ├── ads/
│       ├── profile/
│       └── settings/
├── config/
│   ├── app.php                # App configuration
│   └── database.php           # Database connection (MySQL)
├── vendor/                    # Composer dependencies (committed to repo)
├── composer.json              # PHP autoloading (PSR-4)
├── package.json               # pnpm for Tailwind (dev only)
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── schema.sql                 # MySQL database schema
└── README.md                  # Deployment instructions
```

### 1.2 Deployment Strategy (cPanel Compatible)

**Development Workflow:**
1. Use Composer locally for PSR-4 autoloading
2. Commit `vendor/` folder to repository
3. Use pnpm locally to compile Tailwind CSS
4. Commit compiled `public/css/style.css`

**Deployment:**
1. Upload entire `backend/` folder via FTP or cPanel File Manager
2. Point domain to `backend/public/` directory
3. Import `schema.sql` via phpMyAdmin
4. Edit `config/database.php` with MySQL credentials
5. Set file permissions on `public/uploads/` to 755

> [!NOTE]
> No SSH, Composer, or Node.js required on the server. Pure FTP deployment.

---

### 1.3 Tailwind CSS Setup

#### [NEW] `backend/package.json`

```json
{
  "name": "php-admin-dashboard",
  "private": true,
  "scripts": {
    "dev": "tailwindcss -i ./src/input.css -o ./public/css/style.css --watch",
    "build": "tailwindcss -i ./src/input.css -o ./public/css/style.css --minify"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.18",
    "@tailwindcss/typography": "^0.5.19",
    "autoprefixer": "^10.4.22",
    "postcss": "^8.5.6"
  }
}
```

#### [NEW] `backend/tailwind.config.js`

Converted from the TypeScript source with identical theme configuration:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./views/**/*.php",
    "./public/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        bangla: ["Noto Serif Bengali", "serif"],
        "bangla-sans": ["Noto Sans Bengali", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

#### [NEW] `backend/src/input.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

@layer base {
  body {
    @apply bg-background text-foreground font-bangla;
    font-size: 1.125rem;
  }
}

/* shadcn/ui component classes */
@layer components {
  /* Buttons */
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50;
  }
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2;
  }
  .btn-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2;
  }
  .btn-ghost {
    @apply hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2;
  }
  .btn-destructive {
    @apply bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2;
  }
  .btn-outline {
    @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2;
  }
  .btn-sm {
    @apply h-9 rounded-md px-3;
  }
  .btn-icon {
    @apply h-10 w-10;
  }

  /* Cards */
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
  .card-header {
    @apply flex flex-col space-y-1.5 p-6;
  }
  .card-title {
    @apply text-2xl font-semibold leading-none tracking-tight;
  }
  .card-description {
    @apply text-sm text-muted-foreground;
  }
  .card-content {
    @apply p-6 pt-0;
  }
  .card-footer {
    @apply flex items-center p-6 pt-0;
  }

  /* Inputs */
  .input {
    @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }

  /* Labels */
  .label {
    @apply text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70;
  }

  /* Badges */
  .badge {
    @apply inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
  }
  .badge-default {
    @apply border-transparent bg-primary text-primary-foreground hover:bg-primary/80;
  }
  .badge-secondary {
    @apply border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80;
  }
  .badge-destructive {
    @apply border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80;
  }
  .badge-outline {
    @apply text-foreground;
  }

  /* Tables */
  .table-wrapper {
    @apply w-full overflow-auto;
  }
  .table {
    @apply w-full caption-bottom text-sm;
  }
  .table thead {
    @apply bg-gray-50 border-b border-gray-200;
  }
  .table th {
    @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
  }
  .table tbody {
    @apply divide-y divide-gray-200;
  }
  .table td {
    @apply px-6 py-4;
  }
  .table tr:hover {
    @apply bg-gray-50;
  }

  /* Select */
  .select-trigger {
    @apply flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
  }
}
```

---

### 1.4 Router Implementation

#### [NEW] `backend/src/Router.php`

```php
<?php
namespace App;

class Router {
    private array $routes = [];
    private array $middleware = [];
    
    public function get(string $path, callable|array $handler, array $middleware = []): self
    {
        $this->addRoute('GET', $path, $handler, $middleware);
        return $this;
    }
    
    public function post(string $path, callable|array $handler, array $middleware = []): self
    {
        $this->addRoute('POST', $path, $handler, $middleware);
        return $this;
    }
    
    private function addRoute(string $method, string $path, callable|array $handler, array $middleware): void
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'middleware' => $middleware,
        ];
    }
    
    public function dispatch(string $method, string $uri): mixed
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;
            
            $params = $this->matchRoute($route['path'], $uri);
            if ($params !== null) {
                // Run middleware
                foreach ($route['middleware'] as $mw) {
                    if (!$mw::handle()) {
                        return null; // Middleware handles redirect
                    }
                }
                
                // Call handler
                if (is_array($route['handler'])) {
                    [$class, $method] = $route['handler'];
                    $controller = new $class();
                    return $controller->$method(...$params);
                }
                return ($route['handler'])(...$params);
            }
        }
        
        // 404
        http_response_code(404);
        include __DIR__ . '/../views/errors/404.php';
        return null;
    }
    
    private function matchRoute(string $pattern, string $uri): ?array
    {
        $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $pattern);
        $pattern = '#^' . $pattern . '$#';
        
        if (preg_match($pattern, $uri, $matches)) {
            return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        }
        return null;
    }
}
```

#### [NEW] `backend/public/index.php`

```php
<?php
declare(strict_types=1);

// Secure session configuration
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => isset($_SERVER['HTTPS']),
    'cookie_samesite' => 'Strict',
    'use_strict_mode' => true,
]);

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Load configuration
$config = require __DIR__ . '/../config/app.php';

// Initialize router
$router = new App\Router();

// Load routes
require_once __DIR__ . '/../config/routes.php';

// Get request details
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path if needed
$basePath = $config['base_path'] ?? '';
if ($basePath && str_starts_with($uri, $basePath)) {
    $uri = substr($uri, strlen($basePath));
}

// Dispatch request
$router->dispatch($method, $uri ?: '/');
```

#### [NEW] `backend/public/.htaccess`

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Redirect to HTTPS (optional, uncomment for production)
    # RewriteCond %{HTTPS} off
    # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Handle front controller pattern
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
    
    # Protect sensitive files
    <FilesMatch "^\.">
        Order allow,deny
        Deny from all
    </FilesMatch>
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

### 1.5 Database Setup (MySQL)

#### [NEW] `backend/config/database.php`

```php
<?php
return [
    'driver' => 'mysql',
    'host' => 'localhost',
    'port' => 3306,
    'database' => 'php_admin_dashboard',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];
```

#### [NEW] `backend/schema.sql`

MySQL schema converted from Prisma PostgreSQL schema:

```sql
-- MySQL Schema for PHP Admin Dashboard
-- Converted from Prisma/PostgreSQL

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Users/Profiles table
CREATE TABLE `profiles` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(500) NULL,
    `role` ENUM('ADMIN', 'EDITOR', 'READER') NOT NULL DEFAULT 'READER',
    `is_suspended` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_profiles_email` (`email`),
    INDEX `idx_profiles_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE `categories` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subcategories table
CREATE TABLE `subcategories` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `parent_category_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_subcategories_parent` (`parent_category_id`),
    FOREIGN KEY (`parent_category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags table
CREATE TABLE `tags` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_tags_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Posts table
CREATE TABLE `posts` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `title` VARCHAR(500) NOT NULL,
    `subtitle` VARCHAR(500) NULL,
    `content` LONGTEXT NOT NULL,
    `excerpt` TEXT NULL,
    `featured_image` VARCHAR(500) NULL,
    `category_id` CHAR(36) NOT NULL,
    `subcategory_id` CHAR(36) NULL,
    `author_id` CHAR(36) NOT NULL,
    `status` ENUM('PUBLISHED', 'DRAFT') NOT NULL DEFAULT 'PUBLISHED',
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `featured_position` INT NULL,
    `view_count` INT NOT NULL DEFAULT 0,
    `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_posts_category` (`category_id`),
    INDEX `idx_posts_author` (`author_id`),
    INDEX `idx_posts_status` (`status`),
    INDEX `idx_posts_published` (`published_at` DESC),
    INDEX `idx_posts_featured` (`is_featured`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`author_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Post-Category many-to-many
CREATE TABLE `post_categories` (
    `post_id` CHAR(36) NOT NULL,
    `category_id` CHAR(36) NOT NULL,
    PRIMARY KEY (`post_id`, `category_id`),
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Post-Tag junction table
CREATE TABLE `post_tags` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `post_id` CHAR(36) NOT NULL,
    `tag_id` CHAR(36) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_post_tag` (`post_id`, `tag_id`),
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Videos table
CREATE TABLE `videos` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `video_url` VARCHAR(500) NOT NULL,
    `thumbnail` VARCHAR(500) NULL,
    `featured_position` INT NULL,
    `author_id` CHAR(36) NOT NULL,
    `view_count` INT NOT NULL DEFAULT 0,
    `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_videos_author` (`author_id`),
    FOREIGN KEY (`author_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Opinions table
CREATE TABLE `opinions` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `title` VARCHAR(500) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NOT NULL,
    `author_name` VARCHAR(255) NOT NULL,
    `author_role` VARCHAR(255) NULL,
    `author_image` VARCHAR(500) NULL,
    `created_by` CHAR(36) NULL,
    `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`created_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments table
CREATE TABLE `comments` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `post_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `parent_id` CHAR(36) NULL,
    `content` TEXT NOT NULL,
    `is_approved` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_comments_post` (`post_id`),
    INDEX `idx_comments_user` (`user_id`),
    INDEX `idx_comments_approved` (`is_approved`),
    FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter subscribers table
CREATE TABLE `newsletter_subscribers` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advertisements table
CREATE TABLE `advertisements` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `title` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `link_url` VARCHAR(500) NOT NULL,
    `location` VARCHAR(100) NOT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site settings table
CREATE TABLE `site_settings` (
    `id` CHAR(36) NOT NULL DEFAULT (UUID()),
    `site_name` VARCHAR(255) NOT NULL DEFAULT 'NewsViewBD',
    `site_description` VARCHAR(500) NOT NULL DEFAULT 'বাংলাদেশের অগ্রণী সংবাদ পোর্টাল',
    `site_url` VARCHAR(255) NOT NULL DEFAULT 'https://newsviewbd.com',
    `logo_url` VARCHAR(255) NOT NULL DEFAULT '/logo.svg',
    `favicon_url` VARCHAR(255) NOT NULL DEFAULT '/favicon.ico',
    `contact_email` VARCHAR(255) NOT NULL DEFAULT 'contact@newsviewbd.com',
    `social_facebook` VARCHAR(255) NOT NULL DEFAULT '',
    `social_twitter` VARCHAR(255) NOT NULL DEFAULT '',
    `social_youtube` VARCHAR(255) NOT NULL DEFAULT '',
    `enable_comments` TINYINT(1) NOT NULL DEFAULT 1,
    `enable_newsletter` TINYINT(1) NOT NULL DEFAULT 1,
    `maintenance_mode` TINYINT(1) NOT NULL DEFAULT 0,
    `posts_per_page` INT NOT NULL DEFAULT 10,
    `enable_ads` TINYINT(1) NOT NULL DEFAULT 1,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO `profiles` (`id`, `full_name`, `email`, `password`, `role`) VALUES
(UUID(), 'Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');

-- Insert default site settings
INSERT INTO `site_settings` (`id`) VALUES (UUID());

SET FOREIGN_KEY_CHECKS = 1;
```

#### [NEW] `backend/src/Models/Model.php`

```php
<?php
namespace App\Models;

use PDO;
use PDOException;

abstract class Model {
    protected static ?PDO $pdo = null;
    protected string $table;
    protected string $primaryKey = 'id';
    
    public static function getConnection(): PDO
    {
        if (self::$pdo === null) {
            $config = require __DIR__ . '/../../config/database.php';
            
            $dsn = sprintf(
                '%s:host=%s;port=%d;dbname=%s;charset=%s',
                $config['driver'],
                $config['host'],
                $config['port'],
                $config['database'],
                $config['charset']
            );
            
            try {
                self::$pdo = new PDO($dsn, $config['username'], $config['password'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                throw new PDOException('Database connection failed: ' . $e->getMessage());
            }
        }
        return self::$pdo;
    }
    
    public function find(string $id): ?array
    {
        $stmt = self::getConnection()->prepare(
            "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?"
        );
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    public function all(array $where = [], int $limit = 0, int $offset = 0, string $orderBy = 'created_at DESC'): array
    {
        $sql = "SELECT * FROM {$this->table}";
        $params = [];
        
        if (!empty($where)) {
            $conditions = [];
            foreach ($where as $key => $value) {
                $conditions[] = "$key = ?";
                $params[] = $value;
            }
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
        
        $sql .= " ORDER BY $orderBy";
        
        if ($limit > 0) {
            $sql .= " LIMIT $limit";
            if ($offset > 0) {
                $sql .= " OFFSET $offset";
            }
        }
        
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function create(array $data): string
    {
        $data['id'] = $this->generateUuid();
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        
        $stmt = self::getConnection()->prepare(
            "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)"
        );
        $stmt->execute(array_values($data));
        
        return $data['id'];
    }
    
    public function update(string $id, array $data): bool
    {
        $sets = [];
        $params = [];
        foreach ($data as $key => $value) {
            $sets[] = "$key = ?";
            $params[] = $value;
        }
        $params[] = $id;
        
        $stmt = self::getConnection()->prepare(
            "UPDATE {$this->table} SET " . implode(', ', $sets) . 
            " WHERE {$this->primaryKey} = ?"
        );
        return $stmt->execute($params);
    }
    
    public function delete(string $id): bool
    {
        $stmt = self::getConnection()->prepare(
            "DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?"
        );
        return $stmt->execute([$id]);
    }
    
    public function count(array $where = []): int
    {
        $sql = "SELECT COUNT(*) FROM {$this->table}";
        $params = [];
        
        if (!empty($where)) {
            $conditions = [];
            foreach ($where as $key => $value) {
                $conditions[] = "$key = ?";
                $params[] = $value;
            }
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
        
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }
    
    protected function generateUuid(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
```

---

### 1.6 Authentication System

#### [NEW] `backend/src/Controllers/AuthController.php`

```php
<?php
namespace App\Controllers;

use App\Models\User;
use App\Helpers\CSRF;
use App\Helpers\Sanitizer;

class AuthController {
    public function showLogin(): void
    {
        // If already logged in, redirect to admin
        if (isset($_SESSION['user'])) {
            header('Location: /admin');
            exit;
        }
        
        $csrfToken = CSRF::generate();
        include __DIR__ . '/../../views/auth/login.php';
    }
    
    public function login(): void
    {
        // Verify CSRF
        if (!CSRF::verify($_POST['csrf_token'] ?? '')) {
            $_SESSION['error'] = 'Invalid security token. Please try again.';
            header('Location: /auth');
            exit;
        }
        
        $email = Sanitizer::email($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            $_SESSION['error'] = 'Email and password are required.';
            header('Location: /auth');
            exit;
        }
        
        $userModel = new User();
        $user = $userModel->findByEmail($email);
        
        if (!$user || !password_verify($password, $user['password'])) {
            $_SESSION['error'] = 'Invalid email or password.';
            header('Location: /auth');
            exit;
        }
        
        if ($user['is_suspended']) {
            $_SESSION['error'] = 'Your account has been suspended.';
            header('Location: /auth');
            exit;
        }
        
        if (!in_array($user['role'], ['ADMIN', 'EDITOR'])) {
            $_SESSION['error'] = 'You do not have permission to access the admin panel.';
            header('Location: /auth');
            exit;
        }
        
        // Regenerate session ID to prevent fixation
        session_regenerate_id(true);
        
        // Store user in session
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['full_name'],
            'role' => $user['role'],
            'avatar' => $user['avatar_url'],
        ];
        
        header('Location: /admin');
        exit;
    }
    
    public function logout(): void
    {
        session_destroy();
        header('Location: /auth');
        exit;
    }
}
```

#### [NEW] `backend/src/Middleware/AuthMiddleware.php`

```php
<?php
namespace App\Middleware;

class AuthMiddleware {
    public static function handle(): bool
    {
        if (!isset($_SESSION['user'])) {
            header('Location: /auth');
            exit;
        }
        
        $role = $_SESSION['user']['role'] ?? '';
        if (!in_array($role, ['ADMIN', 'EDITOR'])) {
            header('Location: /auth');
            exit;
        }
        
        return true;
    }
}
```

---

### 1.7 File Upload Helper

#### [NEW] `backend/src/Helpers/FileUpload.php`

```php
<?php
namespace App\Helpers;

class FileUpload {
    private static array $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    private static int $maxSize = 5 * 1024 * 1024; // 5MB
    
    public static function uploadImage(array $file, string $directory = 'images'): ?string
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }
        
        if (!in_array($file['type'], self::$allowedImageTypes)) {
            return null;
        }
        
        if ($file['size'] > self::$maxSize) {
            return null;
        }
        
        $uploadDir = __DIR__ . '/../../public/uploads/' . $directory . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $destination = $uploadDir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return '/uploads/' . $directory . '/' . $filename;
        }
        
        return null;
    }
    
    public static function delete(string $path): bool
    {
        $fullPath = __DIR__ . '/../../public' . $path;
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return false;
    }
}
```

---

## Phase 2: Admin Layout & Components

### 2.1 Admin Layout

#### [NEW] `backend/views/layouts/admin_layout.php`

Replicates the Next.js admin layout with:
- Sidebar (collapsible)
- Sticky header with sidebar trigger
- Main content area with `bg-gray-50`
- Lucide icons via CDN
- TinyMCE inclusion for editor pages

### 2.2 TinyMCE Integration

#### TinyMCE Setup

Include via CDN in layout when needed:

```html
<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
<script>
  tinymce.init({
    selector: 'textarea.rich-editor',
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    height: 500,
    language: 'bn_BD', // Bengali language
  });
</script>
```

---

## Phase 3: Route Definitions

#### [NEW] `backend/config/routes.php`

```php
<?php
use App\Controllers\*;
use App\Middleware\AuthMiddleware;

// Public routes
$router->get('/auth', [AuthController::class, 'showLogin']);
$router->post('/auth', [AuthController::class, 'login']);
$router->get('/logout', [AuthController::class, 'logout']);

// Protected admin routes
$router->get('/admin', [DashboardController::class, 'index'], [AuthMiddleware::class]);

// Posts
$router->get('/admin/posts', [PostController::class, 'index'], [AuthMiddleware::class]);
$router->get('/admin/posts/create', [PostController::class, 'create'], [AuthMiddleware::class]);
$router->post('/admin/posts/create', [PostController::class, 'store'], [AuthMiddleware::class]);
$router->get('/admin/posts/edit/{id}', [PostController::class, 'edit'], [AuthMiddleware::class]);
$router->post('/admin/posts/edit/{id}', [PostController::class, 'update'], [AuthMiddleware::class]);
$router->post('/admin/posts/delete/{id}', [PostController::class, 'destroy'], [AuthMiddleware::class]);

// Categories
$router->get('/admin/categories', [CategoryController::class, 'index'], [AuthMiddleware::class]);
$router->post('/admin/categories', [CategoryController::class, 'store'], [AuthMiddleware::class]);
$router->get('/admin/categories/edit/{id}', [CategoryController::class, 'edit'], [AuthMiddleware::class]);
$router->post('/admin/categories/edit/{id}', [CategoryController::class, 'update'], [AuthMiddleware::class]);
$router->post('/admin/categories/delete/{id}', [CategoryController::class, 'destroy'], [AuthMiddleware::class]);

// Subcategories
$router->get('/admin/subcategories', [SubcategoryController::class, 'index'], [AuthMiddleware::class]);
// ... similar pattern

// Tags
$router->get('/admin/tags', [TagController::class, 'index'], [AuthMiddleware::class]);
// ... similar pattern

// Comments
$router->get('/admin/comments', [CommentController::class, 'index'], [AuthMiddleware::class]);
$router->post('/admin/comments/approve/{id}', [CommentController::class, 'approve'], [AuthMiddleware::class]);
$router->post('/admin/comments/delete/{id}', [CommentController::class, 'destroy'], [AuthMiddleware::class]);

// Videos
$router->get('/admin/videos', [VideoController::class, 'index'], [AuthMiddleware::class]);
$router->get('/admin/videos/create', [VideoController::class, 'create'], [AuthMiddleware::class]);
$router->post('/admin/videos/create', [VideoController::class, 'store'], [AuthMiddleware::class]);
$router->get('/admin/videos/edit/{id}', [VideoController::class, 'edit'], [AuthMiddleware::class]);
$router->post('/admin/videos/edit/{id}', [VideoController::class, 'update'], [AuthMiddleware::class]);
$router->post('/admin/videos/delete/{id}', [VideoController::class, 'destroy'], [AuthMiddleware::class]);

// Opinions
$router->get('/admin/opinions', [OpinionController::class, 'index'], [AuthMiddleware::class]);
// ... similar pattern

// Users
$router->get('/admin/users', [UserController::class, 'index'], [AuthMiddleware::class]);
$router->post('/admin/users', [UserController::class, 'store'], [AuthMiddleware::class]);
$router->post('/admin/users/update/{id}', [UserController::class, 'update'], [AuthMiddleware::class]);
$router->post('/admin/users/delete/{id}', [UserController::class, 'destroy'], [AuthMiddleware::class]);

// Newsletter
$router->get('/admin/newsletter', [NewsletterController::class, 'index'], [AuthMiddleware::class]);

// Ads
$router->get('/admin/ads', [AdController::class, 'index'], [AuthMiddleware::class]);
$router->get('/admin/ads/create', [AdController::class, 'create'], [AuthMiddleware::class]);
$router->post('/admin/ads/create', [AdController::class, 'store'], [AuthMiddleware::class]);
$router->get('/admin/ads/edit/{id}', [AdController::class, 'edit'], [AuthMiddleware::class]);
$router->post('/admin/ads/edit/{id}', [AdController::class, 'update'], [AuthMiddleware::class]);
$router->post('/admin/ads/delete/{id}', [AdController::class, 'destroy'], [AuthMiddleware::class]);

// Profile
$router->get('/admin/profile', [ProfileController::class, 'index'], [AuthMiddleware::class]);
$router->post('/admin/profile', [ProfileController::class, 'update'], [AuthMiddleware::class]);

// Settings
$router->get('/admin/settings', [SettingsController::class, 'index'], [AuthMiddleware::class]);
$router->post('/admin/settings', [SettingsController::class, 'update'], [AuthMiddleware::class]);

// File uploads (AJAX)
$router->post('/admin/upload/image', [MediaController::class, 'uploadImage'], [AuthMiddleware::class]);
```

---

## Verification Plan

### Local Development

```bash
# 1. Install PHP dependencies (development only)
cd backend
composer install

# 2. Install Node dependencies and build CSS
pnpm install
pnpm run build

# 3. Import database schema
mysql -u root -p < schema.sql

# 4. Start PHP development server
cd public
php -S localhost:8000

# 5. Access admin panel
# http://localhost:8000/auth
# Login: admin@example.com / admin123
```

### Production Deployment (cPanel)

1. Upload `backend/` folder via FTP
2. Point domain to `backend/public/`
3. Create MySQL database via phpMyAdmin
4. Import `schema.sql`
5. Edit `config/database.php` with credentials
6. Set `public/uploads/` permissions to 755
7. Access `/auth` and login

### Testing Checklist

- [ ] Login/logout flow
- [ ] Session persistence
- [ ] All sidebar links work
- [ ] Dashboard stats load
- [ ] Posts CRUD operations
- [ ] Image upload/delete
- [ ] Pagination works
- [ ] Filters work
- [ ] Mobile responsive

---

## Implementation Order

1. **Foundation** (Phase 1.1-1.7) - ~2-3 hours
   - Directory structure
   - Tailwind setup
   - Router
   - Database models
   - Auth system

2. **Layout & Login** (~1-2 hours)
   - Admin layout template
   - Sidebar component
   - Login page

3. **Dashboard** (~1 hour)
   - Stats queries
   - Quick actions
   - Recent activity

4. **Posts CRUD** (~2-3 hours)
   - List with pagination
   - Create form with TinyMCE
   - Edit form
   - Delete

5. **Other Modules** (~3-4 hours each)
   - Categories
   - Users
   - Videos
   - Opinions
   - Comments
   - etc.

**Total Estimated Time**: 15-20 hours
