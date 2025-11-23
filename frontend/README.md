# VKuniverse Portfolio

A modern, premium portfolio built with React + Vite, showcasing a dynamic UI and full‑stack features.

## Highlights & Unique Features

- **Starry Background** – Animated star field component (`StarBackground`) integrated globally.
- **Contact Page** – Dedicated `/contact` route with reusable `ContactForm`.
- **Achievements Filters** – Category buttons (All, Hackathon, LeetCode, Certification, Award) with smooth UI.
- **Scroll‑to‑Top on Navigation** – `ScrollToTopOnMount` ensures each route loads at the top.
- **Line‑Clamp Compatibility** – Added standard `line‑clamp` property for blog excerpts and project cards.
- **Admin Dashboard Enhancements**
  - Logout redirects to home page.
  - New **Messages** tab to view, mark as read, and delete contact form submissions.
  - Integrated `Messages` component with styled UI.
- **Hero Section Updates** – New tagline, updated titles, and personalized welcome text.
- **Responsive Design** – Fluid layouts, glass‑morphism effects, and micro‑animations throughout.

## Tech Stack

- **Frontend:** React, Vite, vanilla CSS (CSS variables for design tokens)
- **Backend:** Node.js, Express, MongoDB (API for messages, authentication)
- **Icons:** React‑Icons, custom SVG assets
- **Deployment:** Runs with `npm run dev` (frontend) and `node server.js` (backend)

## Getting Started

```bash
# Install dependencies
npm install

# Run frontend
npm run dev

# Run backend
node server.js
```

Explore the live site at `http://localhost:5173`. The admin panel is accessible at `/admin` (login required).

---

Feel free to customize further—add new sections, update styles, or extend backend routes. Happy coding!
