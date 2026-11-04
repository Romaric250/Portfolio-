# Romaric Lonfonyuy — Portfolio (v2)

Production portfolio and admin CMS for [rlonfonyuy.online](https://rlonfonyuy.online). Built with Next.js 16, React 19, Prisma 6 (MongoDB), UploadThing, and Auth.js v5.

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io) 10+
- MongoDB Atlas (or compatible MongoDB 6+)
- [UploadThing](https://uploadthing.com) account
- Optional: Resend (contact + newsletter email)

## Setup

1. **Clone and install**

   ```bash
   pnpm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and fill values:

   | Variable | Purpose |
   |----------|---------|
   | `DATABASE_URL` | MongoDB connection string |
   | `UPLOADTHING_TOKEN` | UploadThing secret |
   | `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `AUTH_URL` | Same as site URL in production |
   | `AUTH_TRUST_HOST` | `true` on Vercel |
   | `ADMIN_SECRET_KEY` | Gate for `/login` (e.g. `openssl rand -hex 24`) |
   | `ADMIN_GATE_JWT_SECRET` | Signs admin gate cookie |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | Owner account for seed |

   Generate a password hash:

   ```bash
   pnpm admin:hash "your-secure-password"
   ```

3. **Database**

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

   Prisma 6 uses `db push` for MongoDB (no SQL migrations).

4. **Development**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Admin access

The admin UI is **not linked** from the public site. Unauthenticated requests to `/admin/*` return **404** (not a redirect).

1. Open the gated login URL (replace with your secret):

   ```
   http://localhost:3000/login?sr=YOUR_ADMIN_SECRET_KEY
   ```

2. Sign in with the seeded admin email and password.

3. Admin dashboard: `/admin`

Robots: admin routes use `noindex, nofollow` metadata and `X-Robots-Tag` headers.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Prisma generate + production build |
| `pnpm start` | Production server |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Sync Prisma schema to MongoDB |
| `pnpm db:seed` | Seed content + admin user |
| `pnpm db:studio` | Prisma Studio |
| `pnpm admin:hash` | Bcrypt hash for `ADMIN_PASSWORD_HASH` |

## Deploy (Vercel)

1. Import the repo in Vercel.
2. Set **all** environment variables from `.env.example`.
3. Build command: `pnpm build` (default).
4. Ensure `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` match the production domain.
5. After deploy, run seed once against production `DATABASE_URL` (local machine or CI with secret), or use `db:seed` in a one-off job.
6. Submit sitemap in Search Console (see `SEO_LAUNCH_CHECKLIST.md`).

## MongoDB

- Provider: **MongoDB Atlas** recommended (`mongodb+srv://…`). Atlas is already a replica set.
- Prisma’s MongoDB connector uses transactions, so a **standalone** local `mongod` will reject writes (`replica set` error). For local MongoDB:

  ```bash
  mongod --replSet rs0 --dbpath /data/db
  mongosh --eval "rs.initiate()"
  ```

  Then `DATABASE_URL="mongodb://127.0.0.1:27017/rlonfonyuy?replicaSet=rs0"`.
- Prisma client: `@prisma/client` 6.19.x with `provider = "mongodb"`.
- Use ObjectId fields as defined in `prisma/schema.prisma`.
- Backups: enable Atlas continuous backup for production.

## UploadThing

- All uploads (images, PDFs, certificates, CV) go through UploadThing.
- Token: `UPLOADTHING_TOKEN` from the UploadThing dashboard.
- Routers: `imageUploader`, `pdfUploader`, `postImageUploader`, `certificateUploader` in `src/lib/uploadthing/core.ts`.
- Admin-only: middleware checks Auth.js session before upload.

## Cache invalidation

Admin mutations call `invalidate()` from `src/lib/cache.ts` with cache tags and paths so ISR/public cached pages refresh immediately.

## License

Private — © Romaric Lonfonyuy.
