from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from supabase import create_client, Client

# Initialize FastAPI app
app = FastAPI(title="Dorm Made - Culinary Social Network", version="1.0.0")

# Supabase configuration
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client("", "")

# Pydantic models
class UserBase(BaseModel):
    name: str
    email: str
    university: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class RecipeBase(BaseModel):
    title: str
    description: str
    ingredients: List[str]
    instructions: str
    prep_time: int  # in minutes
    difficulty: str  # easy, medium, hard

class RecipeCreate(RecipeBase):
    user_id: int

class Recipe(RecipeBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    title: str
    description: str
    max_participants: int
    event_date: datetime
    location: str

class EventCreate(EventBase):
    host_user_id: int
    recipe_id: int

class Event(EventBase):
    id: int
    host_user_id: int
    recipe_id: int
    current_participants: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class JoinEventRequest(BaseModel):
    user_id: int
    event_id: int

# Database operations
def get_user(user_id: int) -> Optional[User]:
    """Get user by ID from Supabase"""
    try:
        result = supabase.table("users").select("*").eq("id", user_id).execute()
        if result.data:
            return User(**result.data[0])
        return None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

def get_recipe(recipe_id: int) -> Optional[Recipe]:
    """Get recipe by ID from Supabase"""
    try:
        result = supabase.table("recipes").select("*").eq("id", recipe_id).execute()
        if result.data:
            return Recipe(**result.data[0])
        return None
    except Exception as e:
        print(f"Error getting recipe: {e}")
        return None

def get_event(event_id: int) -> Optional[Event]:
    """Get event by ID from Supabase"""
    try:
        result = supabase.table("events").select("*").eq("id", event_id).execute()
        if result.data:
            return Event(**result.data[0])
        return None
    except Exception as e:
        print(f"Error getting event: {e}")
        return None

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to Dorm Made - Culinary Social Network API"}

@app.post("/users/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    try:
        result = supabase.table("users").insert(user.dict()).execute()
        if result.data:
            return User(**result.data[0])
        raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")

@app.post("/recipes/", response_model=Recipe)
async def create_recipe(recipe: RecipeCreate):
    """Create a new recipe"""
    # Verify user exists
    user = get_user(recipe.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        result = supabase.table("recipes").insert(recipe.dict()).execute()
        if result.data:
            return Recipe(**result.data[0])
        raise HTTPException(status_code=400, detail="Failed to create recipe")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating recipe: {str(e)}")

@app.post("/events/", response_model=Event)
async def create_event(event: EventCreate):
    """Create a new culinary event"""
    # Verify host user exists
    host = get_user(event.host_user_id)
    if not host:
        raise HTTPException(status_code=404, detail="Host user not found")
    
    # Verify recipe exists
    recipe = get_recipe(event.recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Verify recipe belongs to the host
    if recipe.user_id != event.host_user_id:
        raise HTTPException(status_code=400, detail="Recipe must belong to the event host")
    
    try:
        event_data = event.dict()
        event_data["current_participants"] = 0  # Initialize with 0 participants
        
        result = supabase.table("events").insert(event_data).execute()
        if result.data:
            return Event(**result.data[0])
        raise HTTPException(status_code=400, detail="Failed to create event")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating event: {str(e)}")

@app.post("/events/join/")
async def join_event(join_request: JoinEventRequest):
    """Join an existing event"""
    # Verify user exists
    user = get_user(join_request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify event exists
    event = get_event(join_request.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if event is full
    if event.current_participants >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event is full")
    
    # Check if user is already the host
    if event.host_user_id == join_request.user_id:
        raise HTTPException(status_code=400, detail="Host cannot join their own event")
    
    try:
        # Update event participants count
        result = supabase.table("events").update({
            "current_participants": event.current_participants + 1
        }).eq("id", join_request.event_id).execute()
        
        if result.data:
            return {"message": "Successfully joined the event", "event_id": join_request.event_id}
        raise HTTPException(status_code=400, detail="Failed to join event")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error joining event: {str(e)}")

@app.get("/events/", response_model=List[Event])
async def list_events():
    """List all available events"""
    try:
        result = supabase.table("events").select("*").execute()
        events = [Event(**event) for event in result.data]
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching events: {str(e)}")

@app.get("/events/{event_id}", response_model=Event)
async def get_event_details(event_id: int):
    """Get details of a specific event"""
    event = get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.get("/users/{user_id}/recipes", response_model=List[Recipe])
async def get_user_recipes(user_id: int):
    """Get all recipes created by a specific user"""
    try:
        result = supabase.table("recipes").select("*").eq("user_id", user_id).execute()
        recipes = [Recipe(**recipe) for recipe in result.data]
        return recipes
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user recipes: {str(e)}")

@app.get("/users/{user_id}/events", response_model=List[Event])
async def get_user_events(user_id: int):
    """Get all events created by a specific user"""
    try:
        result = supabase.table("events").select("*").eq("host_user_id", user_id).execute()
        events = [Event(**event) for event in result.data]
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user events: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
