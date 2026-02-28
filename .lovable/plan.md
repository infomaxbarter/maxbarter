

## Plan: Fix Broken Links, Complete Admin CRUD, System Improvements

### Issues Found

1. **Broken URL references**: Several pages still use old Spanish URLs (`/productos/`, `/usuarios/`) instead of English (`/products/`, `/users/`)
   - `ProductDetailPage.tsx` line 100: `/usuarios/` should be `/users/`
   - `UserDetailPage.tsx` line 106: `/productos/` should be `/products/`
   - `MapPage.tsx` lines 48, 61: `/productos/` and `/usuarios/`

2. **Admin Dashboard missing CRUD for Offers**: Offers tab has no edit modal — only status select inline. No full edit modal with message editing, product info display.

3. **Admin Dashboard missing CRUD for Users**: Users can be edited and roles managed, but no delete user functionality and no "create user" option.

4. **ExchangeRequestsPage**: Missing LocationPicker integration in the create form. Missing seed data fallback.

5. **CreateProductPage**: Missing LocationPicker integration.

6. **OffersPage**: No seed data fallback — shows empty when DB is empty.

7. **Admin Offers tab**: Doesn't show product names (from_product/to_product titles).

---

### Implementation Steps

#### 1. Fix all broken Spanish URL references
- `ProductDetailPage.tsx`: `/usuarios/` → `/users/`
- `UserDetailPage.tsx`: `/productos/` → `/products/`
- `MapPage.tsx`: `/productos/` → `/products/`, `/usuarios/` → `/users/`

#### 2. Enhance Admin Dashboard Offers CRUD
- Add full edit offer modal (message, status, from/to product display)
- Add delete offer confirmation
- Show product titles in the offers table (from_product → to_product)

#### 3. Add LocationPicker to CreateProductPage
- Import and integrate LocationPicker below the location text input
- Store latitude/longitude and send with product creation

#### 4. Add LocationPicker to ExchangeRequestsPage create form
- Add LocationPicker to the create request modal
- Store lat/lng in form state and include in mutation

#### 5. Add seed data fallback to OffersPage
- Import seed data, use `withSeedFallback` when user has no offers
- Show seed offers for guests/empty state

#### 6. Add seed data fallback to ExchangeRequestsPage
- Use `withSeedFallback` for requests list when DB returns empty

---

### Files to Edit

| File | Changes |
|------|---------|
| `src/pages/ProductDetailPage.tsx` | Fix `/usuarios/` → `/users/` |
| `src/pages/UserDetailPage.tsx` | Fix `/productos/` → `/products/` |
| `src/pages/MapPage.tsx` | Fix `/productos/` → `/products/`, `/usuarios/` → `/users/` |
| `src/pages/AdminDashboard.tsx` | Enhanced offers CRUD modal, product name display in offers table |
| `src/pages/CreateProductPage.tsx` | Add LocationPicker for lat/lng |
| `src/pages/ExchangeRequestsPage.tsx` | Add LocationPicker + seed data fallback |
| `src/pages/OffersPage.tsx` | Add seed data fallback |

