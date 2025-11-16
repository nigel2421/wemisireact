import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { XIcon } from './icons/XIcon';

interface ProductFormProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
  categories: ProductCategory[];
  isSaving: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, categories, isSaving }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    imageUrls: [],
    category: 'Tiles',
    price: 0,
  });
  
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        imageUrls: [],
        category: 'Tiles',
        price: 0,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(base64Strings => {
        setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...base64Strings] }));
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
        alert("Please upload at least one image for the product.");
        return;
    }
    onSave({ ...formData, id: product?.id || '' });
  };

  const inputClass = "w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 transition-shadow disabled:bg-stone-100";
  const labelClass = "block text-sm font-medium text-stone-700 mb-1";

  return (
    <div className="mb-8 p-6 bg-stone-50 rounded-lg border border-stone-200">
      <h3 className="text-xl font-bold text-stone-800 mb-4">{product ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={isSaving} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClass}
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className={labelClass}>Price</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-stone-500 sm:text-sm">Ksh</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Product Images</label>
            <div className="mt-1 p-4 border border-dashed border-stone-300 rounded-md">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                    {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={url} alt={`Product preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <button 
                                type="button" 
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                                aria-label="Remove image"
                            >
                                <XIcon className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <label htmlFor="imageUpload" className="relative cursor-pointer bg-white rounded-md font-medium text-stone-600 hover:text-stone-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-stone-500 disabled:cursor-not-allowed">
                    <span>{formData.imageUrls.length > 0 ? 'Add more images' : 'Upload images'}</span>
                    <input id="imageUpload" name="imageUpload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} multiple />
                </label>
                <p className="text-xs text-stone-500 mt-1">You can upload multiple images. The first image will be the main one.</p>
            </div>
          </div>


          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </fieldset>
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-md font-semibold text-sm bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 rounded-md font-semibold text-sm bg-stone-800 text-white hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-600 flex items-center justify-center w-32 disabled:bg-stone-500 disabled:cursor-wait"
          >
            {isSaving ? <SpinnerIcon /> : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;