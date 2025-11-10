
import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';

interface AdminPanelProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddProduct }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Tiles');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl) {
      alert('Please fill in all fields.');
      return;
    }
    
    onAddProduct({ name, description, imageUrl, category });

    // Reset form
    setName('');
    setDescription('');
    setImageUrl('');
    setCategory('Tiles');
  };

  const inputClass = "w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 transition-shadow";
  const labelClass = "block text-sm font-medium text-stone-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClass}>Product Name</label>
          <input 
            type="text" 
            id="name"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className={inputClass}
            placeholder="e.g., Carrara Marble Tile"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea 
            id="description"
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="A short description of the product."
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>Image URL</label>
          <input 
            type="text"
            id="imageUrl"
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClass}
            placeholder="https://picsum.photos/seed/example/600/400"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>Category</label>
          <select 
            id="category"
            value={category} 
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className={inputClass}
            required
          >
            <option>Tiles</option>
            <option>Marble</option>
            <option>Fences</option>
            <option>Stone</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-stone-800 text-white py-3 px-4 rounded-md font-semibold hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
