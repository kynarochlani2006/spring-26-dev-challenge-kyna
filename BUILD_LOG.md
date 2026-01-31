# Spring 2026 Dev Challenge Build Log

This log records decisions, tradeoffs, and implementation steps so I can
explain and defend the build in interviews.

## 2026-01-30

### Decision: Tech stack
- Selected Next.js (App Router) + React + TypeScript for fast, modern full-stack dev.
- Styling with Tailwind CSS to match Figma quickly and consistently.
- Backend via Next.js route handlers to keep stack simple and integrated.
- Database planned: SQLite with Prisma for local dev speed and clear data modeling.
- Auth planned: NextAuth for quick, explainable authentication layer.

### Tradeoffs
- SQLite is great for local iteration but not the most scalable production DB.
- NextAuth is widely used and fast to integrate, but adds abstraction vs a custom auth flow.
- Tailwind accelerates UI matching but increases class verbosity in components.

### Implementation steps
- Bootstrapped Next.js app with TypeScript, Tailwind, App Router, and ESLint.

### Decision: UI assets
- Using remote Unsplash images for hero and product cards to avoid binary assets.
- Added Next.js image remotePatterns for Unsplash/Pexels.

### Implementation steps
- Replaced starter page with the full landing page layout from the Figma screenshot.
- Added promo bar, nav, hero, product grid, features, and footer sections.

### Decision: Backend scaffolding
- Added Prisma + SQLite to model products and users locally.
- Implemented simple auth routes (signup/login) with bcrypt hashing.
- Products now load from the database when seeded; fallback data remains for UI.

### Tradeoffs
- Simple auth endpoints are not full session auth yet; good for demonstrating API flow.
- Prisma output uses generated client in `src/generated` to keep server imports explicit.

### Implementation steps
- Added Prisma schema for `User` and `Product`.
- Added `/api/products`, `/api/auth/signup`, `/api/auth/login` route handlers.
- Added TypeScript seed script to populate product catalog.

### Fix: Prisma DB path error
- Next.js detected the wrong workspace root due to another lockfile.
- Set `turbopack.root` to the project directory so SQLite opens correctly.

### Fix: Tailwind resolve error
- Disabled Turbopack for local dev to avoid resolving from the wrong home directory.

### Decision: Switch to hosted Postgres
- Updated Prisma datasource to PostgreSQL and set DATABASE_URL from Prisma.
- This avoids local SQLite file locking issues in dev and aligns with full-stack expectations.

### Fix: Postgres migration reset
- Cleared old SQLite migrations to create a fresh Postgres migration history.
- Re-ran migrations and seeded the Postgres database.

### UI polish pass (Figma alignment)
- Refined spacing, typography, and colors to align with the Figma screenshot.
- Added inline SVG icons for header actions and updated button shadows.
- Tweaked product cards, hero typography, and footer sizing to match layout.

### Asset wiring (local)
- Swapped hero and product images to use local assets under `public/assets/`.
- Added a placeholder `.gitkeep` for the assets directory.

### Icon integration
- Replaced inline header icons, product hearts, and feature icons with SVG assets.
- Added star SVGs for rating display and updated footer logo/socials.

### Asset-only enforcement
- Updated product rendering to ignore any external image URLs.
- Seed data now uses only the provided local PNG assets.

### Button hover states
- Added hover styles to match the Figma pill button interactions.

### Backend functionality (no UI change)
- Added cart and wishlist API routes with guest or user session support.
- Implemented session tokens on signup/login to enable authenticated actions.
- Moved product grid into a client component to trigger add-to-cart and wishlist actions.
- Extended Prisma schema with Session, Cart, CartItem, and WishlistItem models.

### Migration status
- Migration to add cart/auth tables failed due to unreachable DB (`db.prisma.io:5432`).
- Re-run `npx prisma migrate dev --name cart_wishlist_session` when DB is reachable.

### Functional app build-out
- Added shared header/footer components across cart, wishlist, and auth pages.
- Implemented cart, wishlist, login, and signup screens with matching UI styling.
- Product cards now show hover add-to-cart and toggleable heart state.
- Added cart delete, wishlist toggle, and logout endpoints.

### Auth UX fixes
- Added `/api/auth/me` to detect active sessions for the header.
- Header account icon now prompts logout when signed in, otherwise links to login.
- Auth form now trims email input and clears stale errors when typing.

### Product detail + recommendations
- Added a product detail page with cart/wishlist actions and ratings display.
- Linked product cards to detail pages without changing the main layout.
- Added simple recommendation section (top-rated items excluding the current product).

### Category nav filters
- Added product categories (Women, Men, Kids, Classics, Sport, Sale).
- Header nav now links to `/?category=...` and filters products server-side.
- Seed data and fallback products include category labels for filtering.

### Size fit assistant
- Added a lightweight size & fit assistant on the product detail page.
- Simple 3-step quiz suggests a size based on fit preference and usage.

