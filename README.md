# StayFinder

StayFinder is a full-stack student accommodation marketplace. Students can discover PGs near their campus, compare rent and amenities, view locations on a map, and send booking requests. Owners can publish listings, manage photos and availability, review requests, and maintain their profile.

## Features

### Student experience

- Public home page and PG discovery search
- Filtering by location, rent, room type, amenities, and bed availability
- Paginated search results with an interactive Leaflet map
- Exact PG coordinates and user-location marker
- PG details page with responsive Cloudinary image gallery
- Booking request flow with move-in date, room type, and duration
- Student dashboard for viewing and cancelling bookings
- Student profile and password management

### Owner experience

- Protected owner dashboard with nested navigation
- Create and edit PG listings
- Map-based latitude/longitude picker
- Cloudinary image upload with previews and optimization
- Listing deletion
- Booking request dashboard with accept/reject actions
- Clickable request statistics for total, pending, and confirmed bookings
- Owner profile and password management

### Platform features

- JWT authentication stored in HTTP-only cookies
- Student and owner role-based authorization
- Consistent API error responses
- Form validation with Zod and React Hook Form
- Booking bed reservation with atomic database updates
- Automatic booking expiry and bed restoration
- MongoDB indexes for search and booking queries
- Responsive navigation, footer, loading, empty, and error states

## Technology stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- React Hook Form and Zod
- Leaflet and OpenStreetMap tiles
- SCSS

### Backend

- Node.js
- Express 5
- MongoDB and Mongoose
- JWT and HTTP-only cookies
- bcrypt password hashing
- Cloudinary image storage
- CORS and cookie-parser

## Repository structure

```text
StayFinder/
├── client/
│   └── src/
│       ├── app.routes.jsx
│       ├── features/
│       │   ├── auth/
│       │   ├── booking/
│       │   └── pg/
│       ├── services/
│       └── style.scss
├── server/
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── validations/
├── client/.env.example
├── server/.env.example
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB Atlas or a local MongoDB instance
- Cloudinary account for image uploads

## Local setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd StayFinder

cd server
npm install

cd ../client
npm install
```

Create environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell, use `Copy-Item` instead of `cp`.

### Server environment variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb-connection-string
JWT_SECRET=long-random-secret
JWT_EXPIRES_IN=30d
CLIENT_URLS=http://localhost:5173
COOKIE_SAME_SITE=lax
CLOUDINARY_CLOUD_NAME=cloudinary-cloud-name
CLOUDINARY_API_KEY=cloudinary-api-key
CLOUDINARY_API_SECRET=cloudinary-api-secret
```

`CLIENT_URLS` accepts multiple comma-separated origins:

```env
CLIENT_URLS=https://stayfinder.example,https://www.stayfinder.example
```

For a separately hosted frontend and API in production, use HTTPS and:

```env
COOKIE_SAME_SITE=none
```

### Client environment variables

```env
VITE_API_URL=http://localhost:3000
```

In production, set this to the public API URL, for example:

```env
VITE_API_URL=https://api.stayfinder.example
```

Never commit real secrets. Rotate credentials immediately if they are exposed.

## Running locally

Start the API:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

The default URLs are:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## Production build and start

Build the frontend:

```bash
cd client
npm run build
npm run preview
```

Start the backend:

```bash
cd server
npm start
```

Deploy the generated `client/dist` directory to a static host such as Vercel, Netlify, or an Nginx server. Deploy the `server` directory to a Node-compatible host. Configure the production environment variables in the hosting provider rather than committing `.env` files.

## Authentication and authorization

Authentication uses a JWT stored in an HTTP-only cookie. The frontend does not store the token in local storage.

Role access is enforced in both layers:

- Public: home, browse, PG details, and How It Works
- Student only: booking creation, student bookings, student profile
- Owner only: listing management, owner dashboard, owner requests, owner profile
- Shared authenticated routes: logout and account profile APIs

The server must remain the final authorization boundary. Client route guards only improve user experience.

## Main routes

### Frontend routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home page |
| `/browse` | Public | Search and filters |
| `/pg/:pgId` | Public | PG details |
| `/how-it-works` | Public | Student and owner workflow |
| `/login` | Logged out | Login |
| `/register` | Logged out | Registration |
| `/dashboard` | Owner/student | Role-aware dashboard |
| `/dashboard/requests` | Owner | Booking requests |
| `/dashboard/new` | Owner | Add PG inside dashboard |
| `/dashboard/profile` | Owner | Owner account settings |
| `/booking/new/:pgId` | Student | Create booking request |
| `/bookings` | Student | Student bookings |
| `/student/profile` | Student | Student account settings |

### API routes

#### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `PATCH /api/auth/profile`
- `PATCH /api/auth/password`

#### PG listings

- `GET /api/pg` — public search, filters, pagination
- `GET /api/pg/:pgId` — public PG details
- `GET /api/pg/mine` — owner listings
- `GET /api/pg/:pgId/manage` — owner management details
- `POST /api/pg` — create listing
- `PATCH /api/pg/:pgId` — update listing
- `DELETE /api/pg/:pgId` — delete listing

#### Images

- `POST /api/uploads/signature` — owner-only signed Cloudinary upload signature

#### Bookings

- `POST /api/bookings` — student creates request
- `GET /api/bookings/mine` — student bookings
- `GET /api/bookings/owner` — owner requests
- `PATCH /api/bookings/:bookingId/accept` — owner accepts
- `PATCH /api/bookings/:bookingId/reject` — owner rejects
- `PATCH /api/bookings/:bookingId/cancel` — student cancels

## Booking lifecycle

1. A student submits a booking request.
2. The server atomically decrements available beds.
3. The request remains `pending` for the configured expiry period.
4. The owner accepts or rejects the request.
5. Acceptance changes the status to `confirmed`.
6. Rejection, cancellation, or expiry restores the bed where appropriate.
7. A TTL index removes expired booking documents after expiry.

## Image upload flow

1. The owner selects images in the listing form.
2. The client asks the API for a signed Cloudinary upload signature.
3. The browser uploads directly to Cloudinary.
4. Cloudinary returns the secure URL and public ID.
5. The listing API stores the image metadata.
6. Display URLs use Cloudinary transformations for consistent cropping, quality, and format.

## Validation and errors

Client forms use React Hook Form with Zod schemas. Server controllers and Mongoose schemas validate all important input again.

API errors follow a consistent shape:

```json
{
  "success": false,
  "message": "A human-readable error message"
}
```

The client Axios service normalizes network and HTTP errors for page-level error states.

## Deployment checklist

- Set a strong, unique `JWT_SECRET`.
- Use a production MongoDB database and confirm indexes are created.
- Rotate any credentials that were used during development.
- Set `NODE_ENV=production`.
- Set `CLIENT_URLS` to the exact HTTPS frontend origin.
- Set `VITE_API_URL` to the HTTPS API origin.
- Use `COOKIE_SAME_SITE=none` when frontend and API are hosted on separate sites.
- Ensure HTTPS is enabled; secure cookies require it in production.
- Configure Cloudinary production credentials.
- Confirm the frontend host supports SPA fallback to `index.html`.
- Confirm the API host allows the frontend origin through CORS.
- Verify `/api/health` after deployment.
- Test registration, login, PG creation, image upload, booking, accept/reject, cancellation, and logout.
- Configure database backups and application monitoring.

## Current verification commands

```bash
cd client
npm run build
npm run lint

cd ../server
node --check server.js
```

The project currently has no automated test suite. Adding API and end-to-end tests is recommended before a public launch.

## License

This project is currently private and does not yet specify a public license.
