# Product Requirements Document: PHP Admin Dashboard Boilerplate

## Executive Summary

Port the existing Next.js admin dashboard to a **stand-alone, native PHP Admin Dashboard Boilerplate**. The PHP version must be a pixel-perfect replica of the Next.js admin panel in both design and functionality, serving as a reusable template for future PHP-based news portal projects.

---

## 1. Project Goals

### 1.1 Primary Objectives

1. **Pixel-Perfect UI Replication**: The PHP admin panel must visually match the Next.js source
2. **Feature Parity**: All CRUD operations, filters, pagination, and workflows must be replicated
3. **Reusable Boilerplate**: Modular architecture enabling easy adaptation for other projects
4. **Security-First**: Modern PHP security practices (prepared statements, CSRF tokens, input sanitization)
5. **Zero Framework Dependency**: Pure PHP implementation with no Laravel/Symfony dependencies

### 1.2 Success Criteria

- [ ] All 22 admin routes functional
- [ ] Authentication system with role-based access (ADMIN/EDITOR)
- [ ] All CRUD operations working: Posts, Videos, Opinions, Categories, Tags, Users, Ads
- [ ] Responsive design working on mobile and desktop
- [ ] Bengali language UI preserved
- [ ] Tailwind CSS styling matching source exactly

---

## 2. Technical Requirements

### 2.1 Environment

| Requirement | Specification |
|-------------|---------------|
| PHP Version | 8.2+ |
| Database | PostgreSQL (same as source) |
| Web Server | Apache/Nginx with mod_rewrite |
| Package Manager | pnpm (for Tailwind CSS build only) |

### 2.2 Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                       public/index.php                       │
│                      (Front Controller)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Router.php                           │
│              (URL → Controller Mapping)                      │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │  Middleware   │ │  Controller   │ │    Views      │
    │  (Auth Check) │ │  (Business)   │ │  (Templates)  │
    └───────────────┘ └───────────────┘ └───────────────┘
            │                 │
            ▼                 ▼
    ┌───────────────┐ ┌───────────────┐
    │   Session     │ │    Models     │
    │   ($_SESSION) │ │   (PDO/SQL)   │
    └───────────────┘ └───────────────┘
