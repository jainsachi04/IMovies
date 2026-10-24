# IMovies — Online Movie Ticket Booking System
## Live Demo

[Click here to view IMovies](https://i-movies-rose.vercel.app/)
A full-stack cinema ticket booking project built with **React, Bootstrap, Node.js, Express, MongoDB, and JWT**. It includes a movie catalogue, search and genre filters, showtime selection, live seat availability, secure account registration/login, booking history/cancellation, and an admin dashboard for movies and shows.

> This is an educational demo. It does not process real payments. Posters are remote sample images and need an internet connection to display.

## Features

- Responsive movie catalogue with title search and genre filters.
- Movie detail pages and showtimes by cinema/date/time.
- 48-seat map per show with available/booked/selected states.
- JWT authentication; passwords hashed with bcrypt.
- Booking creation checks and reserves selected seats with a single conditional MongoDB update to prevent the same seat being booked twice.
- Booking history, booking code, total price and cancellation (releases seats).
- Admin dashboard: add/delete movies and create shows.
- MongoDB seed script with demo movies, showtimes and admin account.
- REST API suitable for Postman testing.

## Tech stack

- Frontend: React 18, Vite, React Router, Bootstrap 5, Axios
- Backend: Node.js 16+ (Node 18+ recommended), Express 4, Mongoose 8, JSON Web Token, bcryptjs
- Database: MongoDB 7 or compatible MongoDB server

## Requirements

- Windows 10/11, macOS or Linux
- Node.js 18+ recommended (Node.js 16+ is declared; modern Vite versions may require a newer Node version)
- npm 8+
- MongoDB local service or Docker Desktop
- VS Code and a modern browser
- Postman (optional, for API tests)

## Quick start — local MongoDB

Open a terminal in the project root (`IMovies`).

### 1. Start MongoDB

Install and start MongoDB Community Server, or use Docker Desktop and run:

```bash
docker compose up -d mongodb
```

If Docker is not installed, ensure the MongoDB service is running at `mongodb://127.0.0.1:27017`.

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` (on Windows PowerShell: `Copy-Item .env.example .env`; on macOS/Linux: `cp .env.example .env`). Edit `.env` and set a long random `JWT_SECRET` before using the app outside a local demo.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Then seed demo data and start the API:

```bash
npm run seed
npm run dev
```

API health check: <http://localhost:5000/api/health>

Demo administrator (created by seed):

- Email: `admin@imovies.local`
- Password: `Admin@12345`

Change/remove the demo admin credentials before any public deployment. Do not use this sample password on a real system.

### 3. Start the frontend

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
```

Optional: copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:5000/api`.

```bash
npm run dev
```

Open <http://localhost:5173>.

### Windows shortcut

After completing the configuration and installing dependencies, you can run `START-WINDOWS.bat` from the project root to open two terminal windows for the backend and frontend. MongoDB must already be running.

## How to use

1. Open the home page and browse/filter movies.
2. Open a movie and choose a showtime.
3. Register or log in, select available seats, and confirm the booking.
4. View bookings from **My bookings**. Cancellation releases seats.
5. Log in with the seeded admin account and open **Admin** to add movies and create shows.

## API overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API health check |
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | JWT | Current user |
| GET | `/movies` | Public | List/search/filter movies (`search`, `genre`) |
| GET | `/movies/:id` | Public | Movie details |
| POST | `/movies` | Admin JWT | Add movie |
| PUT | `/movies/:id` | Admin JWT | Update movie |
| DELETE | `/movies/:id` | Admin JWT | Delete movie |
| GET | `/shows` | Public | List shows (`movieId`, `city`, `date=YYYY-MM-DD`) |
| GET | `/shows/:id` | Public | Show and seat map |
| POST | `/shows` | Admin JWT | Create show with 48 seats |
| POST | `/bookings` | JWT | Reserve seats |
| GET | `/bookings/mine` | JWT | Current user's bookings |
| PATCH | `/bookings/:id/cancel` | JWT | Cancel and release seats |

For protected endpoints add this header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Postman examples

**Register** `POST /api/auth/register`

```json
{"name":"Test User","email":"test@example.com","password":"StrongPass123"}
```

**Login** `POST /api/auth/login`

```json
{"email":"test@example.com","password":"StrongPass123"}
```

Copy the returned `token` into the Authorization header as `Bearer <token>`.

**Create a booking** `POST /api/bookings` (use an actual `_id` from `GET /api/shows`):

```json
{"showId":"REPLACE_WITH_SHOW_ID","seats":["A1","A2"]}
```

**Create a show** `POST /api/shows` (admin token required):

```json
{"movie":"REPLACE_WITH_MOVIE_ID","cinema":"PVR Treasure Island","city":"Indore","date":"2026-12-25","time":"18:30","price":220}
```

**Add a movie** `POST /api/movies` (admin token required):

```json
{"title":"Sample Film","description":"A short sample description.","genre":"Drama","duration":120,"language":"Hindi","rating":8,"posterUrl":"https://example.com/poster.jpg"}
```

## Project structure

```text
IMovies/
├── backend/
│   ├── src/config/       # MongoDB connection
│   ├── src/controllers/  # Auth, movies, shows, bookings
│   ├── src/middleware/   # JWT/admin access checks
│   ├── src/models/       # User, Movie, Show, Booking
│   ├── src/routes/       # REST endpoints
│   ├── src/app.js
│   ├── src/server.js
│   └── src/seed.js
├── frontend/
│   ├── src/components/   # Navbar, movie card
│   ├── src/context/      # Auth context
│   ├── src/pages/        # Home, details, booking, auth, admin
│   └── src/main.jsx
├── docs/
├── docker-compose.yml
└── README.md
```

## Troubleshooting

- **MongoDB connection error:** Start MongoDB/Docker first and verify `MONGODB_URI`.
- **`npm` or `node` not recognized:** Install Node.js from <https://nodejs.org/> and reopen VS Code/terminal.
- **Frontend cannot reach API:** Ensure backend is running on port 5000 and `VITE_API_URL` is correct.
- **No movies or shows:** Run `npm run seed` inside `backend` while MongoDB is running.
- **Port already in use:** Stop the other process or change `PORT` and update `VITE_API_URL` as appropriate.
- **Image not loading:** Poster links are sample remote images; replace with accessible image URLs.

## Notes / limitations

- No payment gateway is integrated; a confirmed booking is a demo reservation only.
- This starter project does not include production rate limiting, email verification, password reset, or payment reconciliation. Add these before public deployment.
- Cancelling a booking releases seats in MongoDB; for production, consider cancellation windows and audit logging.
- MongoDB should be secured with authentication and network restrictions in a deployed environment.
# IMovies
Online Movie Ticket Booking System
