# MPSC Gamified Quiz App

A full-stack MERN application for MPSC preparation with features like points, levels, streaks, and badges.

## Features
- **Modern UI:** Clean, responsive design using React and Tailwind CSS.
- **Gamification:** Points system, level progression, daily streak counter, and badges.
- **Real-time Quiz:** 30-second timer per question, automatic transitions, and instant feedback.
- **Secure Auth:** JWT-based authentication for registration and login.
- **Dashboard:** Comprehensive overview of user progress and achievements.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide React, Axios.
- **Backend:** Node.js, Express, MongoDB, Mongoose.
- **Database:** MongoDB Atlas.

## Folder Structure
```text
mpsc/
├── backend/            # Express Server
│   ├── src/
│   │   ├── config/     # DB connection
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   ├── helper/     # Auth & error handlers
│   │   └── middleware/ # JWT verification
│   ├── index.js        # Entry point
│   └── seed.js         # Sample quiz data
└── frontend/           # React App
    ├── src/
    │   ├── api/        # Axios instance
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth state management
    │   ├── pages/      # Route components (Login, Quiz, etc.)
    │   └── App.jsx     # Routing setup
```

## Installation Steps

### 1. Clone the repository
```bash
git clone <repo-url>
cd mpsc
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Update `.env` with your `MONGODB_URI` and `JWT_SECRET`.
- Seed sample quizzes:
```bash
node seed.js
```
- Start server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## Deployment Guide

### MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get the connection string and update the `MONGODB_URI` in `backend/.env`.

### Backend on Render
1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Add environment variables from your `.env` file.
5. Build Command: `npm install`
6. Start Command: `node index.js`

### Frontend on Vercel
1. Push your code to GitHub.
2. Import the project on [Vercel](https://vercel.com/).
3. Set the Root Directory to `frontend`.
4. Add environment variable `VITE_API_URL` pointing to your Render backend URL (e.g., `https://your-app.onrender.com/api`).
5. Deploy.

---
Created with ❤️ by Antigravity
