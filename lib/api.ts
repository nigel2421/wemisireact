import { Product, ProductCategory } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

// --- MOCK DATABASE ---
// In a real-world application, this would be a database (e.g., PostgreSQL, MongoDB) 
// accessed via a backend API. We are using a simple in-memory store here to simulate 
// this behavior and remove the dependency on client-side localStorage.

// This makes data consistent within a single user's session. To make data persistent 
// and shared across ALL users on the internet, this mock API must be replaced with 
// actual HTTP requests to a backend service.

let products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let categories: ProductCategory[] = ['Tiles', 'Marble', 'Fences', 'Stone'];


const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Product API ---

export const getProducts = async (): Promise<Product[]> => {
  await simulateDelay(500); // Simulate network latency for fetching data
  return Promise.resolve(products);
};

export const saveProducts = async (updatedProducts: Product[]): Promise<void> => {
  await simulateDelay(500); // Simulate network latency for saving data
  products = updatedProducts;
  return Promise.resolve();
};

// --- Category API ---

export const getCategories = async (): Promise<ProductCategory[]> => {
    await simulateDelay(300); // Simulate network latency
    return Promise.resolve(categories);
};

export const saveCategories = async (updatedCategories: ProductCategory[]): Promise<void> => {
    await simulateDelay(300); // Simulate network latency
    categories = updatedCategories;
    return Promise.resolve();
};