# EventFlow - Project Planning & Requirements

## Project Context

An organization (training center, company, association, or coworking space) regularly organizes events (training sessions, workshops, conferences, internal meetings).

Currently, event and registration management is primarily done manually (Excel spreadsheets, simple forms, email or messaging), resulting in:

- A lack of real-time visibility into available events and remaining spaces.
- Booking errors (duplicates, overbooking).
- Difficulty tracking booking status (pending, confirmed, canceled).
- Unreliable access control: who can create an event, who can approve or reject a booking.
- A lack of centralized information regarding participants and booking history.

**Objective:** Design and develop a web application to manage events and their bookings, with rigorous role management, security, software quality, and industrialization.

---

## Features

Set up a web-based event booking application that allows users to:

- Create, modify, publish, and cancel events.
- Display a public catalog of available events.
- Manage capacity and the number of remaining places.
- Allow users to reserve a place at an event.
- Manage the booking lifecycle (request, confirmation, refusal, cancellation).
- Centralize information related to events and participants.

---

## User Roles and Features

### Admin
- Approves or rejects organizer requests.
- Views the complete list of bookings:
  - by event
  - by participant
  - by organizer
- Confirms or refuses a booking.
- Cancels a booking (even a confirmed one) if necessary.
- Accesses basic metrics:
  - upcoming events, occupancy rate, and distribution of bookings by status.
- Manages organizers (approve/reject organizer requests).

### Organizer (requires Admin approval)
- **Before approval:** Cannot access dashboard, sees "pending approval" status.
- **After approval (`isApproved: true`):**
  - Creates, modifies, publishes, and cancels their OWN events.
  - Defines event information: title, description, date and time, location, and maximum capacity.
  - Views bookings for their own events.
  - Confirms or refuses bookings for their own events.
  - Accesses metrics for their own events.

### Participant
- Views the list of published events (public page).
- View event details.
- Can request to become an Organizer ("Be Organizer" button in header).
- Make a reservation if the rules are met.
- View your reservation list.
- Cancel your reservation according to the defined rules.
- Download a PDF ticket/PDF confirmation only if the reservation is confirmed.

---

## Project Planning on Jira (REQUIRED)

Project planning must be done on Jira and is an integral part of the assessment.

The learner must:

- Create a dedicated Jira project.
- Structure the work into:
  - Epics (e.g., Authentication, Event Management, Reservations, Front-end, Back-end, Tests, Docker, CI/CD)
  - User Stories/Tasks
  - Sub-tasks
- Connect Jira with GitHub:
  - Reference tickets in commit messages (e.g., SC2-15)
- Implement at least one automation rule:
  - Example: automatically marking a ticket as Done when an associated PR is merged.
- Be able to explain the planning and progress during the presentation.

---

## Back-end Component

Develop your application using **NestJS (TypeScript)** and a **MongoDB** or **PostgreSQL** database.

### Mandatory Technical Requirements
- Modular architecture (modules, controllers, services).
- Use of DTOs and validation (class validators).
- Secure authentication with JWT.
- Implementation of a role-based authorization system (Admin/Participant).
- Protection of sensitive routes.
- Centralized error handling (Global Error Handling).
- Proper handling of HTTP codes and error messages.

### Mandatory Business Rules
- An event has a status: `DRAFT`, `PUBLISHED`, `CANCELED`.
- Only `PUBLISHED` events are publicly visible.
- A reservation has a status: `PENDING`, `CONFIRMED`, `REFUSED`, `CANCELED`.
- A participant cannot book:
  - a canceled or unpublished event
  - a sold-out event
  - an event they have already booked (active booking).
- The maximum capacity of an event must never be exceeded.
- The PDF ticket can only be downloaded for a `CONFIRMED` booking.

### Back-end Tests (MANDATORY)
- Unit tests (Jest) on critical business services:
  - events
  - bookings
  - authentication
- End-to-end tests covering a complete scenario with distinct roles.

---

## Front-end (Next.js)

Develop your application using **Next.js + TypeScript**.

### Mandatory Technical Requirements
- Combined use of:
  - **SSR** for public pages (event list and details)
  - **CSR** for authenticated areas (dashboards)
- Routing with dynamic routes (`/events/[id]`).
- Route protection based on role (Admin / Participant).
- Secure communication with the API (JWT).
- Global state management with **Redux** or **Context API**.
- Form handling, client-side validation, and error display.

### Front-end Testing
- Component testing with the React Testing Library.
- Testing of a functional flow (e.g., booking or cancellation).

---

## Architecture Summary

| Area | Technology | Notes |
|------|------------|-------|
| Backend | NestJS + TypeScript | MongoDB database |
| Frontend | Next.js + TypeScript | SSR (public) + CSR (dashboard) |
| Auth | JWT | Role-based (Admin/Organizer/Participant) |
| State | Redux or Context API | Global state management |
| Testing | Jest + React Testing Library | Unit + E2E tests |
| CI/CD | Docker + GitHub Actions | Jira integration |

---

## Key Implementation Notes

### SSR vs CSR Strategy
- **SSR (Server-Side Rendering):** Public pages
  - `/` - Home page (with "Be Organizer" button in header)
  - `/events` - Public event catalog (only PUBLISHED events)
  - `/events/[id]` - Event details + booking for participants
- **CSR (Client-Side Rendering):** Authenticated areas
  - `/dashboard/admin` - Admin dashboard (manage organizers, all events, metrics)
  - `/dashboard/organizer` - Organizer dashboard (only if approved)
  - `/dashboard/participant` - Participant reservations
  - `/login`, `/register` - Auth pages

### Organizer Approval Flow
```
Participant clicks "Be Organizer"
         ↓
role: ORGANIZER, isApproved: false
         ↓
Admin approves request
         ↓
isApproved: true → Can access Organizer Dashboard
```

### Event Status Flow
```
DRAFT → PUBLISHED → CANCELED
         ↓
    (visible to public)
```

### Booking Status Flow
```
PENDING → CONFIRMED → CANCELED
    ↓
  REFUSED
```

### Booking Rules
1. Only PUBLISHED events can be booked
2. Cannot exceed maxParticipants
3. One active booking per participant per event
4. PDF ticket only for CONFIRMED bookings
