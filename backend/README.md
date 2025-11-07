# Dorm-Made

A meal sharing platform where students create events and others can join them.

## Database Tables

The application uses Supabase with three tables:

## Database Schema

### Users Table

- `id` (Primary Key)
- `name` (String)
- `email` (String)
- `university` (String)
- `created_at` (Timestamp)

### Recipes Table

- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `title` (String)
- `description` (String)
- `ingredients` (Array of Strings)
- `instructions` (String)
- `prep_time` (Integer - minutes)
- `created_at` (Timestamp)

### Events Table

- `id` (Primary Key)
- `host_user_id` (Foreign Key to Users)
- `recipe_id` (Foreign Key to Recipes)
- `title` (String)
- `description` (String)
- `max_participants` (Integer)
- `current_participants` (Integer)
- `event_date` (Timestamp)
- `location` (String)
- `created_at` (Timestamp)

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
### `users`
```

id UUID (primary key, auto-generated)
name TEXT
email TEXT
university TEXT
hashed_password TEXT
created_at TIMESTAMP (auto-generated)

```

### `events`
```

id UUID (primary key, auto-generated)
title TEXT
description TEXT
max_participants INTEGER
location TEXT
event_date TIMESTAMP
host_user_id UUID (foreign key → users.id)
current_participants INTEGER
created_at TIMESTAMP (auto-generated)

```

### `events_participants`
```

id UUID (primary key, auto-generated)
event_id UUID (foreign key → events.id)
participant_id UUID (foreign key → users.id)
joined_at TIMESTAMP (auto-generated)

````

## User Flows

### 1. Sign Up
- User fills form: name, email, university, password
- Frontend: `POST /users/` with `{name, email, university, password}`
- Backend: Hashes password with bcrypt, inserts into `users` table
- Returns: User object (without password)

### 2. Login
- User enters email + password
- Frontend: `POST /users/login` with `{email, password}`
- Backend: Looks up user by email, verifies password with bcrypt
- Returns: JWT token (HS256, contains `userId`) + user object
- Frontend: Stores token in localStorage, includes in `Authorization: Bearer <token>` header for authenticated requests

### 3. Create Event
- User must be logged in
- User fills form: title, description, max_participants, location, event_date
- Frontend: `POST /events/` with event data + JWT token in header
- Backend:
  - Verifies JWT token, extracts `userId`
  - Sets `host_user_id = userId`
  - Sets `current_participants = 0`
  - Inserts into `events` table
- Returns: Created event object

### 4. Browse Events
- Frontend: `GET /events/`
- Backend: Returns all rows from `events` table (no filtering, no pagination)
- Returns: Array of event objects

### 5. Join Event
- User must be logged in
- User clicks "Join" on an event
- Frontend: `POST /events/join/` with `{event_id}` + JWT token in header
- Backend:
  - Verifies JWT token, extracts `userId`
  - Checks: user is not the host, user not already joined, event not full
  - Inserts into `events_participants` table: `{event_id, participant_id: userId}`
  - Updates `events.current_participants += 1`
- Returns: Success message

### 6. View My Events
- User must be logged in
- Frontend: `GET /users/me/events` + JWT token
- Backend: Queries `events` where `host_user_id = userId`
- Returns: Array of events user created

### 7. View Joined Events
- User must be logged in
- Frontend: `GET /users/me/joined-events` + JWT token
- Backend:
  - Queries `events_participants` for `participant_id = userId`
  - Gets event IDs
  - Queries `events` table for those IDs
- Returns: Array of events user joined

## API Endpoints

**Public:**
- `POST /users/` - Create user
- `POST /users/login` - Login (get JWT)
- `GET /events/` - List all events
- `GET /events/{event_id}` - Get single event
- `GET /events/{event_id}/participants` - Get event participants

**Authenticated (requires JWT in Authorization header):**
- `POST /events/` - Create event
- `POST /events/join/` - Join event
- `GET /users/me/events` - Get my created events
- `GET /users/me/joined-events` - Get events I joined

## Running the Application

**Backend:**
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Set environment variables
export SUPABASE_URL="your-supabase-url"
export SUPABASE_KEY="your-supabase-key"
export SECRET_KEY="your-secret-key"

# Run
cd backend
python main.py
````

Backend runs on `http://localhost:8000`

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:8080`

## Tech Stack

**Backend:**

- FastAPI - Web framework
- Supabase Python client - Database access
- PyJWT - JWT token creation/verification
- bcrypt - Password hashing

**Frontend:**

- React 18 + TypeScript
- Vite - Build tool
- Tailwind CSS + shadcn/ui - Styling
- Axios - HTTP client
- React Router - Client-side routing

**Database:**

- Supabase (managed PostgreSQL)

## Configuration

**Backend `.env`:**

```
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
SECRET_KEY=random-string-for-jwt-signing
```

<<<<<<< HEAD

### Create a Recipe

```bash
curl -X POST "http://localhost:8000/recipes/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Pasta Carbonara",
    "description": "Classic Italian pasta dish",
    "ingredients": ["pasta", "eggs", "bacon", "parmesan"],
    "instructions": "Cook pasta, mix with eggs and bacon...",
    "prep_time": 30,
  }'
=======
**Frontend `.env`:**
```

VITE_API_URL=http://localhost:8000

> > > > > > > main

```

## Technical Details

**Authentication:**
- JWT tokens signed with HS256 algorithm
- Token payload: `{"userId": "<user-uuid>"}`
- Tokens stored in browser localStorage
- Token sent in `Authorization: Bearer <token>` header
- Backend validates token on protected routes, extracts userId

**Password Security:**
- Passwords hashed with bcrypt before storing
- Plain passwords never stored in database
- Only hashed_password column exists in users table

**Event Capacity:**
- `current_participants` field is denormalized (updated on join/leave)
- Trade-off: Fast reads, potential race conditions on concurrent joins
- Full check: `current_participants >= max_participants`

**CORS:**
- Backend allows all origins (`allow_origins=["*"]`)
- Required because frontend on different port (8080) than backend (8000)

**Data Validation:**
- Pydantic schemas validate request/response data
- Frontend does basic validation before sending requests
```
