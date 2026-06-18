# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run db:migrate   # prisma migrate dev
npm run db:generate  # prisma generate (regenerate client after schema changes)
npm run db:seed      # seed DB with admin user, categories, sample products
npm run db:studio    # open Prisma Studio
```

No lint or test scripts are configured.

## Architecture

### Route Groups

- **`app/(customer)/[locale]/`** — public storefront, locale-prefixed URLs (en/ar/ku)
- **`app/admin/`** — admin panel, no locale prefix, protected by session check in middleware

### Middleware

The middleware lives in **`proxy.ts`** (not `middleware.ts`). It:
1. Guards all `/admin/*` routes (except `/admin/login`) by checking `auth()`
2. Delegates customer routes to `next-intl` middleware for locale routing

### Internationalization

Three locales: `en`, `ar`, `ku`. Both `ar` and `ku` are RTL (see `lib/routing.ts`).

Two separate message bundles:
- `messages/{locale}.json` — customer-facing strings, selected by URL segment
- `messages/admin/{locale}.json` — admin strings, selected by a cookie (`admin-locale`)

Admin locale does **not** come from the URL. The `lib/i18n.ts` config detects the absence of a `[locale]` URL segment and falls back to the cookie-stored admin locale.

### Prisma

Generated client lives at **`lib/generated/prisma/`** — always import from there:
```ts
import { PrismaClient } from "./generated/prisma/client";
```

The client uses `@prisma/adapter-pg` (PrismaPg adapter over a `pg.Pool`):
- `DATABASE_URL` — transaction-mode pooler (port **6543**), used by the app
- `DIRECT_URL` — direct connection (port **5432**), required for migrations

After any schema change, run `npm run db:generate` to regenerate the client before using new types.

### Supabase

Supabase is used **only for Storage** (image uploads). Auth and the database run through Prisma/NextAuth independently. The storage utility is in `lib/supabase-storage.ts` and uses `@supabase/supabase-js` with the service role key — never the anon key.

Required env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only

Images are stored in the **`products`** bucket. Upload goes through `POST /api/upload`, which requires an authenticated session.

### Currency

All prices are stored as integers in **IQD**. The `roundToIQD` utility in `lib/utils/currency.ts` rounds to the nearest 250. Display with `formatIQD()`.

### Key Non-obvious Patterns

- **Banner images** are uploaded to the same `products` Supabase bucket. The `folder` param in the upload request controls the subfolder path.
- The admin sidebar nav is in `components/admin/layout/sidebar.tsx` — add new sections there.
- The `serializeProduct` utility in `lib/utils.ts` converts Prisma `Decimal`/`Date` fields to plain JSON-safe values before passing to client components.
- `components/shared/image-upload.tsx` supports optional cropping via an `aspect` prop (uses `react-easy-crop` under the hood via `components/shared/image-cropper.tsx`).
