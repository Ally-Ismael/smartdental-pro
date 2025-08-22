# SmartDental Pro Prototype

A lightweight, static prototype demonstrating core flows:

- Public site (Home, About, Services, Contact)
- Booking flow with date/time selection and summary
- AI chatbot mock for symptom triage
- Patient, Staff, Admin portals (view/cancel/filter appointments, KPIs)
- New: Login and Register pages
- New: Doctor Dashboard (notifications, patient history lookup, AI suggestions)

## Run
Option 1: open `smartdental-pro/index.html` in a browser.

Option 2: serve locally
```bash
cd /workspace/smartdental-pro
python3 -m http.server 5173
# open http://localhost:5173
```

## Notes
- Data persists in `localStorage` only.
- This is a clickable demo; integrations (SMS/Email/WhatsApp, EHR, auth) are mocked.