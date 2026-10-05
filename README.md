# Rntl — Find Your Perfect Home

A premium house rental web application built with React, Tailwind CSS, and Firebase.

## Features

- **Dark/Light Mode** — Smooth theme transitions with system preference detection
- **Multi-language (i18n)** — English and Hindi support
- **Geolocation** — Automatic nearby property sorting using Haversine formula
- **Google Maps** — Embedded map modals for each property
- **Firebase Auth** — Google sign-in and anonymous guest login
- **Admin Dashboard** — Full CRUD for property management
- **Property Details** — Images, video tour, pricing breakdown (Rent + Brokerage + GST)
- **EMI Calculator** — Interactive loan calculator with sliders
- **Favorites** — Save properties to your Firebase-backed favorites
- **Enquiry Form** — Submit enquiries directly from property pages
- **Services** — Buy and Rent service listings (legal, movers, cleaning, etc.)

## Tech Stack

- **Frontend:** React 19 + Tailwind CSS v4 + Lucide Icons
- **Backend:** Firebase (Firestore + Auth)
- **Routing:** React Router v7
- **Design:** Glassmorphism, DM Sans font, smooth animations

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  ├── components/       # Reusable UI components
  │   ├── Navbar.js
  │   ├── PropertyCard.js
  │   ├── MapModal.js
  │   ├── LocationPrompt.js
  │   ├── EnquiryForm.js
  │   └── Footer.js
  ├── contexts/         # React contexts
  │   ├── ThemeContext.js
  │   ├── LanguageContext.js
  │   ├── LocationContext.js
  │   └── AuthContext.js
  ├── i18n/             # Translation files
  │   ├── en.json
  │   └── hi.json
  ├── pages/            # Route pages
  │   ├── Home.js
  │   ├── Login.js
  │   ├── PropertyDetails.js
  │   ├── Favorites.js
  │   ├── AdminDashboard.js
  │   ├── Services.js
  │   └── EMICalculator.js
  ├── utils/
  │   └── haversine.js  # Distance calculation
  ├── firebase.js       # Firebase config
  ├── App.js            # Router + layout
  └── index.js          # Entry point
```

## Admin Access

Admin access is granted to pre-configured email addresses. Login with Google using an authorized admin email to access the Admin Panel.

## Deployment

Build for production:

```bash
npm run build
```
