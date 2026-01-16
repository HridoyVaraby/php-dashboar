# Todo List: PHP Admin Dashboard Port

## Phase 1: Foundation (Critical)

- [x] **1.1 Project Structure Setup**
- [x] **1.2 Tailwind CSS Build Pipeline**
- [x] **1.3 Router Implementation**
- [x] **1.4 Database Connection**
- [x] **1.5 Session & Auth Middleware**
- [x] **1.6 Admin Layout Template**
- [x] **1.7 Login Page**

---

## Phase 2: Core Features (High Priority)

- [x] **2.1 Dashboard Home**
  - [x] Create `src/Controllers/DashboardController.php`
  - [x] Create `views/admin/dashboard.php`
  - [x] Implement stats cards (6 metrics)
  - [x] Implement quick actions section

- [x] **2.2 Posts Management**
  - [x] Create `src/Models/Post.php`
  - [x] Create `src/Controllers/PostController.php`
  - [x] Create `views/admin/posts/index.php` (list view)
  - [x] Implement pagination component
  - [x] Add search functionality
  - [x] Add category filter
  - [x] Add status filter (Published/Draft)
  - [x] Create `views/admin/posts/create.php`
  - [x] Create `views/admin/posts/edit.php`
  - [x] Implement post delete with confirmation

- [x] **2.3 Categories Management**
  - [x] Create `src/Models/Category.php`
  - [x] Create `src/Controllers/CategoryController.php`
  - [x] Create `views/admin/categories/index.php`
  - [x] Implement inline edit functionality
  - [x] Create `views/admin/categories/edit.php`

- [x] **2.4 Tags Management**
  - [x] Create `src/Models/Tag.php`
  - [x] Create `src/Controllers/TagController.php`
  - [x] Create `views/admin/tags/index.php`
  - [x] Implement tag CRUD operations

- [x] **2.5 Users Management**
  - [x] Create `src/Models/User.php` (Profile model)
  - [x] Create `src/Controllers/UserController.php`
  - [x] Create `views/admin/users/index.php`
  - [x] Implement role change dropdown
  - [x] Implement suspend/activate toggle
  - [x] Implement user delete with confirmation
  - [x] Add create user modal

- [x] **2.6 Comments Moderation**
  - [x] Create `src/Models/Comment.php`
  - [x] Create `src/Controllers/CommentController.php`
  - [x] Create `views/admin/comments/index.php`
  - [x] Implement approve/reject actions
  - [x] Implement delete with confirmation

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

- [x] **3.5 Subcategories Management**
  - [x] Create `src/Models/Subcategory.php`
  - [x] Create `src/Controllers/SubcategoryController.php`
  - [x] Create `views/admin/subcategories/index.php`

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

- [x] **4.1 Rich Text Editor** (Integrated in Posts)
- [x] **4.2 Image Upload Handling** (Implemented `FileUpload`)
- [x] **4.3 Recent Activity Feed** (Implemented in Dashboard)
- [ ] **4.4 Toast Notifications** (Flash messages implemented, need JS toast maybe)
- [ ] **4.5 Confirmation Dialogs** (Implemented native confirm)
- [ ] **4.6 Mobile Responsive Testing**

---

## Technical Tasks

- [x] Create reusable form components (Partially done in views)
- [x] Create reusable table component (Partially done in views)
- [x] Create pagination component
- [x] Create badge component (CSS)
- [x] Create button component (CSS)
- [x] Create card component (CSS)
- [ ] Create modal/dialog component (JS logic needed)
- [x] Create select dropdown component
- [x] Implement CSRF protection helper
- [x] Add input sanitization helper
- [x] Add flash message system
- [x] Create date formatting helper (Bengali)
