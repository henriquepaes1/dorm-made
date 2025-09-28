from fastapi import FastAPI
from dotenv import load_dotenv

from routers import users, events

load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Dorm Made - Culinary Social Network", version="1.0.0")

# Include routers
app.include_router(users.router)
app.include_router(events.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Dorm Made - Culinary Social Network API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)