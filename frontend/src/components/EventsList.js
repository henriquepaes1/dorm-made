import React from 'react';

function EventsList({ events, loading, onJoinEvent, currentUser }) {
  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="card">
        <h2>No Events Yet</h2>
        <p>Be the first to create a culinary event!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h2>Upcoming Culinary Events</h2>
      <div className="event-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            
            <div className="event-meta">
              <div>
                <strong>📅 {formatDate(event.event_date)}</strong>
                <br />
                <strong>📍 {event.location}</strong>
              </div>
              <div className="participants">
                {event.current_participants}/{event.max_participants} participants
              </div>
            </div>

            {currentUser ? (
              <button 
                className="btn btn-success"
                onClick={() => onJoinEvent(event.id)}
                disabled={event.current_participants >= event.max_participants}
              >
                {event.current_participants >= event.max_participants ? 'Event Full' : 'Join Event'}
              </button>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Please register to join events
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsList;