```

### 2.3 Database Schema

Use the **existing PostgreSQL database** from the Next.js project. The PHP application will connect to the same database and use identical table structures.

**Required Tables:**
- `profiles` (users)
- `categories`
- `subcategories`
- `tags`
- `posts`
- `post_tags`
- `videos`
- `opinions`
- `comments`
- `newsletter_subscribers`
- `advertisements`
- `site_settings`

---

## 3. Feature Specifications

### 3.1 Authentication System

#### 3.1.1 Login Page (`/auth`)

| Feature | Description |
|---------|-------------|
| Email/Password Login | Validate credentials against `profiles` table |
| Password Verification | Use `password_verify()` with bcrypt hashes |
| Session Management | PHP native sessions with secure cookie flags |
| Role Check | Only ADMIN/EDITOR roles can access admin |
| Suspended Check | Block suspended users from logging in |
| Remember Me | Optional persistent session |

#### 3.1.2 Session Security

```php
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => true, // HTTPS only
    'cookie_samesite' => 'Strict',
    'use_strict_mode' => true,
]);
```

#### 3.1.3 Auth Middleware

Every admin route must pass through auth middleware that:
1. Checks for valid session
2. Verifies user role is ADMIN or EDITOR
3. Redirects to `/auth` if unauthorized
4. Regenerates session ID on login

### 3.2 Dashboard (`/admin`)

#### 3.2.1 Statistics Cards

| Stat | Source | Icon |
|------|--------|------|
| মোট পোস্ট | `COUNT(posts)` | FileText |
| মোট ভিডিও | `COUNT(videos)` | Video |
| মোট মতামত | `COUNT(opinions)` | TrendingUp |
| মোট মন্তব্য | `COUNT(comments)` | MessageSquare |
| মোট ইউজার | `COUNT(profiles)` | Users |
| ক্যাটেগরি | `COUNT(categories)` | Tag |

#### 3.2.2 Quick Actions

Four action cards linking to:
- `/admin/posts/create` - নতুন পোস্ট তৈরি করুন
- `/admin/videos/create` - নতুন ভিডিও যোগ করুন
- `/admin/comments` - মন্তব্য মডারেট করুন
- `/admin/categories` - ক্যাটেগরি ম্যানেজ করুন

#### 3.2.3 Recent Activity Feed

Display recent items from:
- New posts
- New comments
- New users
- New videos

With time-ago formatting in Bengali (এইমাত্র, ৫ মিনিট আগে, ২ ঘণ্টা আগে)

### 3.3 Posts Management (`/admin/posts`)

#### 3.3.1 List View Features

| Feature | Implementation |
|---------|----------------|
| Pagination | Server-side, 10/20/50/100 per page |
| Search | Title search with `ILIKE` |
| Category Filter | Dropdown with all categories |
| Status Filter | PUBLISHED / DRAFT / All |
| Featured Filter | Featured only toggle |
| Sorting | By date (default), views |

#### 3.3.2 Table Columns

1. শিরোনাম (Title + Author)
2. ক্যাটেগরি (Category badges)
3. স্ট্যাটাস (Published/Draft badge)
4. তারিখ (Bengali formatted date)
5. ভিউ (View count)
6. অ্যাকশন (View, Edit, Delete buttons)

#### 3.3.3 Create/Edit Post

| Field | Type | Required |
|-------|------|----------|
| title | Text | Yes |
| subtitle | Text | No |
| content | Rich Text (WYSIWYG) | Yes |
| excerpt | Textarea | No |
| featuredImage | Image Upload | No |
| categoryIds | Multi-select | Yes (min 1) |
| subcategoryIds | Multi-select | No |
| tagIds | Multi-select | No |
| status | Select (PUBLISHED/DRAFT) | Yes |
| isFeatured | Checkbox | No |
| featuredPosition | Number | No |
| publishedAt | DateTime | No |

### 3.4 Videos Management (`/admin/videos`)

Similar CRUD pattern to Posts with fields:
- title, description, videoUrl, thumbnail, featuredPosition

### 3.5 Opinions Management (`/admin/opinions`)

Similar CRUD pattern with fields:
- title, content, excerpt, authorName, authorRole, authorImage

### 3.6 Categories Management (`/admin/categories`)

| Field | Type |
|-------|------|
| name | Text |
| slug | Auto-generated from name |

With nested subcategories inline management.

### 3.7 Users Management (`/admin/users`)

#### 3.7.1 Features

- List all users with avatar, email, role, status, join date
- Create new user dialog
- Change user role dropdown
- Suspend/Activate user
- Delete user with confirmation

#### 3.7.2 Role Badges

| Role | Badge Color |
|------|-------------|
| ADMIN | Red (`bg-red-100 text-red-800`) |
| EDITOR | Blue (`bg-blue-100 text-blue-800`) |
| READER | Gray (`bg-gray-100 text-gray-800`) |

### 3.8 Comments Moderation (`/admin/comments`)

- List pending comments
- Approve/Reject actions
- Delete with confirmation
- Link to parent post

### 3.9 Other Modules

| Module | Route | Features |
|--------|-------|----------|
| Tags | `/admin/tags` | CRUD tags |
| Newsletter | `/admin/newsletter` | View subscribers |
| Ads | `/admin/ads` | CRUD advertisements |
| Profile | `/admin/profile` | Edit own profile |
| Settings | `/admin/settings` | Site settings |

---

## 4. UI/UX Requirements

### 4.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
├──────────────────┬──────────────────────────────────────────┤
│                  │  ┌────────────────────────────────────┐  │
│   AdminSidebar   │  │        Header (Sticky)             │  │
│                  │  ├────────────────────────────────────┤  │
│   - Logo         │  │                                    │  │
│   - Menu Items   │  │          Main Content              │  │
│   - User Info    │  │                                    │  │
│   - Logout       │  │         (Page-specific)            │  │
│                  │  │                                    │  │
│                  │  │                                    │  │
└──────────────────┴──────────────────────────────────────────┘
```

### 4.2 Sidebar Navigation (Bengali)

```
অ্যাডমিন প্যানেল
───────────────
🏠 ড্যাশবোর্ড        /admin
📄 পোস্টস            /admin/posts
🏷️ ক্যাটেগরি         /admin/categories
📁 সাবক্যাটেগরি       /admin/subcategories
🏷️ ট্যাগস            /admin/tags
💬 মন্তব্য           /admin/comments
🎬 ভিডিও            /admin/videos
✏️ মতামত           /admin/opinions
👥 ইউজার           /admin/users
📧 নিউজলেটার        /admin/newsletter
📊 বিজ্ঞাপন          /admin/ads
👤 প্রোফাইল          /admin/profile
───────────────
[User Name]
[Role]
🚪 লগআউট
```

