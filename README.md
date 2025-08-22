# SmartDental Pro - Prototype

Quick prototype demonstrating key features:
- AI Chatbot & Symptom Checker
- Smart Appointment System
- Analytics Dashboard
- AI Medical History Lookup
- Automated Reminders
- Security & Compliance Overview

## Run Locally

Option 1: Open `index.html` directly in your browser.

Option 2: Serve locally (recommended for fetch/API in future):

1. From the repo root:
   - `npm run start`
2. Open `http://localhost:8080` in your browser.

## New Pages

- `login.html`: Doctor login (stored locally in browser)
- `register.html`: Doctor registration (adds to localStorage)
- `dashboard.html`: Doctor dashboard with:
  - Booking notifications assigned to the logged-in doctor
  - Patient lookup by ID with AI-like history summary
  - AI prescription suggestions (demo only)

Mock credentials are pre-seeded:
- Email: `drsmith@example.com`
- Password: `password123`

You can also create your own account via `register.html`.

## Project Structure

- `index.html`: Main prototype page
- `assets/css/styles.css`: Layout and component styles
- `assets/css/animations.css`: Keyframe animations
- `assets/js/modals.js`: Modal open/close logic
- `assets/js/main.js`: Chat simulation logic
- `assets/js/animations.js`: Intersection observer animations
- `assets/js/auth.js`: Local auth helpers (login/register/guard/logout)
- `assets/js/dashboard.js`: Dashboard rendering and AI-like logic

## Notes

- This is a static prototype; no backend is connected.
- All auth and data are in `localStorage` and for demo only.
- A sticky footer is included across pages using a flex layout on `body`.
- Replace placeholder details before sharing externally.
