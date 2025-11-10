import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import ProductForm from './ProductForm';
import ConfirmationModal from './ConfirmationModal';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { SpinnerIcon } from './icons/SpinnerIcon'; // Added spinner for consistent UX

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

// Define the categories outside the component or use useMemo if they were derived from state/props
// Placing them here is fine since they are constant
const productCategories: ProductCategory[] = ['Tiles', 'Marble', 'Fences', 'Stone'];

const AdminPanel: React.FC<AdminPanelProps> = ({ products, setProducts }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to reset form state
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  }

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setIsDeleting(true);
      
      // Simulate API call
      setTimeout(() => {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setProductToDelete(null);
        setIsDeleting(false);
      }, 1000);
    }
  };

  const handleSaveProduct = (product: Product) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      let updatedProducts: Product[];
      
      if (editingProduct) {
        // Edit
        updatedProducts = products.map(p => p.id === product.id ? product : p);
      } else {
        // Add
        const newProduct = { ...product, id: `prod-${Date.now()}` };
        updatedProducts = [...products, newProduct];
      }
      
      setProducts(updatedProducts);
      closeForm();
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      {/* --- Header & Add Button --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Manage Products ({products.length})</h2>
        <button 
          onClick={handleAddProduct}
          className="bg-stone-800 text-white py-2 px-4 rounded-md font-semibold flex items-center hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-600"
        >
          <PlusIcon />
          <span className="ml-2">Add Product</span>
        </button>
      </div>

      {/* --- Product Form Modal/View --- */}
      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onSave={handleSaveProduct} 
          onCancel={closeForm}
          categories={productCategories}
          isSaving={isSaving}
        />
      )}
      
      {/* --- Product List Table --- */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {products.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                    No products found. Add a new product to get started.
                </div>
            ) : (
                <table className="min-w-full divide-y divide-stone-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-stone-900 sm:pl-0">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-stone-900">Category</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-stone-900">Price</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-stone-900 sm:pl-0">{product.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">{product.category}</td>
                        {/* 🌟 This line is now safely coded against crashes! */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                          Ksh {product.price != null ? product.price.toFixed(2) : 'N/A'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button 
                            onClick={() => handleEditProduct(product)} 
                            className="text-stone-600 hover:text-stone-900 mr-4 transition-colors"
                            title="Edit Product"
                          >
                            <EditIcon />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product)} 
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Product"
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>

      {/* --- Confirmation Modal for Deletion --- */}
      {productToDelete && (
        <ConfirmationModal 
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
          isConfirming={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminPanel;