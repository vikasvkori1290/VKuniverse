# 🌌 VK Universe — Full-Stack Portfolio 

<div align="center">

**A modern, dynamic, an full-stack personal digital ecosystem built with the MERN stack.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-VK%20Universe-0284c7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://vkuniverse.netlify.app)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)

</div>

---

## 📖 Overview

**VK Universe** is not just a static developer portfolio—it is a live, full-stack content management platform and interactive community playground. Built from the ground up to showcase engineering depth, real-time analytics, dynamic blogging with clipboard image uploads, gamified achievement tracking, and live LeetCode problem-solving statistics.

---

## 🌟 Key Highlights & Features

### 1. 🛡️ Custom Admin Command Center
- **Dynamic Content Management**: Create, update, publish, and delete projects, skills, blogs, and achievements with zero code redeployment.
- **Media Upload Pipeline**: Direct drag-and-drop, file picker, and clipboard image/video uploads integrated with **Cloudinary CDN**.
- **Message Inbox**: View and manage incoming contact inquiries directly from the admin interface.

### 2. 💖 Community Liking & Supporter Analytics
- **1-Click Stored Name Liking**: Readers and visitors enter their name once; their identity is remembered for seamless 1-click likes across all projects and articles.
- **Real-Time Like Synchronization**: Live like counters synchronized globally across cards, detail views, and backend storage.
- **Admin Supporter Leaderboard**: Dedicated analytics dashboard displaying top supporters, contribution breakdowns (projects vs. blogs), and complete like moderation tools (delete/remove likes).

### 3. 📝 Markdown Technical Blog Platform
- **Clipboard (`Ctrl + V`) Image Upload**: Paste images directly into the content textarea at your cursor; they are automatically uploaded to Cloudinary and inserted in markdown.
- **Smart Side-by-Side Images**: Consecutive images automatically group into a responsive 2-column or 3-column side-by-side gallery.
- **Full-Resolution Lightbox**: Click on any screenshot, code snippet, or graphic to open an HD lightbox viewer with backdrop blur and keyboard navigation (`Esc`).
- **Live Preview & Editor Toolbar**: Real-time markdown preview with quick formatting shortcuts.

### 4. 🏆 Gamified Level Roadmap & Featured Milestones
- **Level Map Journey**: Interactive chronological roadmap of competitions, awards, and milestones featuring an animated `🚀 Current` player pin.
- **Category Filtering**: Instant filtering across Hackathons, LeetCode, Certifications, and Awards.
- **Home Spotlight Card**: Prominently highlights major victories (e.g. *CodeFury 9.0 2nd Runner-Up, Team ZENFORGE*).

### 5. 💻 Interactive Live Coding Stats
- **LeetCode Live Tracker**: Connects to the LeetCode API to display real-time problem-solving statistics, submission heatmaps, and ranking progress.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-performance SPA with instant HMR |
| **Styling** | Vanilla CSS Modules | Tailored design system, glassmorphism, responsive grids |
| **Icons & Typography** | React Icons, Google Fonts | Inter, JetBrains Mono, Outfit |
| **Backend API** | Node.js, Express.js | RESTful API architecture, routing, rate limiting |
| **Database** | MongoDB Atlas, Mongoose | Schema validation, relational tracking for likes & media |
| **Cloud Storage** | Cloudinary API | Media optimization, automatic format delivery, CDN |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt | Secure admin authentication and session handling |
| **Deployment** | Netlify (Frontend), Render (Backend) | Global edge distribution & continuous deployment |

---

## 📁 Project Structure

```
vkportfolio/
├── backend/
│   ├── config/             # Database connection & env setup
│   ├── controllers/        # Business logic (projects, blogs, analytics, likes, auth)
│   ├── middleware/         # JWT auth, error handlers, upload helpers
│   ├── models/             # Mongoose schemas (Project, BlogPost, Achievement, Skill, User)
│   ├── routes/             # REST API route declarations
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── public/             # Static assets, favicon, resume PDF
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, Hero, Footer, Lightbox, etc.)
│       │   ├── admin/      # Admin dashboard widgets & managers
│       │   └── common/     # Modals, buttons, toast notifications
│       ├── context/        # DataContext for real-time state management
│       ├── pages/          # Page routes (Home, Projects, Blog, BlogPost, Achievements, Admin)
│       ├── styles/         # CSS Modules for modular component styling
│       └── utils/          # URL helpers, API services, formatting utils
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for media hosting

### 1. Clone the repository
```bash
git clone https://github.com/vikasvkori1290/VKuniverse.git
cd VKuniverse
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend dev server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 👨‍💻 Author & Connect

**Vikas V**  
*Software & AI Developer • Bangalore, Karnataka, India*

- 🌐 **Portfolio**: [vkuniverse.netlify.app](https://vkuniverse.netlify.app)
- 💼 **LinkedIn**: [linkedin.com/in/vikas-v-4a4749330](https://www.linkedin.com/in/vikas-v-4a4749330/)
- 💻 **GitHub**: [github.com/vikasvkori1290](https://github.com/vikasvkori1290)
- 🧠 **LeetCode**: [leetcode.com/u/Vikasvkori129/](https://leetcode.com/u/Vikasvkori129/)
- ⚡ **Codeforces**: [codeforces.com/profile/vikasvkori129](https://codeforces.com/profile/vikasvkori129)
- 📧 **Email**: [vikasvkori129@gmail.com](mailto:vikasvkori129@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ and continuous dedication by Vikas V.</sub>
</div>
