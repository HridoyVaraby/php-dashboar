# Todo List: PHP Admin Dashboard Port

## Phase 1: Foundation (Critical)

- [ ] **1.1 Project Structure Setup**
  - [ ] Create `backend/` directory structure
  - [ ] Set up `public/`, `src/`, `views/`, `config/` folders
  - [ ] Create `.htaccess` for clean URLs
  - [ ] Initialize `composer.json` for PSR-4 autoloading

- [ ] **1.2 Tailwind CSS Build Pipeline**
  - [ ] Create `package.json` with pnpm
  - [ ] Copy `tailwind.config.ts` and convert to JS
  - [ ] Copy `globals.css` and adapt for PHP
  - [ ] Set up build script for CSS compilation
  - [ ] Include Google Fonts (Noto Serif Bengali, Noto Sans Bengali)

- [ ] **1.3 Router Implementation**
  - [ ] Create `src/Router.php` class
  - [ ] Implement URL pattern matching
  - [ ] Support for route parameters (e.g., `/admin/posts/edit/{id}`)
  - [ ] Set up `public/index.php` front controller

- [ ] **1.4 Database Connection**
  - [ ] Create `config/db.php` with PDO setup
  - [ ] Implement singleton database connection
  - [ ] Configure for PostgreSQL (same as Next.js)
  - [ ] Create base `Model` class with common methods

- [ ] **1.5 Session & Auth Middleware**
  - [ ] Configure secure session settings
  - [ ] Create `src/Middleware/AuthMiddleware.php`
  - [ ] Implement role-based access control
  - [ ] Create `src/Helpers/Auth.php` helper functions

- [ ] **1.6 Admin Layout Template**
  - [ ] Create `views/layouts/admin_layout.php`
  - [ ] Implement sidebar component (`views/components/sidebar.php`)
  - [ ] Implement header component
  - [ ] Add Lucide icons via CDN
  - [ ] Style to match Next.js AdminSidebar exactly

- [ ] **1.7 Login Page**
  - [ ] Create `views/auth/login.php` template
  - [ ] Create `src/Controllers/AuthController.php`
  - [ ] Implement login form handling
  - [ ] Add password verification with bcrypt
  - [ ] Add CSRF token protection
  - [ ] Implement redirect after login

---

## Phase 2: Core Features (High Priority)

- [ ] **2.1 Dashboard Home**
  - [ ] Create `src/Controllers/DashboardController.php`
  - [ ] Create `views/admin/dashboard.php`
  - [ ] Implement stats cards (6 metrics)
  - [ ] Implement quick actions section
  - [ ] Add loading skeleton states

- [ ] **2.2 Posts Management**
  - [ ] Create `src/Models/Post.php`
  - [ ] Create `src/Controllers/PostController.php`
  - [ ] Create `views/admin/posts/index.php` (list view)
  - [ ] Implement pagination component
  - [ ] Add search functionality
  - [ ] Add category filter
  - [ ] Add status filter (Published/Draft)
  - [ ] Create `views/admin/posts/create.php`
  - [ ] Create `views/admin/posts/edit.php`
  - [ ] Implement post delete with confirmation

- [ ] **2.3 Categories Management**
  - [ ] Create `src/Models/Category.php`
  - [ ] Create `src/Controllers/CategoryController.php`
  - [ ] Create `views/admin/categories/index.php`
  - [ ] Implement inline edit functionality
  - [ ] Create `views/admin/categories/edit.php`

- [ ] **2.4 Tags Management**
  - [ ] Create `src/Models/Tag.php`
  - [ ] Create `src/Controllers/TagController.php`
  - [ ] Create `views/admin/tags/index.php`
  - [ ] Implement tag CRUD operations

- [ ] **2.5 Users Management**
  - [ ] Create `src/Models/User.php` (Profile model)
  - [ ] Create `src/Controllers/UserController.php`
  - [ ] Create `views/admin/users/index.php`
  - [ ] Implement role change dropdown
  - [ ] Implement suspend/activate toggle
  - [ ] Implement user delete with confirmation
  - [ ] Add create user modal

