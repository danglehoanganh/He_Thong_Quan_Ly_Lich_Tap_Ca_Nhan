# My App - Full-Stack User Profile and Progress Tracker

## Project Overview

This is a full-stack web application built with Next.js (frontend) and Express.js (backend). It provides user authentication, profile management, onboarding, home dashboard, and progress tracking features. The profile page includes data visualizations using Chart.js. The backend handles user data with MongoDB (via Mongoose) or MySQL, authentication (JWT), and API routes for auth and profiles.

Key Features:
- User registration and login (with JWT tokens).
- Profile viewing and editing.
- Onboarding flow for new users.
- Home dashboard.
- Progress tracking with charts (e.g., pie charts in profile).
- Secure API endpoints with middleware.

Tech Stack:
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Chart.js (for visualizations).
- **Backend**: Node.js, Express 5, Mongoose (MongoDB), MySQL2, JWT, bcryptjs.
- **Database**: Supports MongoDB or MySQL (configured in backend/config/db.js).
- **Other**: ESLint for linting, dotenv for environment variables.

## Prerequisites

- Node.js (v18 or later) installed.
- npm or yarn as package manager.
- MongoDB (local or Atlas) or MySQL server for the database.
- Git (optional, for version control).

## Setup Instructions

### 1. Clone and Navigate
Assuming the project is already cloned to `c:/Users/Admin/Downloads/chuyen doi so BTL/my-app` (adjust path as needed):

```bash
cd my-app
```

### 2. Backend Setup
The backend is in the `backend/` directory.

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
- Copy `.env.example` to `.env` if available, or create `backend/.env` with:
  ```
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/myappdb  # Or your MongoDB connection string
  MYSQL_HOST=localhost
  MYSQL_USER=youruser
  MYSQL_PASSWORD=yourpassword
  MYSQL_DATABASE=myappdb
  JWT_SECRET=your_jwt_secret_here  # Generate a strong secret
  ```
- Note: The project includes both MongoDB (Mongoose) and MySQL (mysql2) support. Choose one in `backend/config/db.js` and update accordingly.

#### Database Setup
- For MongoDB: Ensure MongoDB is running locally or provide a cloud URI.
- For MySQL: Create the database and run any schema migrations if defined in models (e.g., User.js).

### 3. Frontend Setup
The frontend is the main Next.js app.

#### Install Dependencies
The current `package.json` is minimal. Install core and missing dependencies (including those for charts causing build errors):

```bash
cd ..  # Back to my-app root
npm install
npm install chart.js react-chartjs-2 chartjs-plugin-datalabels  # For profile charts
npm install @types/node  # If needed for TypeScript-like features
# Optional: For auth/forms - react-hook-form, @headlessui/react (if used)
```

- Tailwind CSS is configured via PostCSS; no additional install needed if using the provided config.

#### Environment Configuration
Create `.env.local` in the root:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Backend API base URL
```

### 4. Project Structure
```
my-app/
├── backend/          # Express server
│   ├── config/       # DB config
│   ├── controllers/  # Auth and profile logic
│   ├── middleware/   # Auth middleware
│   ├── models/       # User model (Mongoose/MySQL)
│   ├── routes/       # API routes
│   ├── server.js     # Entry point
│   └── package.json
├── src/app/          # Next.js app router pages
│   ├── auth/         # Login/Signup pages
│   ├── home/         # Dashboard
│   ├── onboarding/   # Onboarding flow
│   ├── profile/      # Profile with charts
│   ├── progress/     # Progress tracking
│   ├── services/     # API client (api.js)
│   ├── globals.css   # Tailwind styles
│   └── layout.js     # Root layout
├── components/       # Reusable UI (e.g., AuthModal)
├── public/           # Static assets (SVGs)
├── next.config.mjs   # Next.js config
├── package.json      # Frontend deps
└── README.md         # This file
```

## Running the Application

### Start Backend
In `backend/`:
```bash
npm start  # Or node server.js
```
- Server runs on `http://localhost:5000`.
- Test: Visit `http://localhost:5000/api` or use Postman for endpoints like `/api/auth/register`.

### Start Frontend
In root `my-app/`:
```bash
npm run dev
```
- App runs on `http://localhost:3000`.
- Build for production: `npm run build && npm start`.

### Full Stack Run
1. Start backend first.
2. Start frontend.
3. Access `http://localhost:3000` for the app.

## Usage Guide

### Authentication
- Navigate to `/auth/login` or `/auth/signup`.
- Register a new user with email/password (hashed via bcrypt).
- Login to receive JWT token (stored in localStorage or cookies via middleware).
- Protected routes (profile, progress) require auth token.

### Key Pages
- **Home (/home)**: Dashboard after login.
- **Onboarding (/onboarding)**: Initial setup for new users.
- **Profile (/profile)**: View/edit profile data with pie chart visualization (using Chart.js). Data fetched from `/api/profile`.
- **Progress (/progress)**: Track user progress (details in page.js).

### API Endpoints (Backend)
- **Auth**:
  - POST `/api/auth/register` - Create user.
  - POST `/api/auth/login` - Login and get JWT.
- **Profile**:
  - GET `/api/profile` - Fetch user profile (protected).
  - PUT `/api/profile` - Update profile.
- Use `src/app/services/api.js` for frontend API calls (includes auth headers).

### Charts in Profile
- The profile page uses Chart.js with DataLabels plugin for displaying data (e.g., skill breakdowns).
- If build errors occur (Module not found: chartjs-plugin-datalabels), ensure deps are installed as in Setup.

## Troubleshooting

- **Build Errors (chartjs-plugin-datalabels)**: Install missing packages: `npm install chart.js react-chartjs-2 chartjs-plugin-datalabels`.
- **Database Connection**: Check `.env` vars and ensure DB server is running. Toggle between MongoDB/MySQL in `config/db.js`.
- **CORS Issues**: Backend has CORS enabled; adjust origins if needed.
- **JWT Errors**: Verify secret in `.env`; tokens expire (configure in authController).
- **Linting**: Run `npm run lint` to check code style.
- **Webpack Cache Errors**: Delete `.next/` folder and rebuild: `rm -rf .next && npm run build`.

## Development Notes
- Use VSCode with extensions: ESLint, Tailwind CSS IntelliSense, Next.js snippets.
- Add TODOs in TODO.md for pending features (e.g., full progress integration).
- For production: Set up PM2 for backend, Vercel/Netlify for frontend.
- Security: Use HTTPS, validate inputs, hash passwords (already implemented).

## Contributing
1. Fork/clone the repo.
2. Create a branch: `git checkout -b feature/new-feature`.
3. Commit changes: `git commit -m 'Add new feature'`.
4. Push and open PR.

If you encounter issues, check console logs or open an issue.

---

*Last Updated: [Current Date]*
