import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import EventsList from './components/EventsList';
import CreateEvent from './components/CreateEvent';
import CreateRecipe from './components/CreateRecipe';
import UserRegistration from './components/UserRegistration';
import { createUser, getEvents } from './services/api';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Events
      </Link>
      <Link to="/create-event" className={location.pathname === '/create-event' ? 'active' : ''}>
        Create Event
      </Link>
      <Link to="/create-recipe" className={location.pathname === '/create-recipe' ? 'active' : ''}>
        Create Recipe
      </Link>
      <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
        Register
      </Link>
    </nav>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
    // Try to load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegistration = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleEventCreated = () => {
    loadEvents(); // Refresh events list
  };

  const handleJoinEvent = async (eventId) => {
    if (!currentUser) {
      alert('Please register first to join events');
      return;
    }

    try {
      const { joinEvent } = await import('./services/api');
      await joinEvent({
        user_id: currentUser.id,
        event_id: eventId
      });
      alert('Successfully joined the event!');
      loadEvents(); // Refresh events list
    } catch (err) {
      alert('Failed to join event: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>🍳 Dorm Made</h1>
          <p>Connect through culinary experiences</p>
          {currentUser && (
            <p>Welcome, {currentUser.name}!</p>
          )}
        </header>

        <div className="container">
          <Navigation />
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <Routes>
            <Route 
              path="/" 
              element={
                <EventsList 
                  events={events} 
                  loading={loading} 
                  onJoinEvent={handleJoinEvent}
                  currentUser={currentUser}
                />
              } 
            />
            <Route 
              path="/create-event" 
              element={
                <CreateEvent 
                  currentUser={currentUser}
                  onEventCreated={handleEventCreated}
                />
              } 
            />
            <Route 
              path="/create-recipe" 
              element={
                <CreateRecipe 
                  currentUser={currentUser}
                />
              } 
            />
            <Route 
              path="/register" 
              element={
                <UserRegistration 
                  onUserRegistered={handleUserRegistration}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
