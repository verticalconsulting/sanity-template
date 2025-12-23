# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 application integrated with Sanity CMS, built using the Schema UI component library. The project provides a production-ready page builder with pre-built components, Sanity schemas, and GROQ queries for content-driven websites.

**Key Technologies:**
- Next.js 16.0.10 with App Router
- React 19.2.3
- Sanity CMS 4.21.1
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- shadcn/ui components

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Type checking without emitting files
pnpm typecheck

# Generate Sanity TypeScript types (two-step process)
pnpm typegen
# This runs: sanity schema extract && sanity typegen generate
# Generates schema.json and updates sanity.types.ts
```

### Sanity CLI Commands

```bash
# Import sample data
npx sanity dataset import sample-data.tar.gz production --replace

# Deploy schema changes to Sanity
npx sanity schema deploy

# Extract schema to schema.json
npx sanity schema extract

# Generate TypeScript types from schema
npx sanity typegen generate
```

## Architecture Overview

### Next.js App Structure

**App Router Pattern:**
- `app/(main)/` - Main route group for public pages
- `app/studio/[[...tool]]/` - Sanity Studio embedded at `/studio`
- `app/api/` - API routes for newsletter and draft mode

**Pages are dynamically generated from Sanity:**
- Homepage: `app/(main)/page.tsx` (slug: "index")
- Dynamic pages: `app/(main)/[slug]/page.tsx`
- Blog posts: `app/(main)/blog/[slug]/page.tsx`

### Sanity Integration

**Configuration:**
- `sanity.config.ts` - Studio configuration with presentation tool, vision tool, and code input
- `sanity/env.ts` - Environment variable handling for projectId, dataset, apiVersion
- `sanity/lib/client.ts` - Sanity client with stega encoding for visual editing
- `sanity/lib/live.ts` - Live preview functionality using `next-sanity/live`

**Schema Organization:**
- `sanity/schema.ts` - Central schema registry
- `sanity/schemas/documents/` - Document types (page, post, author, category, faq, testimonial, navigation, settings)
- `sanity/schemas/blocks/` - Reusable content blocks organized by type (hero, grid, split, carousel, timeline, cta, forms, etc.)
- `sanity/schemas/blocks/shared/` - Shared schema objects (link, block-content, color-variant, button-variant, section-padding)

**Queries:**
- `sanity/queries/` - GROQ queries organized by block type and feature
- Queries follow the schema structure and include projections for all needed fields

**Studio Customization:**
- `sanity/structure.ts` - Custom Studio structure with orderable document lists
- Singleton documents: navigation and settings (restricted actions, hidden from "New document" menu)
- Orderable lists: pages, categories, authors, FAQs, testimonials

### Component Architecture

**Block-Based Rendering:**
- `components/blocks/index.tsx` - Central block renderer with component mapping
- Components are mapped to Sanity block types via `componentMap`
- Each block component receives typed props from `PAGE_QUERYResult`
- Missing block types log warnings and render placeholder divs

**Component Organization:**
- `components/blocks/` - Content blocks (hero, grid, split, carousel, timeline, cta, forms, etc.)
- `components/ui/` - shadcn/ui components and shared UI elements
- `components/header/` - Navigation components (desktop-nav, mobile-nav)
- Shared components: footer, logo, menu-toggle, portable-text-renderer, theme-provider

**Visual Editing:**
- Uses Sanity's Presentation Tool for live visual editing
- Stega encoding in client configuration enables click-to-edit functionality
- Draft mode API routes at `/api/draft-mode/enable` and `/api/draft-mode/disable`
- Resolution logic in `sanity/presentation/resolve.ts`

### Data Fetching Pattern

Pages use server-side data fetching:
1. `generateStaticParams()` - Fetches all page slugs for static generation
2. `generateMetadata()` - Fetches page data for Next.js metadata
3. Page component - Fetches page data and renders blocks

Content is fetched using `sanityFetch` from `sanity/lib/live.ts` which provides live preview support.

### Environment Variables

**Required:**
- `NEXT_PUBLIC_SITE_URL` - Full website URL (e.g., https://example.com)
- `NEXT_PUBLIC_SITE_ENV` - "development" or "production" (affects SEO indexing)
- `NEXT_PUBLIC_SANITY_API_VERSION` - Sanity API version (YYYY-MM-DD format)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name (e.g., production)
- `SANITY_API_READ_TOKEN` - Read token for fetching data

**Optional:**
- `RESEND_API_KEY` - For newsletter form functionality
- `RESEND_AUDIENCE_ID` - Resend audience/list ID

## Important Patterns

**Adding New Components:**
1. Create Sanity schema in `sanity/schemas/blocks/[category]/`
2. Add schema to `sanity/schema.ts` exports
3. Create GROQ query in `sanity/queries/[category]/`
4. Create React component in `components/blocks/[category]/`
5. Add component mapping to `components/blocks/index.tsx`
6. Run `pnpm typegen` to regenerate types

**TypeScript Types:**
- Generated types live in `sanity.types.ts` (auto-generated, don't edit manually)
- Schema JSON extracted to `schema.json`
- Use generated query result types (e.g., `PAGE_QUERYResult`)

**Singleton Documents:**
- Navigation and Settings are singleton documents (only one instance)
- Accessed via specific document IDs ("navigation", "settings")
- Restricted actions prevent duplication or deletion

**Styling:**
- Tailwind CSS 4 with PostCSS
- Color variants and button variants defined in Sanity schemas
- Theme provider supports dark mode with next-themes
- Motion library for animations

## Deployment

**Vercel Deployment:**
1. Create GitHub repository and push code
2. Import project to Vercel
3. Copy all environment variables from `.env.local`
4. Deploy
5. Configure CORS in Sanity project settings to allow production URL

**CORS Configuration:**
After deployment, add production URL to Sanity project CORS origins to enable Studio access from the deployed site.
