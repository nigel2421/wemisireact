import { Product, ProductCategory } from '../types';

// Use Vite env var (set VITE_API_BASE_URL) for production, fallback to local dev server
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3001/api';

const getAuthToken = () => localStorage.getItem('authToken') ?? undefined;
export const setAuthToken = (token: string | null) => {
  if (token) localStorage.setItem('authToken', token);
  else localStorage.removeItem('authToken');
};
export const logout = (redirect = '/') => {
  localStorage.removeItem('authToken');
  // redirect to login/home — consumer can override redirect
  if (typeof window !== 'undefined') window.location.href = redirect;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  if (token) (headers as any)['Authorization'] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    // Network-level error
    throw new Error((err as Error).message || 'Network error');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // auth error -> clear token and redirect to login
      logout('/');
    }
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData?.message || `Request failed with status ${response.status}`);
  }

  // Attempt to parse JSON, but return text if not JSON
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
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
    setAuthToken(token);
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