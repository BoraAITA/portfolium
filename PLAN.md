# Portfolium — Implementation Plan

> **For Cursor Agent:** Use this plan to build the entire application. Follow each phase sequentially.

**Goal:** A minimal portfolio/blog platform where users sign up, create profiles, write blog posts, and showcase portfolio projects. Think Adobe My Portfolio meets simplicity.

**Architecture:** Next.js 14 App Router + Server Actions + Prisma ORM + PostgreSQL. Auth with NextAuth.js (Credentials + OAuth). Dark/light mode toggle. Inter font throughout.

**Tech Stack:** TypeScript, Next.js 14, Prisma, PostgreSQL, NextAuth.js, Tailwind CSS, shadcn/ui

---

## Phase 1: Project Setup & Database

### Task 1: Initialize Next.js project
- Create Next.js 14 with TypeScript, Tailwind CSS, App Router
- Install all dependencies
- Configure `.env` with DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- Initialize Prisma with PostgreSQL

### Task 2: Database Schema (Prisma)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?
  image         String?
  bio           String?
  avatar        String?
  username      String    @unique  // URL: /username
  theme         String    @default("dark")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  posts     Post[]
  projects  Project[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String?  // Markdown
  excerpt     String?
  coverImage  String?
  published   Boolean  @default(false)
  tags        String[] // Array of tags
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  coverImage  String?
  url         String?  // External link
  github      String?  // GitHub link
  tags        String[]
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

### Task 3: Prisma Migration
- Run `npx prisma migrate dev --name init`
- Create seed script with demo user

---

## Phase 2: Authentication

### Task 4: NextAuth.js Setup
- Configure NextAuth with Credentials provider (email + password)
- Add Google OAuth provider
- Use bcrypt for password hashing
- Session strategy: JWT

### Task 5: Auth Pages
- `/login` — Email/password form, Google sign-in button
- `/register` — Name, email, username, password form
- `/auth/error` — Error display page
- Auth validation with Zod schemas

### Task 6: Auth Middleware
- Protect `/dashboard/*` routes
- Protect `/dashboard/edit/*` routes
- Allow public access to `/[username]`, `/posts`, `/projects`

---

## Phase 3: Dashboard & Profile

### Task 7: Dashboard Layout
- Sidebar navigation: Profile, Posts, Projects, Settings
- Top bar with user avatar and theme toggle
- Responsive: sidebar collapses on mobile

### Task 8: Profile Editor
- `/dashboard/profile` — Edit name, username, bio, avatar URL
- Username validation (lowercase, no spaces, unique)
- Avatar preview
- Save with Server Action

### Task 9: Theme System (Dark/Light)
- Use `next-themes` for dark/light mode
- Default: dark mode
- Toggle in dashboard topbar and public profile
- Persist theme preference in database
- Tailwind dark mode classes

---

## Phase 4: Blog Posts

### Task 10: Posts List (Dashboard)
- `/dashboard/posts` — List all posts with status (draft/published)
- Create new post button
- Edit/delete actions

### Task 11: Post Editor
- `/dashboard/posts/new` and `/dashboard/posts/[id]/edit`
- Title input
- Content: Simple textarea (markdown supported)
- Tags input (comma-separated)
- Cover image URL
- Save as draft / Publish toggle
- Auto-generate slug from title
- Server Actions for CRUD

### Task 12: Public Posts
- `/posts` — All published posts (grid layout)
- `/posts/[slug]` — Individual post page
- Author info, date, tags displayed
- Markdown rendered as HTML

---

## Phase 5: Portfolio Projects

### Task 13: Projects List (Dashboard)
- `/dashboard/projects` — Grid of project cards
- Drag-to-reorder (optional, simple sort by order)
- Add/edit/delete

### Task 14: Project Editor
- `/dashboard/projects/new` and `/dashboard/projects/[id]/edit`
- Title, description, cover image URL
- External URL, GitHub URL
- Tags, featured toggle
- Server Actions for CRUD

### Task 15: Public Projects
- `/[username]` — User's public profile page with projects
- `/projects` — All featured projects (grid)
- Project cards with cover image, title, tags

---

## Phase 6: Public Profiles & Landing

### Task 16: User Profile Page
- `/[username]` — Public profile
- Avatar, name, bio
- Featured projects grid
- Recent posts list
- Social links if present
- 404 if username not found

### Task 17: Landing Page
- `/` — Hero section with tagline
- "Built for developers and creators"
- Featured profiles carousel/grid
- CTA: "Create your portfolio"
- Minimal, dark theme, Inter font

---

## Phase 7: Design System

### Task 18: Tailwind Config + Theme
- Inter font (next/font/google)
- Dark mode: bg-gray-950, text-gray-100, accent blue-500
- Light mode: bg-white, text-gray-900, accent blue-600
- shadcn/ui components: Button, Input, Textarea, Card, Badge, Avatar, Dropdown, Dialog
- Minimal spacing, clean typography

### Task 19: Responsive Design
- Mobile-first approach
- Dashboard sidebar → bottom nav on mobile
- Cards: 1 col mobile, 2 col tablet, 3 col desktop
- Proper touch targets

---

## Phase 8: Deployment

### Task 20: GitHub Setup
- Create private repo on GitHub (BoraAITA/portfolium)
- Push code
- Set up GitHub Actions for CI

### Task 21: Cloudflare Pages Deployment
- Connect GitHub repo to Cloudflare Pages
- Build command: `npm run build`
- Framework preset: Next.js
- Environment variables: DATABASE_URL, NEXTAUTH_SECRET, etc.
- Configure custom domain

### Task 22: Database Deployment
- Use Neon, Supabase, or Railway for PostgreSQL
- Update DATABASE_URL in Cloudflare Pages
- Run Prisma migrations

---

## File Structure
```
portfolium/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Inter font
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Tailwind base
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── error/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Dashboard sidebar layout
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── profile/page.tsx
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx    # Posts list
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx    # Projects list
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx        # All posts
│   │   │   └── [slug]/page.tsx
│   │   ├── projects/page.tsx   # All projects
│   │   └── [username]/
│   │       └── page.tsx        # User profile
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── posts/
│   │   │   ├── PostCard.tsx
│   │   │   └── PostEditor.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectEditor.tsx
│   │   └── profile/
│   │       ├── ProfileHeader.tsx
│   │       └── ProfileForm.tsx
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # NextAuth config
│   │   └── utils.ts            # Helper functions
│   ├── server/
│   │   ├── actions/
│   │   │   ├── auth.ts         # Register/login actions
│   │   │   ├── posts.ts        # Post CRUD actions
│   │   │   ├── projects.ts     # Project CRUD actions
│   │   │   └── profile.ts      # Profile update actions
│   │   └── queries/
│   │       ├── posts.ts        # Post queries
│   │       ├── projects.ts     # Project queries
│   │       └── users.ts        # User queries
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── middleware.ts           # Auth middleware
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── .gitkeep
├── .env.example
├── .env
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── PLAN.md
```

---

## Design Tokens

### Colors (Dark Mode)
- Background: `gray-950` (#0a0a0a)
- Surface: `gray-900` (#111111)  
- Border: `gray-800` (#1f1f1f)
- Text primary: `gray-50` (#fafafa)
- Text secondary: `gray-400` (#a1a1aa)
- Accent: `blue-500` (#3b82f6)

### Colors (Light Mode)
- Background: `white` (#ffffff)
- Surface: `gray-50` (#f9fafb)
- Border: `gray-200` (#e5e7eb)
- Text primary: `gray-900` (#111827)
- Text secondary: `gray-500` (#6b7280)
- Accent: `blue-600` (#2563eb)

### Typography
- Font: Inter (Next.js Google Fonts optimization)
- Heading: font-semibold, tracking-tight
- Body: font-normal, leading-relaxed
- Code: JetBrains Mono

### Spacing
- Cards: p-6, gap-6
- Page margins: max-w-5xl mx-auto px-4
- Section gaps: space-y-8
