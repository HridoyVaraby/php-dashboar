# NewsViewBD - Next.js

A modern Bengali news portal built with Next.js 14, featuring a complete content management system.

## 🚀 Features

- **Public Website**
  - Home page with breaking news, featured posts, videos, and opinions
  - Posts archive with search, filtering, and sorting
  - Category and subcategory browsing
  - Video gallery with YouTube integration
  - Opinion articles section
  - Tag-based content discovery
  - Comment system with moderation
  - Newsletter subscription

- **Admin Dashboard**
  - Comprehensive content management (Posts, Videos, Opinions)
  - Category and tag management
  - Comment moderation (approve/reject)
  - User management with role-based access
  - Advertisement management
  - Newsletter subscriber management

- **Authentication & Security**
  - NextAuth credentials-based authentication
  - Role-based access control (ADMIN, EDITOR, READER)
  - Protected admin routes with middleware
  - Session management

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Data Fetching:** TanStack Query (React Query)
- **Icons:** Lucide React
- **Fonts:** Noto Serif Bengali, Noto Sans Bengali

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) MinIO for object storage

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/newsviewbd"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # MinIO (Optional)
   MINIO_ENDPOINT="localhost"
   MINIO_PORT="9000"
   MINIO_ACCESS_KEY="your-access-key"
   MINIO_SECRET_KEY="your-secret-key"
   MINIO_BUCKET_NAME="post-images"
   ```

   Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Or run migrations
   npx prisma migrate dev
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
project-nextjs/
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── (public pages)/     # Public-facing pages
│   └── layout.tsx          # Root layout
├── components/
│   ├── comments/           # Comment components
│   ├── layout/             # Header, Footer
│   ├── sections/           # Page sections
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React Query hooks
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   └── prisma.ts           # Prisma client
├── prisma/
│   └── schema.prisma       # Database schema
└── middleware.ts           # Route protection
```

## 🔐 User Roles

- **ADMIN** - Full access to all features
- **EDITOR** - Can create, edit, and delete content
- **READER** - Can read content and post comments

## 🌐 API Routes

### Public APIs
- `GET /api/posts` - List posts
- `GET /api/posts/[id]` - Get single post
- `GET /api/videos` - List videos
- `GET /api/opinions` - List opinions
- `GET /api/categories` - List categories
- `GET /api/tags` - List tags
- `POST /api/comments` - Create comment
- `POST /api/newsletter` - Subscribe to newsletter

### Admin APIs (Authentication Required)
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `PATCH /api/comments/[id]` - Approve/reject comment
- `GET /api/users` - List users (ADMIN only)
- `PATCH /api/users/[id]` - Update user role (ADMIN only)

## 📝 Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Database Commands
```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Recommended Platforms

**Vercel (Recommended for Next.js)**
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

**Railway/Heroku (Alternative)**
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy application

### Environment Variables for Production
- Set `NEXTAUTH_URL` to your production domain
- Use strong `NEXTAUTH_SECRET`
- Configure production database URL
- Set up MinIO or AWS S3 for file storage

## 🧪 Testing

### Manual Testing Checklist
- [ ] Home page loads correctly
- [ ] Posts can be viewed and filtered
- [ ] Authentication works (login/signup)
- [ ] Comments can be posted (requires auth)
- [ ] Admin dashboard is accessible (admin only)
- [ ] Content CRUD operations work
- [ ] Search functionality works
- [ ] Responsive design on mobile

## 📄 License

[Your License Here]

## 👥 Contributing

[Contributing guidelines]

## 📧 Contact

For questions or support, contact: info@newsviewbd.com
