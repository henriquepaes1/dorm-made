# Dorm-Made 🍳

A social network for college students to connect through culinary experiences and food sharing.

## Features

- **User Authentication**: Secure registration and login system
- **Event Creation**: Students can create cooking events with recipes and participant limits
- **Event Joining**: Students can join cooking events created by others
- **Category System**: Food categories (French, Italian, Gluten-free, Lactose-free, etc.)
- **Participant Management**: Track and limit event participants (max 5 per event)

## Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Alembic

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dorm-made
   ```

2. **Start the application with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Alternative Documentation: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://dorm_user:dorm_password@db:5432/dorm_made

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production-make-it-very-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App
DEBUG=True
APP_NAME=Dorm-Made API
VERSION=1.0.0

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8080", "http://localhost:8000"]
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Events
- `POST /events/create` - Create a new cooking event (requires authentication)
- `POST /events/join` - Join an existing event (requires authentication)
- `GET /events/` - Get all events
- `GET /events/{event_id}` - Get specific event with participants

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `username`: Unique username
- `hashed_password`: Encrypted password
- `full_name`: User's full name
- `university`: User's university (optional)
- `is_active`: Account status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Events Table
- `id`: Primary key
- `title`: Event title
- `description`: Event description (optional)
- `recipe`: Recipe text
- `max_participants`: Maximum number of participants (default: 5)
- `current_participants`: Current number of participants
- `category`: Food category (French, Italian, Gluten-free, etc.)
- `location`: Event location (optional)
- `scheduled_date`: When the event will take place
- `creator_id`: Foreign key to users table
- `created_at`: Event creation timestamp
- `updated_at`: Last update timestamp

### Event Participants (Many-to-Many)
- `event_id`: Foreign key to events table
- `user_id`: Foreign key to users table

## Development

### Running Locally (without Docker)

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL database**
   - Create a database named `dorm_made`
   - Update the `DATABASE_URL` in your `.env` file

3. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

4. **Start the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Database Migrations

To create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

To apply migrations:
```bash
alembic upgrade head
```

To rollback migrations:
```bash
alembic downgrade -1
```

## Project Structure

```
dorm-made/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── event.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── event.py
│   ├── routers/                # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── events.py
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   └── event_service.py
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       └── security.py
├── alembic/                    # Database migrations
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
├── alembic.ini
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@dorm-made.com or create an issue in the repository.