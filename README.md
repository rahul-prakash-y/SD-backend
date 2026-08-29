# EduPortal Backend API

Production-grade Express + MongoDB backend for the Student Dashboard & Academic Operations Portal.

## Tech Stack

- **Runtime**: Node.js + Express 4
- **Database**: MongoDB + Mongoose 8
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Performance**: Compression, connection pooling, lean queries

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Seed the database with demo data
npm run seed

# 4. Start development server
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login with credentials |
| POST | `/api/auth/register` | Public | Register new user |
| GET | `/api/auth/me` | Bearer | Get current user |
| PUT | `/api/auth/profile` | Bearer | Update profile |
| GET | `/api/users` | Admin/Teacher | List users (search, filter, paginate) |
| POST | `/api/users` | Admin | Create user |
| PUT | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |
| PUT | `/api/users/:id/mentor` | Admin | Assign mentor |
| GET | `/api/courses` | Bearer | List courses |
| POST | `/api/courses` | Admin/Teacher | Create course |
| PUT | `/api/courses/:id` | Admin/Teacher | Update course |
| DELETE | `/api/courses/:id` | Admin | Delete course |
| GET | `/api/attendance` | Bearer | Get attendance |
| POST | `/api/attendance/batch` | Admin/Teacher | Batch mark attendance |
| GET | `/api/attendance/stats/:id` | Bearer | Student attendance stats |
| GET | `/api/announcements` | Bearer | List announcements |
| POST | `/api/announcements` | Admin/Teacher | Post announcement |
| DELETE | `/api/announcements/:id` | Author/Admin | Delete announcement |
| GET | `/api/timetable` | Bearer | Get timetable |
| POST | `/api/timetable` | Admin | Create slot |
| PUT | `/api/timetable/:id` | Admin | Update slot |
| DELETE | `/api/timetable/:id` | Admin | Delete slot |
| GET | `/api/notifications` | Bearer | Get notifications |
| PUT | `/api/notifications/:id/read` | Bearer | Mark as read |
| DELETE | `/api/notifications/clear` | Bearer | Clear all |
| GET | `/api/change-requests` | Admin/Teacher | List requests |
| POST | `/api/change-requests` | Teacher | Create request |
| PUT | `/api/change-requests/:id/resolve` | Admin | Resolve |
| DELETE | `/api/change-requests/:id` | Admin | Delete |
| GET | `/api/results` | Bearer | Get results |
| POST | `/api/results` | Admin | Publish results |
| DELETE | `/api/results/:id` | Admin | Delete results |
| GET | `/api/health` | Public | Server health check |

## Login Credentials (after seeding)

| Role | Username / Email | Password |
|------|-----------------|----------|
| Admin | `admin@bitsathy.ac.in` | `admin@1234` |
| Student | `MuratGursoy` | `password123` |
| Teacher | `SarahJenkins` | `password123` |

## Project Structure

```
src/
├── config/         # DB connection
├── controllers/    # Route handlers
├── middleware/      # Auth, error handling
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── seeders/        # Database seed script
└── server.js       # Express app entry
```