### 4.3 Color System (CSS Variables)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
```

### 4.4 Typography

| Element | Font | Size |
|---------|------|------|
| Body | Noto Serif Bengali | 1.125rem (18px) |
| Headings | Noto Serif Bengali | Variable |
| UI Labels | Noto Sans Bengali | System |

### 4.5 Component Styling Guidelines

All components must replicate shadcn/ui styling:

#### Buttons

```css
/* Primary */
.btn-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-weight: 500;
}

/* Ghost */
.btn-ghost {
  background: transparent;
}
.btn-ghost:hover {
  background: hsl(var(--accent));
}
```

#### Cards

```css
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
```

#### Tables

```css
.table {
  width: 100%;
  border-collapse: collapse;
}
.table thead {
  background: hsl(210 40% 96.1%);
  border-bottom: 1px solid hsl(var(--border));
}
.table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: hsl(215.4 16.3% 46.9%);
}
.table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid hsl(var(--border));
}
```

---

## 5. Security Requirements

### 5.1 Authentication

- [x] Bcrypt password hashing
- [x] Secure session configuration
- [x] Session regeneration on login
- [x] Role-based access control
- [x] Suspended user blocking

### 5.2 Input Validation

- [x] All user inputs sanitized
- [x] Prepared statements for ALL SQL queries
- [x] CSRF tokens on all forms
- [x] File upload validation (type, size)

### 5.3 Output Encoding

- [x] `htmlspecialchars()` on all output
- [x] Content-Security-Policy headers
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY

---

## 6. Performance Requirements

| Metric | Target |
|--------|--------|
| Page Load (TTFB) | < 200ms |
| Full Page Load | < 1s |
| Database Queries per Page | < 10 |
| CSS Bundle Size | < 50KB (gzipped) |

### Optimization Strategies

1. **Database**: Use pagination, proper indexes
2. **Assets**: Minified CSS, CDN for icons
3. **Caching**: Consider opcache, query caching
4. **Lazy Loading**: Images loaded on scroll

---

## 7. Deliverables

### Phase 1: Foundation (Priority: Critical)

1. [ ] Project structure setup
2. [ ] Tailwind CSS build pipeline
3. [ ] Router implementation
4. [ ] Database connection (PDO)
5. [ ] Session management
6. [ ] Auth middleware
7. [ ] Admin layout template
8. [ ] Login page

### Phase 2: Core Features (Priority: High)

1. [ ] Dashboard with stats
2. [ ] Posts CRUD (list, create, edit, delete)
3. [ ] Categories CRUD
4. [ ] Tags CRUD
5. [ ] Users management
6. [ ] Comments moderation

### Phase 3: Extended Features (Priority: Medium)

1. [ ] Videos CRUD
2. [ ] Opinions CRUD
3. [ ] Newsletter management
4. [ ] Advertisements CRUD
5. [ ] Profile page
6. [ ] Site settings

### Phase 4: Polish (Priority: Low)

1. [ ] Rich text editor integration
2. [ ] Image upload handling
3. [ ] Recent activity feed
4. [ ] Toast notifications (JS)
5. [ ] Confirmation dialogs
6. [ ] Mobile responsive testing

---

## 8. Open Questions

> [!IMPORTANT]
> The following decisions require user input before proceeding:

1. **Database Connection**: Should the PHP app connect to the **existing PostgreSQL database** used by Next.js, or create a new MySQL database?

2. **Image Uploads**: The Next.js app uses Minio/S3 for media. Should the PHP version:
   - Use local file storage (`/uploads/`)?
   - Connect to the same Minio instance?
   - Use a different storage solution?

3. **Rich Text Editor**: What WYSIWYG editor should be used?
   - TinyMCE (free for basic)
   - Quill
   - CKEditor
   - SimpleMDE (Markdown)

4. **Deployment Target**: Where will this PHP app be deployed?
   - Shared hosting (cPanel)?
   - VPS with Apache/Nginx?
   - Docker container?

5. **Composer Usage**: Should we use Composer for autoloading, or manual `require` statements?

---

## 9. Glossary

| Term | Definition |
|------|------------|
| shadcn/ui | React component library using Radix UI primitives |
| Tailwind CSS | Utility-first CSS framework |
| PDO | PHP Data Objects - database abstraction layer |
| CRUD | Create, Read, Update, Delete operations |
| CSRF | Cross-Site Request Forgery |
| RBAC | Role-Based Access Control |
