# VitoFreshBar &mdash; Lifestyle Fresh Bar Experience

VitoFreshBar is a modern single-page application built with React + Vite that showcases a premium juice & healthy bowls brand. The interface combines a cinematic hero, curated product collections, and an immersive admin console so you can manage an entire fresh bar menu from one experience.

## 🌿 Concept & Goals

- **Lifestyle-first feeling:** warm Instagram-inspired palette, bold hero, and full-bleed product cards to invite customers into the brand world.
- **Real product management:** every item (smoothies, bowls, detox sets) lives in Firestore, so updates instantly reflect in the public catalogue.
- **Seamless shopping preview:** visitors can browse categories, view detailed product pages, like favorites, and add to cart.
- **Integrated admin tools:** authenticated managers can add, edit, deactivate, or delete menu items with visual controls and helpful filters.

## ✨ Key Features

### Public Website
- Big hero section with a “freshly prepared in front of you” message.
- Responsive navigation with categories, promotions, contact details, and promotion CTA button.
- Menu page with URL-driven categories (e.g., `/menu/salads`) showing only active Firestore items.
- Product details page highlighting ingredients, nutrition, weight, and interactive likes/buy button.
- Polished footer with social links and payment icons.

### Authentication & Profiles
- Email/password login and registration via Firebase Auth.
- Persistent sessions (local storage) paired with Firestore profiles (name, phone, role).
- Profile dropdown inside the header for quick account management and logout.

### Admin Console
- Role-guarded `/admin` area available only to users with `isAdmin` role.
- Dashboard shell with greeting, quick actions, and status cards.
- Products module with filters (category, status, price order), multi-select bulk actions, activation/deactivation, and delete handling.
- Product form for create/edit with validation, category dropdown, isActive toggle, and image URL field.

### Firestore Back-End
- Collections: `products` and `users`.
- Product schema enforced through the API `normalize()` helper (title, description, price, likes, category, weight, isActive, createdAt).
- CRUD operations + `toggleLike` implemented with Firestore transactions.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router 7.
- **Styling:** Custom CSS (layout, hero, header, footer, admin, product cards) + Instagram-inspired mint/coral/yellow palette.
- **Backend Services:** Firebase (Firestore + Auth).
- **Tooling:** TypeScript-ready configuration, ESLint-friendly tsconfig, modern bundler settings.

## 🚀 Getting Started

```bash
git clone <repo-url>
npm install
npm run dev
```

Set up your Firebase project, copy its config into `src/firebase.js`, and ensure Firestore + Auth are enabled.

## 🔐 Admin Test Account

Use this account to explore the administration workflow:

- **Email:** `vito@fresh.bar`
- **Password:** `FreshBarVito#123@`

Once logged in, open `/admin` (or use the profile dropdown) to access the dashboard and product management tools.

## 📸 Screens Worth Checking

- `Home` & `HomeInfo` &rarr; immersive hero with CTA buttons.
- `Menu` &rarr; category filters, responsive grid, ProductCard component.
- `Details` &rarr; likes, nutritional info, buy button w/ auth guard.
- `AdminLayout` &rarr; modern console with quick actions, filters, and CRUD.

## ✅ Checklist Highlights

- Firebase configured with Firestore + Auth integration.
- Product API fully migrated to Firestore (getAll, getOne, create, update, remove, toggleLike).
- Route guards for guests, authenticated users, and admins.
- Dynamic category filtering, loading/error messaging, likes, and cart additions.
- Admin console with create/edit/delete/deactivate workflows, plus bulk operations.

Enjoy building on VitoFreshBar! Combine the lifestyle visuals with Firebase data to craft your perfect fresh bar experience. 💚
