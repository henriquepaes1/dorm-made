from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import users, events

load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Dorm Made - Culinary Social Network", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(users.router)
app.include_router(events.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Dorm Made - Culinary Social Network API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)