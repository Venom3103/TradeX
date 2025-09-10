
# PaperTradeX - Prisma + PostgreSQL

This project is a Next.js demo trading app with Prisma for PostgreSQL.

## Setup (local)
1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install deps: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Create migration / push schema: `npx prisma migrate dev --name init`
5. Seed demo user: `npm run seed`
6. Start dev server: `npm run dev`

## Deploy to Vercel
- Set `DATABASE_URL` and `JWT_SECRET` in Vercel project environment variables.
- Vercel will run `npm install` and `npm run build` automatically.
