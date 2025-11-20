import { Product, ProductCategory } from '../types';
import { ADMIN_CREDENTIALS, INITIAL_PRODUCTS } from '../constants';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * A helper function to add the auth token to requests.
 * It retrieves the token from localStorage and adds it to the Authorization header.
 */
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  console.log("Token retrieved from localStorage:", token); // Debugging line


  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  // Add the Authorization header if a token exists
  if (token) {
    console.log("Adding Authorization header with token:", token); // Debugging line
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    // If the error is 401 or 403, it's an auth issue, so we can log the user out.
    if (response.status === 401 || response.status === 403) {
        console.error('Authentication error. Logging out.');
        localStorage.removeItem('authToken');
        // Optionally, redirect to login page
        window.location.href = '/'; 
    }
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};


// --- Public API Calls ---

export const getProducts = async (): Promise<Product[]> => {
  // This is a public endpoint, so we can use fetch directly or a simplified fetcher
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getCategories = async (): Promise<ProductCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

/**
 * Logs in the user.
 * On success, it receives and stores the authentication token.
 */
export const login = async (username: string, password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Invalid credentials' }));
    throw new Error(errorData.message || 'Login failed');
  }

  const { token } = await response.json();
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    throw new Error('Login successful, but no token was received.');
  }
};


// --- Authenticated (Admin) API Calls ---

/**
 * Saves the entire product list. This is a protected action.
 * Uses fetchWithAuth to include the token.
 */
export const saveProducts = async (products: Product[]): Promise<void> => {
  return fetchWithAuth(`${API_BASE_URL}/products`, {
    method: 'PUT',
    body: JSON.stringify(products),
  });
};

/**
 * Saves the category list. This is a protected action.
 * Uses fetchWithAuth to include the token.
 */
export const saveCategories = async (categories: ProductCategory[]): Promise<void> => {
  return fetchWithAuth(`${API_BASE_URL}/categories`, {
    method: 'PUT',
    body: JSON.stringify(categories),
  });
};