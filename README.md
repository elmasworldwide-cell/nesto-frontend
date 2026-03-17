# NESTO Frontend

A modern production-ready frontend for a Tanzanian rental platform built with React + TypeScript, Vite, and TailwindCSS.

## Features

- Home page (landing) with search and featured properties
- Authentication (login, register, password reset, OTP verification)
- User dashboard (profile, bookings, saved rooms, messages, payments)
- Property listing and details
- Agent panel (verify properties, manage landlords)
- Marketplace section
- Video browsing section
- Messaging system
- Admin dashboard (users, properties, analytics)
- Responsive design and mobile-first UI

## Getting Started

```bash
cd nesto
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Environment Variables

- `VITE_API_BASE` - base URL for the Flask backend API (e.g. `http://localhost:5000/api`)
- `VITE_GOOGLE_MAPS_KEY` - Google Maps Javascript API key for property location display

## Folder Structure

- `src/` - application source code
  - `components/` - reusable UI components
  - `pages/` - individual route components
  - `hooks/` - custom React hooks
  - `services/` - API helpers and service functions
  - `types/` - TypeScript type definitions

## Styling

TailwindCSS is used for styling; theme colors are defined in `tailwind.config.js`.

## Notes

This repo is scaffolded with essential components and routes. You can expand each page with detailed UI, forms,
API calls, and state management as needed.

Integration with Google Maps, authentication flows, property search filtering, chat features, and admin analytics
will require connecting to your Flask backend and further component development.
