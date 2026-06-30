# Patient Management System — Frontend Implementation Plan

## Overview

Build a complete **React + Vite** frontend for the Patient Management microservice. The frontend communicates **exclusively** with the API Gateway at `http://localhost:4004`. All 6 pages from the design spec will be implemented with full animations, responsive design, and JWT auth.

## Architecture

```
Browser (Frontend :5173 dev)
      │
      ▼
API Gateway :4004   ← Only backend URL used
      ├── POST /auth/login
      ├── POST /auth/register
      └── GET/POST/PUT/DELETE /api/patients
```

## Proposed Changes

### [NEW] `frontend/` — React + Vite Application

---

#### [NEW] `frontend/package.json` + scaffold via Vite

Dependencies:
- `react`, `react-dom`, `react-router-dom` — routing
- `axios` — HTTP client with interceptors for JWT
- `recharts` — charting library (line chart on dashboard)
- `react-hot-toast` — toast notifications
- `lucide-react` — icons (stethoscope, users, billing, etc.)
- `date-fns` — date formatting

---

#### [NEW] `frontend/src/api/`

| File | Purpose |
|------|---------|
| `axiosInstance.js` | Base axios with base URL + JWT interceptor |
| `authApi.js` | `login()`, `register()` calls |
| `patientApi.js` | `getPatients()`, `createPatient()`, `updatePatient()`, `deletePatient()` |

---

#### [NEW] `frontend/src/context/`

| File | Purpose |
|------|---------|
| `AuthContext.jsx` | Global JWT token state, login/logout helpers, user info |

---

#### [NEW] `frontend/src/components/`

| File | Purpose |
|------|---------|
| `Layout.jsx` | Sidebar + Navbar wrapper with route outlet |
| `Navbar.jsx` | Top bar with user email + logout dropdown |
| `Sidebar.jsx` | Collapsible nav: Dashboard, Patients, Billing, Analytics |
| `StatCard.jsx` | Reusable stat cards with icon, number, trend |
| `PatientTable.jsx` | Desktop table with sort/actions |
| `PatientCard.jsx` | Mobile card view of a patient |
| `Pagination.jsx` | Page controls |
| `Modal.jsx` | Generic modal for delete confirmation |
| `ProtectedRoute.jsx` | Redirects to `/login` if no token |
| `LoadingSpinner.jsx` | Spinner for loading states |

---

#### [NEW] `frontend/src/pages/`

| File | Design Spec |
|------|-------------|
| `LoginPage.jsx` | Split-screen: blue gradient left + white form right |
| `RegisterPage.jsx` | Same split layout as login |
| `DashboardPage.jsx` | Stats, quick actions, recent patients, chart |
| `PatientListPage.jsx` | Search + filter + table + pagination |
| `PatientFormPage.jsx` | Create/Edit form with validation |
| `PatientDetailPage.jsx` | Profile tabs: Medical, Billing, History |
| `BillingPage.jsx` | Billing summary cards + invoice table |

---

#### [NEW] `frontend/src/index.css`

Full design system:
- CSS custom properties (color tokens, spacing)
- Google Fonts: Inter
- Global resets
- Utility classes

---

#### [NEW] `frontend/src/App.jsx`

React Router setup:
```
/login          → LoginPage (public)
/register       → RegisterPage (public)
/               → redirect to /dashboard
/dashboard      → DashboardPage (protected)
/patients       → PatientListPage (protected)
/patients/new   → PatientFormPage (protected)
/patients/:id   → PatientDetailPage (protected)
/patients/:id/edit → PatientFormPage (protected, edit mode)
/billing        → BillingPage (protected)
```

---

## Key Design Decisions

> [!IMPORTANT]
> The API Gateway URL is `http://localhost:4004`. All API calls go through it.
> Auth endpoints: `/auth/login`, `/auth/register`
> Patient endpoints: `/api/patients` (require `Authorization: Bearer <token>`)

> [!NOTE]
> The spec includes **Billing** and **Analytics** pages. Since your `billing-service` API endpoints aren't yet exposed through the gateway (empty billing api-requests folder), the **Billing page will use realistic mock/static data** for display purposes. It can be wired to real endpoints later.

> [!NOTE]
> The **Analytics page** in the sidebar will also use mock chart data since no analytics API is defined.

## Verification Plan

### Automated
- `npm run dev` inside `frontend/` — should start on port 5173 with no errors

### Manual
1. Login with `newuser@test.com` / `test1234` → JWT stored → redirected to dashboard
2. Navigate to Patients → list loads from API gateway
3. Create new patient → appears in list
4. View patient detail → tabs work
5. Delete patient → confirmation modal → removed from list
6. Logout → token cleared → redirected to login
7. Try accessing `/dashboard` without login → redirected to `/login`
