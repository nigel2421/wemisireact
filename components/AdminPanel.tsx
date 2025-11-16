import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import ProductForm from './ProductForm';
import ConfirmationModal from './ConfirmationModal';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => Promise<void>;
  categories: ProductCategory[];
  setCategories: (categories: ProductCategory[]) => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, setProducts, categories, setCategories }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Category management state
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ original: string, current: string } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);


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

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      await setProducts(updatedProducts);
      setProductToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    setIsSaving(true);

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map(p => (p.id === product.id ? product : p));
    } else {
      const newProduct = { ...product, id: `prod-${Date.now()}` };
      updatedProducts = [...products, newProduct];
    }
    
    await setProducts(updatedProducts);
    setIsFormOpen(false);
    setEditingProduct(null);
    setIsSaving(false);
  };
  
  // --- Category Management Handlers ---

  const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newCategory.trim() && !categories.find(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
          const updatedCategories = [...categories, newCategory.trim()];
          await setCategories(updatedCategories);
          setNewCategory('');
      } else {
        alert("Category is empty or already exists.");
      }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.current.trim()) {
        alert("Category name cannot be empty.");
        return;
    }
    if (categories.find(c => c.toLowerCase() === editingCategory.current.trim().toLowerCase() && c !== editingCategory.original)) {
        alert("A category with this name already exists.");
        return;
    }
    
    const updatedCategories = categories.map(c => c === editingCategory.original ? editingCategory.current.trim() : c);
    await setCategories(updatedCategories);

    // Also update products using this category
    const updatedProducts = products.map(p => 
        p.category === editingCategory.original ? { ...p, category: editingCategory.current.trim() } : p
    );
    await setProducts(updatedProducts);
    
    setEditingCategory(null);
  };
  
  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      const isCategoryInUse = products.some(p => p.category === categoryToDelete);
      if (isCategoryInUse) {
        alert(`Cannot delete category "${categoryToDelete}" because it is currently assigned to one or more products.`);
        setCategoryToDelete(null);
        return;
      }
      
      const updatedCategories = categories.filter(c => c !== categoryToDelete);
      await setCategories(updatedCategories);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Product Management */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Manage Products</h2>
          <button 
            onClick={handleAddProduct}
            className="bg-stone-800 text-white py-2 px-4 rounded-md font-semibold flex items-center hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-600"
          >
            <PlusIcon />
            <span className="ml-2">Add Product</span>
          </button>
        </div>

        {isFormOpen && (
          <ProductForm 
            product={editingProduct} 
            onSave={handleSaveProduct} 
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
            categories={categories}
            isSaving={isSaving}
          />
        )}
        
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">Ksh {product.price.toFixed(2)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button onClick={() => handleEditProduct(product)} className="text-stone-600 hover:text-stone-900 mr-4" title="Edit Product"><EditIcon /></button>
                        <button onClick={() => handleDeleteProduct(product)} className="text-red-600 hover:text-red-900" title="Delete Product"><TrashIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Management */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Manage Categories</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input 
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-grow px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
              <button type="submit" className="bg-stone-800 text-white py-2 px-4 rounded-md font-semibold flex items-center hover:bg-stone-700 transition-colors">
                  <PlusIcon />
                  <span className="ml-2">Add</span>
              </button>
          </form>

          <ul className="space-y-2">
              {categories.map(category => (
                  <li key={category} className="flex items-center justify-between p-2 rounded-md hover:bg-stone-50">
                      {editingCategory?.original === category ? (
                          <div className="flex-grow flex items-center gap-2">
                            <input
                              type="text"
                              value={editingCategory.current}
                              onChange={(e) => setEditingCategory({ ...editingCategory, current: e.target.value })}
                              className="flex-grow px-2 py-1 border border-stone-300 rounded-md"
                            />
                            <button onClick={handleUpdateCategory} className="text-emerald-600 hover:text-emerald-800"><CheckIcon /></button>
                            <button onClick={() => setEditingCategory(null)} className="text-stone-500 hover:text-stone-700"><XIcon className="h-5 w-5"/></button>
                          </div>
                      ) : (
                          <>
                            <span className="text-stone-700">{category}</span>
                            <div>
                                <button onClick={() => setEditingCategory({ original: category, current: category })} className="text-stone-600 hover:text-stone-900 mr-4" title="Edit Category"><EditIcon /></button>
                                <button onClick={() => setCategoryToDelete(category)} className="text-red-600 hover:text-red-900" title="Delete Category"><TrashIcon /></button>
                            </div>
                          </>
                      )}
                  </li>
              ))}
          </ul>
      </div>

      {productToDelete && (
        <ConfirmationModal 
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDeleteProduct}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
          isConfirming={isDeleting}
        />
      )}
      
      {categoryToDelete && (
        <ConfirmationModal
          isOpen={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={confirmDeleteCategory}
          title="Delete Category"
          message={`Are you sure you want to delete the category "${categoryToDelete}"?`}
          isConfirming={false} // Since checks happen inside, we don't need a separate loading state here
        />
      )}
    </div>
  );
};

export default AdminPanel;