# EventFlow

EventFlow is a full-stack event management platform designed to streamline event organization, booking, and user management. Built with NestJS for the backend and Next.js for the frontend, it supports organizers, attendees, and admins with robust features and a modern UI.

## Features

- Organizer dashboard for event creation and management
- Attendee event booking and status tracking
- Authentication and role-based access control
- PDF generation for event details
- File uploads for event assets
- End-to-end testing with Jest
- Dockerized backend and frontend for easy deployment

## Project Structure

```
docker-compose.yml
README.md
app/
  (dashboard)/
    dashboard/
      organizer/
        events/
backend/
  Dockerfile
  ...
  src/
    auth/
    event/
    user/
    ...
frontend/
  Dockerfile
  ...
  app/
    (auth)/
    (dashboard)/
    (public)/
  components/
    dashboard/
    events/
    layout/
    providers/
    ui/
  lib/
    services/
  public/
    images/
  types/
    ...
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker (for containerized setup)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MostafaRhazlani/EventFlow.git
   cd EventFlow
   ```
2. Install dependencies for backend and frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Running with Docker

1. Build and start containers:
   ```bash
   docker-compose up --build
   ```
2. Access frontend at `http://localhost:3000` and backend at `http://localhost:5000` (default ports).

### Running Locally

- Backend:
  ```bash
  cd backend
  npm run start:dev
  ```
- Frontend:
  ```bash
  cd frontend
  npm run dev
  ```

## Testing

- Backend tests:
  ```bash
  cd backend
  npm run test
  ```
- Frontend tests:
  ```bash
  cd frontend
  npm run test
  ```

## Folder Overview

- **backend/**: NestJS API, authentication, event/user modules, config, tests
- **frontend/**: Next.js app, components, pages, services, types
- **app/**: Dashboard and organizer views
- **uploads/**: Event asset storage