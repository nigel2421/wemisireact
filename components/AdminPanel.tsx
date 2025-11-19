
import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import ProductForm from './ProductForm';
import ConfirmationModal from './ConfirmationModal';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => Promise<void>;
  categories: ProductCategory[];
  setCategories: (categories: ProductCategory[]) => Promise<void>;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, setProducts, categories, setCategories, onLogout }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Category management state
  const [showCategories, setShowCategories] = useState(false);
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
      try {
        const updatedProducts = products.filter(p => p.id !== productToDelete.id);
        await setProducts(updatedProducts);
        setProductToDelete(null);
      } catch (e) {
        // Error is handled globally by App.tsx notification
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSaveProduct = async (product: Product) => {
    setIsSaving(true);

    try {
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
    } catch (e) {
        // Error handled globally
    } finally {
        setIsSaving(false);
    }
  };
  
  // --- Category Management Handlers ---

  const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newCategory.trim() && !categories.find(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
          try {
            const updatedCategories = [...categories, newCategory.trim()];
            await setCategories(updatedCategories);
            setNewCategory('');
          } catch (e) {
            // Error handled globally
          }
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
    
    try {
        const updatedCategories = categories.map(c => c === editingCategory.original ? editingCategory.current.trim() : c);
        await setCategories(updatedCategories);

        // Also update products using this category
        const updatedProducts = products.map(p => 
            p.category === editingCategory.original ? { ...p, category: editingCategory.current.trim() } : p
        );
        await setProducts(updatedProducts);
        
        setEditingCategory(null);
    } catch (e) {
        // Error handled globally
    }
  };
  
  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      const isCategoryInUse = products.some(p => p.category === categoryToDelete);
      if (isCategoryInUse) {
        alert(`Cannot delete category "${categoryToDelete}" because it is currently assigned to one or more products.`);
        setCategoryToDelete(null);
        return;
      }
      
      try {
        const updatedCategories = categories.filter(c => c !== categoryToDelete);
        await setCategories(updatedCategories);
        setCategoryToDelete(null);
      } catch (e) {
        // Error handled globally
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-stone-900 text-stone-100">
      {/* Header */}
      <div className="p-6 border-b border-stone-700">
         <h2 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h2>
         <p className="text-xs text-stone-400 mt-1">Manage store content</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Actions */}
        <button 
            onClick={handleAddProduct}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg"
        >
            <PlusIcon className="h-5 w-5" />
            <span className="ml-2">Add New Product</span>
        </button>

        {/* Category Management Section */}
        <div className="bg-stone-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="w-full flex items-center justify-between p-3 text-sm font-semibold text-stone-200 hover:bg-stone-700 transition-colors"
            >
                <span>Manage Categories</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </button>
            
            {showCategories && (
                <div className="p-3 border-t border-stone-700 bg-stone-800/50">
                     <form onSubmit={handleAddCategory} className="flex gap-2 mb-3">
                        <input 
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category"
                            className="flex-grow px-2 py-1 text-sm bg-stone-700 border border-stone-600 text-white rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button type="submit" className="bg-stone-600 text-white p-1 rounded hover:bg-stone-500">
                            <PlusIcon className="h-5 w-5"/>
                        </button>
                    </form>
                    <ul className="space-y-1">
                        {categories.map(category => (
                             <li key={category} className="flex items-center justify-between py-1 group">
                                {editingCategory?.original === category ? (
                                    <div className="flex items-center gap-1 w-full">
                                        <input
                                        type="text"
                                        value={editingCategory.current}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, current: e.target.value })}
                                        className="flex-grow px-1 py-0.5 text-sm bg-stone-700 border border-stone-600 text-white rounded"
                                        autoFocus
                                        />
                                        <button onClick={handleUpdateCategory} className="text-emerald-400 hover:text-emerald-300"><CheckIcon className="h-4 w-4"/></button>
                                        <button onClick={() => setEditingCategory(null)} className="text-stone-400 hover:text-stone-300"><XIcon className="h-4 w-4"/></button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm text-stone-300">{category}</span>
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingCategory({ original: category, current: category })} className="text-stone-400 hover:text-white p-1"><EditIcon className="h-3 w-3"/></button>
                                            <button onClick={() => setCategoryToDelete(category)} className="text-red-400 hover:text-red-300 p-1"><TrashIcon className="h-3 w-3"/></button>
                                        </div>
                                    </>
                                )}
                             </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* Products List */}
        <div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">All Products</h3>
            <div className="space-y-3">
                {products.map(product => (
                    <div key={product.id} className="bg-stone-800 p-3 rounded-lg border border-stone-700 flex gap-3 items-start group hover:border-stone-600 transition-colors">
                        <div className="h-12 w-12 rounded-md bg-stone-700 flex-shrink-0 overflow-hidden">
                            <img src={product.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                                <span className="text-xs text-emerald-400 font-mono">Ksh {product.price}</span>
                            </div>
                            <p className="text-xs text-stone-400 truncate">{product.category}</p>
                            <div className="flex gap-3 mt-2">
                                <button 
                                    onClick={() => handleEditProduct(product)} 
                                    className="text-xs text-stone-400 hover:text-white flex items-center gap-1 hover:underline"
                                >
                                    <EditIcon className="h-3 w-3" /> Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteProduct(product)} 
                                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
                                >
                                    <TrashIcon className="h-3 w-3" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* Logout */}
      <div className="p-4 border-t border-stone-700 bg-stone-800/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-stone-600 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors text-sm font-medium"
          >
             <span>Log Out</span>
          </button>
      </div>


      {/* Modals */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative">
                 <button 
                    onClick={() => { setIsFormOpen(false); setEditingProduct(null); }}
                    className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
                 >
                     <XIcon />
                 </button>
                 <div className="p-1">
                    <ProductForm 
                        product={editingProduct} 
                        onSave={handleSaveProduct} 
                        onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
                        categories={categories}
                        isSaving={isSaving}
                    />
                 </div>
            </div>
        </div>
      )}

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
          isConfirming={false} 
        />
      )}
    </div>
  );
};

export default AdminPanel;
