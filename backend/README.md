# Dorm Made - Culinary Social Network API

A FastAPI-based social network for college students to connect through culinary experiences and food sharing.

## Features

- **User Management**: Create and manage user profiles
- **Recipe Sharing**: Users can create and share recipes
- **Event Creation**: Host culinary events with specific recipes
- **Event Participation**: Join events hosted by other users
- **Event Discovery**: Browse all available events

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
- `difficulty` (String - easy/medium/hard)
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
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your Supabase credentials
```

3. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Users
- `POST /users/` - Create a new user
- `GET /users/{user_id}/recipes` - Get user's recipes
- `GET /users/{user_id}/events` - Get user's events

### Recipes
- `POST /recipes/` - Create a new recipe

### Events
- `POST /events/` - Create a new event
- `POST /events/join/` - Join an event
- `GET /events/` - List all events
- `GET /events/{event_id}` - Get event details

## Example Usage

### Create a User
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@university.edu",
    "university": "University of Example"
  }'
```

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
    "difficulty": "medium"
  }'
```

### Create an Event
```bash
curl -X POST "http://localhost:8000/events/" \
  -H "Content-Type: application/json" \
  -d '{
    "host_user_id": 1,
    "recipe_id": 1,
    "title": "Pasta Night",
    "description": "Learn to make authentic carbonara",
    "max_participants": 6,
    "event_date": "2024-01-15T18:00:00",
    "location": "Dorm Kitchen 3A"
  }'
```

### Join an Event
```bash
curl -X POST "http://localhost:8000/events/join/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "event_id": 1
  }'
```

### List All Events
```bash
curl -X GET "http://localhost:8000/events/"
```
