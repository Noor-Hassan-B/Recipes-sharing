// src/services/api.js
// Member 2 (UI) API Service Layer
// Communicates with Member 3 & 5's Backend API with automatic mock fallbacks

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic helper function for API requests
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API Fallback] Request to ${endpoint} failed (${error.message}). Using local mock handler.`);
    throw error;
  }
}

/* ==========================================================================
   Recipe Endpoints
   ========================================================================== */

export async function fetchRecipes(category = '', search = '') {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    return await apiFetch(`/recipes?${params.toString()}`);
  } catch {
    // Fallback returns empty array or null so UI handles gracefully
    return null;
  }
}

export async function fetchRecipeById(id) {
  return await apiFetch(`/recipes/${id}`);
}

export async function createRecipe(recipeData) {
  return await apiFetch('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
}

/* ==========================================================================
   Auth Endpoints
   ========================================================================== */

export async function loginUser(email, password) {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(userData) {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function fetchUsers() {
  try {
    return await apiFetch('/users');
  } catch {
    return null;
  }
}

/* ==========================================================================
   Category Endpoints
   ========================================================================== */

export async function fetchCategories() {
  return await apiFetch('/categories');
}

/* ==========================================================================
   Comment & Rating Endpoints
   ========================================================================== */

export async function submitComment(recipeId, commentText) {
  return await apiFetch(`/recipes/${recipeId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text: commentText }),
  });
}

export async function submitRating(recipeId, score) {
  return await apiFetch(`/recipes/${recipeId}/ratings`, {
    method: 'POST',
    body: JSON.stringify({ score }),
  });
}