- [ ] **2.6 Comments Moderation**
  - [ ] Create `src/Models/Comment.php`
  - [ ] Create `src/Controllers/CommentController.php`
  - [ ] Create `views/admin/comments/index.php`
  - [ ] Implement approve/reject actions
  - [ ] Implement delete with confirmation

---

## Phase 3: Extended Features (Medium Priority)

- [ ] **3.1 Videos Management**
  - [ ] Create `src/Models/Video.php`
  - [ ] Create `src/Controllers/VideoController.php`
  - [ ] Create `views/admin/videos/index.php`
  - [ ] Create `views/admin/videos/create.php`
  - [ ] Create `views/admin/videos/edit.php`

- [ ] **3.2 Opinions Management**
  - [ ] Create `src/Models/Opinion.php`
  - [ ] Create `src/Controllers/OpinionController.php`
  - [ ] Create `views/admin/opinions/index.php`
  - [ ] Create `views/admin/opinions/create.php`
  - [ ] Create `views/admin/opinions/edit.php`

- [ ] **3.3 Newsletter Management**
  - [ ] Create `src/Models/NewsletterSubscriber.php`
  - [ ] Create `src/Controllers/NewsletterController.php`
  - [ ] Create `views/admin/newsletter/index.php`
  - [ ] Implement subscriber list with pagination

- [ ] **3.4 Advertisements Management**
  - [ ] Create `src/Models/Advertisement.php`
  - [ ] Create `src/Controllers/AdController.php`
  - [ ] Create `views/admin/ads/index.php`
  - [ ] Create `views/admin/ads/create.php`
  - [ ] Create `views/admin/ads/edit.php`

- [ ] **3.5 Subcategories Management**
  - [ ] Create `src/Models/Subcategory.php`
  - [ ] Create `src/Controllers/SubcategoryController.php`
  - [ ] Create `views/admin/subcategories/index.php`

- [ ] **3.6 Profile Page**
  - [ ] Create `src/Controllers/ProfileController.php`
  - [ ] Create `views/admin/profile/index.php`
  - [ ] Implement profile update form

- [ ] **3.7 Site Settings**
  - [ ] Create `src/Models/SiteSettings.php`
  - [ ] Create `src/Controllers/SettingsController.php`
  - [ ] Create `views/admin/settings/index.php`

---

## Phase 4: Polish (Low Priority)

- [ ] **4.1 Rich Text Editor**
  - [ ] Integrate TinyMCE or Quill
  - [ ] Style editor to match source
  - [ ] Implement image upload in editor

- [ ] **4.2 Image Upload Handling**
  - [ ] Create `src/Controllers/MediaController.php`
  - [ ] Implement file upload validation
  - [ ] Create image preview component
  - [ ] Handle image thumbnail generation

- [ ] **4.3 Recent Activity Feed**
  - [ ] Implement activity query
  - [ ] Add Bengali time-ago formatting
  - [ ] Add activity type icons

- [ ] **4.4 Toast Notifications**
  - [ ] Create toast component (JS)
  - [ ] Implement success/error messages
  - [ ] Style to match shadcn/ui toast

- [ ] **4.5 Confirmation Dialogs**
  - [ ] Create alert dialog component (JS)
  - [ ] Implement for delete actions
  - [ ] Style to match shadcn/ui AlertDialog

- [ ] **4.6 Mobile Responsive Testing**
  - [ ] Test sidebar collapse on mobile
  - [ ] Test table horizontal scroll
  - [ ] Test form layouts on mobile
  - [ ] Fix any responsive issues

---

## Technical Tasks

- [ ] Create reusable form components
- [ ] Create reusable table component
- [ ] Create pagination component
- [ ] Create badge component
- [ ] Create button component
- [ ] Create card component
- [ ] Create modal/dialog component
- [ ] Create select dropdown component
- [ ] Implement CSRF protection helper
- [ ] Add input sanitization helper
- [ ] Add flash message system
- [ ] Create date formatting helper (Bengali)

---

## QA & Testing

- [ ] Test all CRUD operations
- [ ] Test authentication flow
- [ ] Test role-based access control
- [ ] Test pagination on all list pages
- [ ] Test search/filter functionality
- [ ] Test form validation
- [ ] Security audit (SQL injection, XSS, CSRF)
- [ ] Cross-browser testing
- [ ] Mobile device testing
