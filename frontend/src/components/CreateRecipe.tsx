import React, { useState } from "react";
import { createRecipe } from "../services/api";

function CreateRecipe({ currentUser }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    prep_time: "",
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

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        ingredients: newIngredients,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Please register first to create recipes");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Filter out empty ingredients
      const filteredIngredients = formData.ingredients.filter(
        (ingredient) => ingredient.trim() !== "",
      );

      const recipeData = {
        ...formData,
        user_id: currentUser.id,
        ingredients: filteredIngredients,
        prep_time: parseInt(formData.prep_time),
      };

      await createRecipe(recipeData);
      setSuccess(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        ingredients: [""],
        instructions: "",
        prep_time: "",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card">
        <div className="alert alert-success">
          <h3>Recipe Created Successfully! 🍳</h3>
          <p>Your recipe is now ready to be used in events!</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <h3>Registration Required</h3>
          <p>Please register first to create recipes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Create a New Recipe</h2>
      <p>Share your favorite recipes with the community!</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Recipe Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Grandma's Chocolate Chip Cookies"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your recipe..."
          />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Enter ingredient"
                required
                style={{ flex: 1 }}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="btn btn-danger"
                  style={{ padding: "0.5rem" }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="btn btn-secondary"
            style={{ marginTop: "0.5rem" }}
          >
            + Add Ingredient
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            placeholder="Step-by-step cooking instructions..."
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="prep_time">Prep Time (minutes)</label>
            <input
              type="number"
              id="prep_time"
              name="prep_time"
              value={formData.prep_time}
              onChange={handleChange}
              required
              min="1"
              placeholder="30"
            />
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating Recipe..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
}

export default CreateRecipe;
