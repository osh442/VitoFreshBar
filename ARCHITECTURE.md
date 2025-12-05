# Architecture Overview – VitoFreshBar React

## Tech Stack

- **React 18 + Vite** – SPA shell, hooks, fast dev server.
- **React Router 6** – declarative routing with guard components.
- **Context API** – centralised auth and cart state (`AuthContext`, `CartContext`) exposed through hooks (`useAuth`, `useCart`).
- **Firebase** – Authentication (email/password + optional phone OTP) and Cloud Firestore for persistent data.

## Folder Structure (condensed)

```
src/
  api/            Firebase wrappers (auth.js, products.js)
  assets/         Static images (logo, illustrations)
  components/     Reusable UI blocks (Header, Footer, Hero, cards)
  contexts/       Auth + Cart providers
  hooks/          Custom hooks (useAuth, useCart, useProducts, etc.)
  pages/          Route views (Home, Menu, Details, Admin, Info pages)
  router/         AppRouter + RouteGuards (GuestRoute, PrivateRoute, AdminRoute)
  styles/         Global CSS files
  utils/          Currency, format helpers
  firebase.js     Firebase initialisation (shared `auth` + `db`)
```

## Data Flow

### Authentication
1. **Registration** (`auth.js > register`)
   - Calls `createUserWithEmailAndPassword`.
   - Creates `users/{uid}` document with `isAdmin: false`, `phone`, `name`, `email`, `password`.
2. **Login**
   - Uses `signInWithEmailAndPassword`.
   - If Firebase Auth returns `auth/user-not-found` or `auth/invalid-credential`, the code looks for an existing Firestore document and, when the stored password matches, creates the missing Auth record automatically (used for seeded admin accounts).
3. **AuthContext**
   - Stores `{ user, token }` in `localStorage` (`vitoFreshBar-auth`).
   - Listens to `onAuthStateChanged` and refreshes the profile by reading `users/{uid}`.
   - `isAdmin` is derived from the Firestore field, so toggling it in the DB immediately controls admin access.
4. **Master Admin**
   - Firestore document (and login credentials) to verify admin flows:
     - Email: `vito@fresh.bar`
     - Password: `FreshBarVito#123@`
     - Field: `isAdmin = true`
   - Admin routes (`/admin`, `/admin/products`, `/admin/products/...`) are wrapped in `<AdminRoute />` which checks `useAuth().isAdmin`.

### Products

- Implemented in `src/api/products.js` via Firestore collection `products`.
- `getAll`, `getOne`, `create`, `update`, `remove`, `toggleLike` use modular SDK helpers.
- Each document stores title, category, price, calories, weight, likes (array of user IDs) and `createdAt`.

### Routing

- `AppRouter.jsx` defines public pages (`/`, `/menu`, `/details/:id`, `/about`, `/contact`, `/promotion`, `/delivery`, `/payment`, `/terms`, `/privacy`) and secured sections.
- Guards:
  - `<PrivateRoute>` – `/order`, `/profile`, `/edit/:id`.
  - `<GuestRoute>` – `/login`, `/register`.
  - `<AdminRoute>` – `/admin` layout and nested routes.

## UX Notes

- Header with dropdown menu for categories and dynamic logo image (`src/assets/images/VitoFreshBar.png`).
- Footer with informational links and payment icons.
- Delivery/Payment/Terms/Privacy pages added for informational sections.
- Login screen also offers phone-based OTP via `PhoneLogin` component (requires Phone provider enabled in Firebase).

## Persistence Summary

| Resource  | Storage                         | Notes                                         |
|-----------|----------------------------------|-----------------------------------------------|
| Auth      | Firebase Authentication          | Email/password + optional phone OTP           |
| Users     | Firestore collection `users`     | `isAdmin`, profile fields, fallback password  |
| Products  | Firestore collection `products`  | CRUD via admin UI                             |
| Sessions  | `localStorage` (`vitoFreshBar-auth`)   | Cached user & token for fast reloads          |

## Deployment Checklist

1. Configure `src/firebase.js` with production credentials.
2. Enable Email/Password (and Phone if needed) in Firebase Authentication.
3. Ensure Firestore security rules allow required CRUD operations.
4. Seed admin account (or set `isAdmin` manually) so the admin panel can be accessed.
5. Build with `npm i` and after that `npm run build` and deploy the `dist` folder (e.g., Vercel, Netlify, Firebase Hosting).
