# Troubleshooting Guide

## Common Issues and Solutions

### 1. Development Server Won't Start

**Problem:** `npm run dev` fails or shows errors.

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (requires 18+)
node --version

# Check for port conflicts
# Next.js uses port 3000 by default
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

---

### 2. Database Connection Errors

**Problem:** "Can't reach database server" or similar errors.

**Solutions:**

**Check DATABASE_URL format:**
```env
# Correct format
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Common mistakes:
# - Missing protocol (postgresql://)
# - Wrong port (default is 5432)
# - Special characters in password not URL-encoded
```

**Test connection:**
```bash
# Using Prisma
npx prisma db pull

# If this works, connection is good
# If fails, check:
# 1. PostgreSQL is running
# 2. Credentials are correct
# 3. Database exists
```

**URL-encode special characters in password:**
```javascript
// If password contains special chars: p@ss!w#rd
// Encode it: p%40ss%21w%23rd
const encoded = encodeURIComponent('p@ss!w#rd')
```

---

### 3. Prisma Generate Errors

**Problem:** "Prisma schema could not be generated"

**Solutions:**
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma

# Regenerate client
npx prisma generate

# If schema has errors, validate it
npx prisma validate

# If migrations are out of sync
npx prisma migrate reset  # WARNING: Deletes all data
npx prisma db push        # Alternative: Push schema without migrations
```

---

### 4. Authentication Issues

**Problem:** Login not working or session expires immediately.

**Solutions:**

**Check NEXTAUTH_SECRET:**
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="<generated-secret>"
```

**Verify NEXTAUTH_URL:**
```env
# Development
NEXTAUTH_URL="http://localhost:3000"

# Production
NEXTAUTH_URL="https://your-domain.com"

# Must match exactly (no trailing slash)
```

**Clear cookies:**
- Open browser DevTools
- Application/Storage → Cookies
- Delete `next-auth.session-token`
- Try logging in again

---

### 5. TypeScript Errors

**Problem:** TypeScript compilation errors.

**Solutions:**
```bash
# Regenerate Prisma types
npx prisma generate

# Check for any type issues
npm run build

# Common fixes:
# 1. Restart VS Code TypeScript server
# 2. Delete tsconfig.tsbuildinfo
# 3. Check for missing imports
```

---

### 6. Image Loading Issues

**Problem:** Images return 403 or don't load.

**Solutions:**

**Add domains to next.config.ts:**
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-image-domain.com',
    },
  ],
}
```

**Check image URLs:**
- Images must be publicly accessible
- CORS headers must allow your domain
- URLs must be valid

---

### 7. Build Failures

**Problem:** `npm run build` fails.

**Solutions:**

**Check for errors:**
```bash
# Build with verbose output
npm run build 2>&1 | tee build.log

# Common issues:
# 1. Environment variables missing
# 2. Type errors in code
# 3. Missing dependencies
```

**Environment variables in build:**
- Add all required env vars to build environment
- DATABASE_URL must be accessible during build
- Prisma generates types during build

**Memory issues:**
```bash
# Increase Node.js memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

### 8. API Route Errors

**Problem:** API routes return 500 or unexpected errors.

**Solutions:**

**Check server logs:**
```bash
# Development
npm run dev
# Check terminal for errors

# Production
pm2 logs newsviewbd
```

**Common issues:**
- Missing await on async functions
- Database query errors
- Missing authentication checks
- Invalid request data

**Debug API route:**
```typescript
export async function GET(req: Request) {
  try {
    console.log('API called:', req.url);
    // Your code
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
```

---

### 9. Middleware Not Working

**Problem:** Admin routes accessible without login.

**Solutions:**

**Check middleware.ts:**
```typescript
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/admin/:path*"]  // Must match your admin routes
}
```

**Verify NextAuth setup:**
- Check `lib/auth.ts` configuration
- Ensure callbacks return correct user data
- Session strategy is set correctly

---

### 10. Performance Issues

**Problem:** Slow page loads or API responses.

**Solutions:**

**Database optimization:**
```bash
# Add indexes to frequently queried fields
# In schema.prisma:
@@index([categoryId])
@@index([authorId])

# Then run:
npx prisma migrate dev
```

**Check N+1 queries:**
```typescript
// Bad (N+1 query)
const posts = await prisma.post.findMany();
for (const post of posts) {
  post.author = await prisma.profile.findUnique({ where: { id: post.authorId }});
}

// Good (single query with include)
const posts = await prisma.post.findMany({
  include: { author: true }
});
```

**Enable caching:**
```typescript
// In route handlers
export const revalidate = 60; // Revalidate every 60 seconds
```

---

### 11. File Upload Issues

**Problem:** File uploads failing with MinIO/S3.

**Solutions:**

**Check MinIO configuration:**
```env
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"  # true for production
```

**Verify bucket exists:**
```bash
# MinIO client
mc alias set local http://localhost:9000 accesskey secretkey
mc ls local/
mc mb local/post-images  # Create bucket if missing
```

**Check CORS:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::post-images/*"]
    }
  ]
}
```

---

### 12. React Query Errors

**Problem:** `useQuery` hooks not working or stale data.

**Solutions:**

**Verify QueryClientProvider:**
```typescript
// In layout.tsx
<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
```

**Invalidate cache:**
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['posts'] });
```

**Check query key consistency:**
```typescript
// Must use same key in hook and invalidation
useQuery({ queryKey: ['posts', id] })
invalidateQueries({ queryKey: ['posts', id] })
```

---

## Getting Help

If you're still stuck:

1. **Check logs** - Most errors are logged in terminal or browser console
2. **Search documentation** - Next.js, Prisma, NextAuth docs
3. **GitHub Issues** - Search similar issues in respective repositories
4. **Stack Overflow** - Tag with `next.js`, `prisma`, `next-auth`

## Useful Commands

```bash
# Reset everything (nuclear option)
rm -rf node_modules .next package-lock.json
npm install
npx prisma generate
npm run build

# Database
npx prisma studio          # Visual database editor
npx prisma migrate reset   # Reset DB (deletes data!)
npx prisma db push         # Push schema without migration

# Logs
pm2 logs                   # Production logs
npm run dev                # Development logs
```

Remember: Most issues are environment or configuration related. Check your `.env.local` file first!
