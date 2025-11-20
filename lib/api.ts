import { Product, ProductCategory } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper for fetch calls to include credentials
const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        credentials: 'include', // This is crucial for sending session cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };
    return fetch(url, { ...defaultOptions, ...options });
};


// --- Product API ---

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetchWithCredentials(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data.data;
};

export const saveProducts = async (updatedProducts: Product[]): Promise<void> => {
  const response = await fetchWithCredentials(`${API_BASE_URL}/products`, {
    method: 'PUT',
    body: JSON.stringify(updatedProducts),
  });
  if (!response.ok) {
    throw new Error('Failed to save products');
  }
};

// --- Category API ---

export const getCategories = async (): Promise<ProductCategory[]> => {
  const response = await fetchWithCredentials(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return data.data;
};

// Note: saveCategories is not implemented on the backend as categories are derived from products.
export const saveCategories = async (updatedCategories: ProductCategory[]): Promise<void> => {
    console.warn("saveCategories is not implemented in production API.");
    return Promise.resolve();
};

// --- Auth API ---

export const login = async (username: string, password: string): Promise<void> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
    }
};

export const logout = async (): Promise<void> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/logout`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Logout failed');
    }
};

export const getAuthStatus = async (): Promise<{ isAuthenticated: boolean }> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/status`);
    if (!response.ok) {
        throw new Error('Failed to get auth status');
    }
    return response.json();
};


// --- Session Data API ---

export const getCart = async (): Promise<Product[]> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/session/cart`);
    if (!response.ok) {
        throw new Error('Failed to get cart');
    }
    return response.json();
};

export const saveCart = async (cart: Product[]): Promise<void> => {
    await fetchWithCredentials(`${API_BASE_URL}/session/cart`, {
        method: 'POST',
        body: JSON.stringify({ cart }),
    });
};

export const getWishlist = async (): Promise<string[]> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/session/wishlist`);
    if (!response.ok) {
        throw new Error('Failed to get wishlist');
    }
    return response.json();
};

export const saveWishlist = async (wishlist: string[]): Promise<void> => {
    await fetchWithCredentials(`${API_BASE_URL}/session/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ wishlist }),
    });
};