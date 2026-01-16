# Project Context: PHP Admin Dashboard Port

## Overview

This project involves porting a Next.js admin dashboard to a **stand-alone Native PHP Admin Dashboard Boilerplate**. The goal is to create a pixel-perfect replica of the Next.js admin panel that can serve as a reusable template for future PHP projects.

## Source Project Analysis

### Technology Stack (Next.js Source)

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Styling** | Tailwind CSS 3.4.18 |
| **Icons** | Lucide React |
| **State Management** | TanStack React Query |
| **Authentication** | NextAuth v4.24.13 (JWT + Credentials) |
| **Database ORM** | Prisma 5.22.0 |
| **Database** | PostgreSQL |
| **Validation** | Zod |

### Admin Routes Inventory

| Route | Description | Type |
|-------|-------------|------|
| `/admin` | Dashboard home with stats & quick actions | Read |
| `/admin/posts` | Posts listing with pagination & filters | CRUD |
| `/admin/posts/create` | Create new post | Create |
| `/admin/posts/edit/[id]` | Edit existing post | Update |
| `/admin/videos` | Videos listing | CRUD |
| `/admin/videos/create` | Create new video | Create |
| `/admin/videos/edit/[id]` | Edit existing video | Update |
| `/admin/opinions` | Opinions/editorials listing | CRUD |
| `/admin/opinions/create` | Create new opinion | Create |
| `/admin/opinions/edit/[id]` | Edit existing opinion | Update |
| `/admin/categories` | Categories management | CRUD |
| `/admin/categories/edit/[id]` | Edit category | Update |
| `/admin/subcategories` | Subcategories management | CRUD |
| `/admin/tags` | Tags management | CRUD |
| `/admin/comments` | Comments moderation | CRUD |
| `/admin/users` | User management | CRUD |
| `/admin/newsletter` | Newsletter subscribers | Read |
| `/admin/ads` | Advertisements management | CRUD |
| `/admin/ads/create` | Create new ad | Create |
| `/admin/ads/edit/[id]` | Edit existing ad | Update |
| `/admin/profile` | User profile settings | Update |
| `/admin/settings` | Site settings | Update |

### Admin Components Inventory

| Component | File | Purpose |
|-----------|------|---------|
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Navigation sidebar with menu items |
| `AdminLayout` | `app/admin/layout.tsx` | Main admin wrapper with auth guard |
| `RichTextEditor` | `components/admin/RichTextEditor.tsx` | WYSIWYG content editor |
| `ImageUpload` | `components/admin/ImageUpload.tsx` | Image upload component |
| `EditorImageDialog` | `components/admin/EditorImageDialog.tsx` | Image picker for editor |
| `SubcategoriesManagement` | `components/admin/SubcategoriesManagement.tsx` | Subcategory CRUD UI |

### shadcn/ui Components Used (43 total)

Key components that need PHP/HTML equivalents:
- `Button`, `Input`, `Label`, `Textarea`
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`
- `AlertDialog` (confirmation dialogs)
- `Badge`, `Checkbox`, `Switch`
- `Sidebar`, `SidebarProvider`, `SidebarInset`, `SidebarTrigger`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Toast`, `Toaster`
- `Dropdown Menu`
- `Pagination`
- `Skeleton` (loading states)

### Database Schema (Prisma Models)

| Model | Purpose | Fields (key) |
|-------|---------|--------------|
| `Profile` | Users | id, fullName, email, password, role, isSuspended |
| `Category` | Categories | id, name, slug |
| `Subcategory` | Subcategories | id, parentCategoryId, name, slug |
| `Tag` | Post tags | id, name, slug |
| `Post` | News articles | id, title, content, categoryId, authorId, status, viewCount |
| `PostTag` | Post-Tag junction | postId, tagId |
| `Video` | Videos | id, title, videoUrl, thumbnail, authorId |
| `Opinion` | Editorials | id, title, content, authorName |
| `Comment` | User comments | id, postId, userId, content, isApproved |
| `NewsletterSubscriber` | Newsletter | id, email |
| `Advertisement` | Ads | id, title, imageUrl, linkUrl, location, isActive |
| `SiteSettings` | Site config | siteName, siteDescription, etc. |

