// src/services/api.js
// Hardened API Service Layer with Token Management & File Upload Support

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic helper function for API requests
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const headers = {
    ...authHeader,
    ...options.headers,
  };

  // If body is NOT FormData, set JSON Content-Type
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) ? data.message : `HTTP Error ${response.status}: ${response.statusText}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* ==========================================================================
   Recipe Endpoints
   ========================================================================== */

export async function fetchRecipes(category = '', search = '') {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);

  const query = params.toString() ? `?${params.toString()}` : '';
  return await apiFetch(`/recipes${query}`);
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

export async function updateRecipe(id, recipeData) {
  return await apiFetch(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recipeData),
  });
}

export async function deleteRecipe(id) {
  return await apiFetch(`/recipes/${id}`, {
    method: 'DELETE',
  });
}

/* ==========================================================================
   Image Upload Endpoint (Multipart)
   ========================================================================== */

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  return await apiFetch('/upload', {
    method: 'POST',
    body: formData,
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

export async function fetchCurrentUser() {
  return await apiFetch('/users/me');
}

export async function fetchUsers() {
  return await apiFetch('/users');
}

/* ==========================================================================
   Category Endpoints
   ========================================================================== */

export async function fetchCategories() {
  return await apiFetch('/categories');
}

export async function createCategory(name) {
  return await apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
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
