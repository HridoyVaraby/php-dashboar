# NewsViewBD Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- PostgreSQL database (Railway, Supabase, or similar)
- (Optional) MinIO or AWS S3 for file storage
- Domain name (optional)

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/newsviewbd.git
   git push -u origin main
   ```

2. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

3. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**
   
   Add these in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

#### Automatic Deployments
- Every push to `main` triggers a deployment
- Pull requests get preview deployments

---

### Option 2: Railway

Railway provides both app hosting and PostgreSQL database.

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Copy the connection URL

3. **Deploy Application**
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Add environment variables (same as above)
   - Use the PostgreSQL URL from step 2

4. **Configure Domain**
   - Railway provides a free subdomain
   - Or connect your custom domain

---

### Option 3: Self-Hosted (VPS)

For full control, deploy on a VPS (DigitalOcean, AWS, etc.)

#### Requirements:
- Ubuntu 22.04+ or similar
- Node.js 18+
- PostgreSQL
- Nginx (reverse proxy)
- PM2 (process manager)

#### Steps:

1. **Set up Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/newsviewbd.git
   cd newsviewbd/project-nextjs
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   ```bash
   nano .env.local
   # Add all environment variables
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "newsviewbd" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Database Setup

### Option 1: Railway PostgreSQL
- Automatically provisioned
- Copy connection string from dashboard
- No manual setup needed

### Option 2: Supabase
- Free tier available
- Go to [supabase.com](https://supabase.com)
- Create new project
- Copy PostgreSQL connection string
- Use in `DATABASE_URL`

### Option 3: Self-Hosted PostgreSQL
```bash
# Create database
sudo -u postgres psql
postgres=# CREATE DATABASE newsviewbd;
postgres=# CREATE USER newsviewuser WITH PASSWORD 'securepassword';
postgres=# GRANT ALL PRIVILEGES ON DATABASE newsviewbd TO newsviewuser;
postgres=# \q

# Run migrations
npx prisma migrate deploy
```

---

## Environment Variables

### Required Variables
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<32-character-random-string>"
```

### Optional Variables
```env
# MinIO/S3 (for file uploads)
MINIO_ENDPOINT="s3.amazonaws.com"
MINIO_PORT="443"
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
MINIO_BUCKET_NAME="newsviewbd-uploads"
MINIO_USE_SSL="true"
```

---

## Post-Deployment

### 1. Create Admin User
Run this SQL in your database:
```sql
INSERT INTO "Profile" (id, email, password, "fullName", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@newsviewbd.com',
  '<bcrypt-hashed-password>',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);
```

To hash password:
```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('yourpassword', 10).then(console.log);
```

### 2. Verify Deployment
- [ ] Visit homepage
- [ ] Test login with admin credentials
- [ ] Access admin dashboard
- [ ] Create test post
- [ ] Test comment system
- [ ] Verify newsletter subscription

### 3. Set Up Custom Domain (if needed)
- Add DNS records (A or CNAME)
- Update `NEXTAUTH_URL` to new domain
- Redeploy

---

## Monitoring & Maintenance

### Vercel
- Check Analytics dashboard
- Monitor errors in Logs
- Set up Slack/email notifications

### Self-Hosted
```bash
# View logs
pm2 logs newsviewbd

# Restart app
pm2 restart newsviewbd

# Monitor resources
pm2 monit
```

### Database Backups
```bash
# Backup (Railway/Supabase have auto-backup)
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify DATABASE_URL is accessible
- Check Prisma schema is valid: `npx prisma validate`

### Database Connection Issues
- Verify DATABASE_URL format
- Check database is accessible from deployment
- Run `npx prisma generate` before build

### Authentication Not Working
- Verify NEXTAUTH_URL matches deployed URL
- Check NEXTAUTH_SECRET is set
- Clear browser cookies and try again

### Images Not Loading
- Add image domains to `next.config.ts`
- Check MinIO/S3 configuration
- Verify CORS settings

---

## Scaling

### Performance Optimization
- Enable Next.js caching
- Use CDN for static assets (Vercel does this automatically)
- Optimize database queries with indexes
- Use Redis for session storage (advanced)

### Database Scaling
- Connection pooling (Prisma Accelerate)
- Read replicas for heavy read workloads
- Regular vacuum and analyze operations

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong NEXTAUTH_SECRET
- [ ] Database credentials secured
- [ ] API routes protected with auth
- [ ] Input validation on all forms
- [ ] CORS configured properly
- [ ] Rate limiting on auth routes (optional)
- [ ] Regular security updates

---

## Support

For deployment issues:
1. Check logs in deployment platform
2. Verify environment variables
3. Test database connection
4. Review [Next.js deployment docs](https://nextjs.org/docs/deployment)

**Your application is now deployed! 🎉**