### Authentication Logic

- **Strategy**: JWT-based sessions via NextAuth
- **Provider**: Credentials (email + password)
- **Password**: bcryptjs hashing
- **Roles**: ADMIN, EDITOR, READER
- **Admin Access**: Only ADMIN and EDITOR roles
- **Middleware**: Protects all `/admin/*` routes

### API Endpoints (18 directories)

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth/*` | GET, POST | NextAuth handlers |
| `/api/posts` | GET, POST | List/create posts |
| `/api/posts/[id]` | GET, PATCH, DELETE | Single post CRUD |
| `/api/categories` | GET, POST | Categories |
| `/api/subcategories` | GET, POST | Subcategories |
| `/api/tags` | GET, POST | Tags |
| `/api/videos` | GET, POST | Videos |
| `/api/opinions` | GET, POST | Opinions |
| `/api/comments` | GET, POST | Comments |
| `/api/users` | GET, POST | Users |
| `/api/stats` | GET | Dashboard statistics |
| `/api/recent-activity` | GET | Recent activity log |
| `/api/newsletter` | GET, POST | Newsletter subscribers |
| `/api/ads` | GET, POST | Advertisements |
| `/api/upload` | POST | File uploads |
| `/api/media` | GET | Media library |
| `/api/profile` | GET, PATCH | User profile |
| `/api/settings` | GET, PATCH | Site settings |

### Design System

**Font**: Noto Serif Bengali (primary), Noto Sans Bengali (secondary)
**Language**: Bengali (বাংলা)
**Color Scheme**: HSL-based CSS variables (shadcn/ui defaults)
- Background: White (#fff)
- Primary text: Dark slate
- Accent: Blue-500 family
- Status colors: Green (success), Yellow (warning), Red (error)

## Target Project Specification

### Technology Stack (PHP Target)

| Layer | Technology |
|-------|------------|
| **Runtime** | PHP 8.2+ |
| **Package Manager** | pnpm (for Tailwind only) |
| **Styling** | Tailwind CSS (compiled) |
| **Icons** | Lucide (CDN) |
| **Database** | PDO (PostgreSQL) |
| **Authentication** | PHP Sessions |
| **Routing** | Custom lightweight router |
| **Password Hashing** | `password_hash()` / `password_verify()` |

### Folder Structure

```
backend/
├── public/                    # Document root
│   ├── index.php             # Front controller
│   ├── css/
│   │   └── style.css         # Compiled Tailwind
│   ├── js/
│   │   └── app.js            # Custom JS
│   └── assets/               # Static assets
├── src/
│   ├── Controllers/          # Request handlers
│   ├── Models/               # Database models
│   ├── Helpers/              # Utility functions
│   ├── Middleware/           # Auth middleware
│   └── Router.php            # URL router
├── views/
│   ├── layouts/
│   │   └── admin_layout.php  # Main admin wrapper
│   ├── auth/
│   │   └── login.php         # Login page
│   ├── admin/
│   │   ├── dashboard.php
│   │   ├── posts/
│   │   ├── categories/
│   │   └── ...
│   └── components/           # Reusable partials
├── config/
│   ├── db.php                # Database connection
│   └── app.php               # App configuration
├── package.json              # For pnpm/Tailwind
├── tailwind.config.js        # Tailwind config
├── postcss.config.js         # PostCSS config
└── README.md
```

## Design Constraints

1. **Pixel-Perfect Replication**: The PHP version must visually match the Next.js admin
2. **No PHP Framework**: Use native PHP only (no Laravel, Symfony, etc.)
3. **PSR-4 Autoloading**: If using Composer, follow PSR-4 standards
4. **Security First**: All inputs sanitized, prepared statements for SQL
5. **Bengali Language**: Maintain all Bengali text from the source
6. **Responsive**: Must work on mobile and desktop
7. **Modern PHP**: Use PHP 8.2+ features (typed properties, enums, etc.)
