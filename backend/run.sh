#!/bin/bash

# Dorm-Made API Startup Script

echo "🍳 Starting Dorm-Made API..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created. Please review and update the values as needed."
    else
        echo "❌ .env.example file not found. Please create a .env file manually."
        exit 1
    fi
fi

echo "🐳 Building and starting containers..."
docker-compose up --build

echo "✅ Dorm-Made API is running!"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔍 Alternative Docs: http://localhost:8000/redoc"
echo "❤️  Health Check: http://localhost:8000/health"
