# EventFlow - Frontend Structure

## App Directory Structure

```
app/
├── (public)/                       # SSR - Public pages
│   ├── page.tsx                    # SSR - Home page
│   ├── events/
│   │   ├── page.tsx                # SSR - event list (PUBLISHED only)
│   │   └── [id]/
│   │       └── page.tsx            # SSR - event details + booking
│   └── layout.tsx                  # Public layout (with Header: "Be Organizer" button)
│
├── (auth)/                         # CSR - Auth pages
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx
│
├── (dashboard)/                    # CSR - Protected area
│   ├── layout.tsx                  # Auth + role protection + Sidebar
│   │
│   └── dashboard/
│       ├── admin/                  # Admin only
│       │   ├── page.tsx            # Admin dashboard overview
│       │   ├── organizers/
│       │   │   └── page.tsx        # Manage organizer requests (approve/reject)
│       │   ├── events/
│       │   │   └── page.tsx        # View all events
│       │   ├── bookings/
│       │   │   └── page.tsx        # All bookings management
│       │   └── metrics/
│       │       └── page.tsx        # Platform metrics
│       │
│       ├── organizer/              # Organizer only (if isApproved: true)
│       │   ├── page.tsx            # Organizer dashboard overview
│       │   ├── events/
│       │   │   ├── page.tsx        # My events list
│       │   │   └── create/
│       │   │       └── page.tsx    # Create new event
│       │   ├── bookings/
│       │   │   └── page.tsx        # Bookings for my events
│       │   └── pending-approval/
│       │       └── page.tsx        # Shown when isApproved: false
│       │
│       └── participant/            # Participant area
│           ├── page.tsx            # Participant dashboard
│           ├── reservations/
│           │   └── page.tsx        # My reservations
│           └── tickets/
│               └── [id]/
│                   └── page.tsx    # Download PDF ticket (if CONFIRMED)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Public header with "Be Organizer" button
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx             # Dashboard sidebar
│   ├── events/
│   │   ├── BookEventButton.tsx     # Client component for booking
│   │   └── EventsTable.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── LogoutButton.tsx
│
├── lib/
│   ├── axios.ts                    # Axios client configuration
│   ├── api/
│   │   ├── events.ts               # Event API calls (client-side)
│   │   ├── events.server.ts        # Event API calls (server-side)
│   │   └── auth.ts                 # Auth API calls
│   └── actions/
│       ├── login.ts
│       ├── logout.ts
│       └── register.ts
│
├── middleware.ts                   # Route protection by role
│
└── globals.css
```

## Rendering Strategy

| Route Group | Rendering | Description |
|-------------|-----------|-------------|
| `(public)` | **SSR** | Public pages - home, event catalog & details |
| `(auth)` | **CSR** | Login & register pages |
| `(dashboard)/dashboard/admin` | **CSR** | Admin protected area |
| `(dashboard)/dashboard/organizer` | **CSR** | Organizer protected area (requires approval) |
| `(dashboard)/dashboard/participant` | **CSR** | Participant protected area |

## User Roles

| Role | Access | Notes |
|------|--------|-------|
| `ADMIN` | Full platform access | Approves organizers, manages everything |
| `ORGANIZER` | Own events + bookings | Requires `isApproved: true` |
| `PARTICIPANT` | Public pages + reservations | Can request to become Organizer |

## Organizer Approval Flow

```
1. Participant clicks "Be Organizer" button (in Header)
2. Backend: role → ORGANIZER, isApproved → false
3. Organizer sees "Pending Approval" page in dashboard
4. Admin sees pending requests in /dashboard/admin/organizers
5. Admin approves → isApproved: true
6. Organizer can now access full Organizer dashboard
```

## Route Protection (middleware.ts)

| Route | Allowed Roles | Additional Check |
|-------|---------------|------------------|
| `/dashboard/admin/*` | ADMIN | - |
| `/dashboard/organizer/*` | ORGANIZER | `isApproved === true` |
| `/dashboard/participant/*` | PARTICIPANT, ORGANIZER | - |
| `/events/*` | Public | SSR, no auth |

## Key Files

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection, role-based redirects |
| `providers/auth-provider.tsx` | Global auth state with user role |
| `lib/axios.ts` | Axios config with credentials |
| `components/layout/Header.tsx` | Public header with "Be Organizer" CTA |
| `lib/auth.ts` | Auth helpers (token management, etc.) |
