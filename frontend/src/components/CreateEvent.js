import React, { useState, useEffect } from 'react';
import { createEvent, getUserRecipes } from '../services/api';

function CreateEvent({ currentUser, onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    max_participants: '',
    event_date: '',
    location: '',
    recipe_id: ''
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadUserRecipes();
    }
  }, [currentUser]);

  const loadUserRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const userRecipes = await getUserRecipes(currentUser.id);
      setRecipes(userRecipes);
    } catch (err) {
      setError('Failed to load recipes');
      console.error('Error loading recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please register first to create events');
      return;
    }

    if (recipes.length === 0) {
      setError('Please create a recipe first before creating an event');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const eventData = {
        ...formData,
        host_user_id: currentUser.id,
        recipe_id: formData.recipe_id,
        max_participants: parseInt(formData.max_participants)
      };

      await createEvent(eventData);
      setSuccess(true);
      onEventCreated();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        max_participants: '',
        event_date: '',
        location: '',
        recipe_id: ''
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card">
        <div className="alert alert-success">
          <h3>Event Created Successfully! 🎉</h3>
          <p>Your culinary event is now live and students can join!</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <h3>Registration Required</h3>
          <p>Please register first to create events.</p>
        </div>
      </div>
    );
  }

  if (loadingRecipes) {
    return (
      <div className="card">
        <div className="loading">Loading your recipes...</div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <h3>No Recipes Found</h3>
          <p>Please create a recipe first before creating an event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Create a Culinary Event</h2>
      <p>Host a cooking event and share your recipes with fellow students!</p>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Pasta Night with Friends"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe what participants will learn and experience..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipe_id">Select Recipe</label>
          <select
            id="recipe_id"
            name="recipe_id"
            value={formData.recipe_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose a recipe...</option>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.title} ({recipe.difficulty}) - {recipe.prep_time} min
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="max_participants">Max Participants</label>
            <input
              type="number"
              id="max_participants"
              name="max_participants"
              value={formData.max_participants}
              onChange={handleChange}
              required
              min="1"
              max="20"
              placeholder="6"
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="event_date">Event Date & Time</label>
            <input
              type="datetime-local"
              id="event_date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., Dorm Kitchen 3A, Student Center Kitchen"
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
