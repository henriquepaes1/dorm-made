import React, { useState } from "react";
import { createUser } from "../services/api";

function UserRegistration({ onUserRegistered }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = await createUser(formData);
      setSuccess(true);
      onUserRegistered(userData);

      // Reset form
      setFormData({
        name: "",
        email: "",
        university: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card">
        <div className="alert alert-success">
          <h3>Registration Successful! 🎉</h3>
          <p>You can now create recipes and events, and join other culinary experiences!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Join Dorm Made</h2>
      <p>Create your account to start sharing culinary experiences with fellow students.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="university">University</label>
          <input
            type="text"
            id="university"
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
            placeholder="Enter your university name"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default UserRegistration;
