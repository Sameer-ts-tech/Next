# 🟢 Emerald Notes Dashboard

A premium Next.js Notes application configured with an Obsidian Dark Theme and Emerald Green accents. Built to demonstrate key web development principles including multiple rendering strategies (SSG, SSR, ISR), REST APIs, MongoDB connection caching, and React Server Actions.

### 🔗 Live Deployment
* **Vercel Link**: [https://next-rho-two.vercel.app](https://next-rho-two.vercel.app)

---

## 🛠️ Academic Concepts Implemented

### 1. Rendering Strategies
The project illustrates all four primary Next.js rendering strategies:
* **Static Site Generation (SSG)**: Pre-compiled HTML at build time for instant loads.
  - Route: `/about` (implemented in `src/app/about/page.js`) - Tech Stack & Concept Documentation.
* **Incremental Static Regeneration (ISR)**: Pre-rendered static pages that rebuild in the background after a timeout or on-demand path invalidation.
  - Route: `/public` (implemented in `src/app/public/page.js`) - Community Shared Feed. Revalidates every 10 seconds (`export const revalidate = 10;`).
* **Server Side Rendering (SSR)**: Dynamic page generation on the server for each unique client request.
  - Route: `/stats` (implemented in `src/app/stats/page.js`) - Live Database Telemetry. Generates MongoDB count and ratio aggregation metrics on demand (`export const dynamic = 'force-dynamic';`).
* **Dynamic Client Routing**:
  - Route: `/notes/[id]` (implemented in `src/app/notes/[id]/page.js`) - Dynamic Edit Page fetching specific documents at runtime.

### 2. REST API Routes
Located under `src/app/api/notes/` utilizing standard route handlers for full CRUD operations returning structured JSON:
* `GET /api/notes`: Lists notes, sorted by pinned and recent.
* `POST /api/notes`: Performs validation and creates a new note.
* `GET /api/notes/[id]`: Fetches a single note by database ID.
* `PUT /api/notes/[id]`: Partially or fully updates note properties.
* `DELETE /api/notes/[id]`: Deletes a note by ID.

### 3. Server Actions (`use server`)
Implemented in `src/app/actions.js` for internal UI interactions and forms (allowing progressive enhancement):
* `createNoteAction`: Validates form entries, creates database document, and flushes cache via `revalidatePath`.
* `togglePinAction` & `togglePublicAction`: Updates dynamic pin/share flags and triggers layout refreshes.
* `deleteNoteAction` & `updateNoteAction`: Updates/deletes records on demand.

### 4. Database Layer (MongoDB & Mongoose)
* Models defined in `src/models/Note.js`.
* Connection pooling is cached in `src/lib/db.js` using the `global.mongoose` object, preventing database socket exhaustion during development hot-reloads.

---

## 🚀 Local Installation & Setup

1. **Clone & Navigate**:
   ```bash
   cd Next-Notes/notes
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file inside the root directory and add your MongoDB URI:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/next-notes
   ```

4. **Run Development Server**:
   ```bash
   pnpm dev
   ```

5. **Build for Production**:
   ```bash
   pnpm build
   pnpm start
   ```
