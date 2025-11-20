
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
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => Promise<void>;
  categories: ProductCategory[];
  setCategories: (categories: ProductCategory[]) => Promise<void>;
  onLogout: () => void;
  onOpenWebsite: () => void;
  fullScreen?: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, setProducts, categories, setCategories, onLogout, onOpenWebsite, fullScreen = false }) => {
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
        const newProduct = { ...product, id: `prod-${Date.now()}`, isVisible: true };
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

  const handleToggleVisibility = async (productId: string) => {
    const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, isVisible: !p.isVisible } : p
    );
    // We can call setProducts directly to save this change
    await setProducts(updatedProducts);
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
      <div className="p-6 border-b border-stone-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900 sticky top-0 z-20 shadow-md">
         <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h2>
            <p className="text-sm text-stone-400 mt-1">Manage store products & content</p>
         </div>
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
                onClick={onOpenWebsite}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-md transition-colors font-medium border border-stone-600"
            >
                <EyeIcon className="h-5 w-5" />
                <span>Preview Website</span>
            </button>
            <button 
                onClick={onLogout}
                className="flex-none flex items-center justify-center gap-2 py-2 px-4 rounded border border-stone-600 text-stone-300 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800 transition-colors text-sm font-medium"
            >
                Log Out
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-6">
                <button 
                    onClick={handleAddProduct}
                    className="flex-1 bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-900/20 border border-emerald-500 transform hover:-translate-y-1"
                >
                    <PlusIcon className="h-6 w-6" />
                    <span className="ml-3 text-lg">Add New Product</span>
                </button>

                <div className="flex-1 bg-stone-800 rounded-xl border border-stone-700 overflow-hidden shadow-lg">
                     <button 
                        onClick={() => setShowCategories(!showCategories)}
                        className="w-full h-full flex items-center justify-between p-4 text-lg font-semibold text-stone-200 hover:bg-stone-700 transition-colors"
                     >
                        <span className="flex items-center gap-2">Manage Categories <span className="bg-stone-900 text-xs px-2 py-1 rounded-full text-stone-400">{categories.length}</span></span>
                        <ChevronDownIcon className={`h-5 w-5 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Category Expansion Panel */}
            {showCategories && (
                <div className="bg-stone-800 rounded-xl border border-stone-700 p-6 animate-fade-in">
                    <h3 className="font-bold text-white mb-4">Edit Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                                <input 
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Add new category name..."
                                    className="flex-grow px-3 py-2 bg-stone-900 border border-stone-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <button type="submit" className="bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-500">
                                    <PlusIcon className="h-5 w-5"/>
                                </button>
                            </form>
                        </div>
                        <div className="bg-stone-900 rounded-lg p-2 max-h-60 overflow-y-auto border border-stone-700">
                             <ul className="space-y-1">
                                {categories.map(category => (
                                    <li key={category} className="flex items-center justify-between py-2 px-2 hover:bg-stone-800 rounded group">
                                        {editingCategory?.original === category ? (
                                            <div className="flex items-center gap-2 w-full">
                                                <input
                                                type="text"
                                                value={editingCategory.current}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, current: e.target.value })}
                                                className="flex-grow px-2 py-1 text-sm bg-stone-700 border border-stone-600 text-white rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                autoFocus
                                                />
                                                <button onClick={handleUpdateCategory} className="text-emerald-400 hover:text-emerald-300 bg-stone-700 p-1 rounded"><CheckIcon className="h-4 w-4"/></button>
                                                <button onClick={() => setEditingCategory(null)} className="text-stone-400 hover:text-stone-300 bg-stone-700 p-1 rounded"><XIcon className="h-4 w-4"/></button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-stone-300 font-medium">{category}</span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingCategory({ original: category, current: category })} className="text-stone-400 hover:text-white hover:bg-stone-700 p-1 rounded"><EditIcon className="h-4 w-4"/></button>
                                                    <button onClick={() => setCategoryToDelete(category)} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-1 rounded"><TrashIcon className="h-4 w-4"/></button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-stone-400 uppercase tracking-wider">Product Inventory ({products.length})</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {products.map(product => (
                        <div key={product.id} className={`bg-stone-800 p-4 rounded-xl border border-stone-700 flex gap-4 items-center group hover:border-stone-500 hover:bg-stone-800/80 transition-all ${!product.isVisible && 'opacity-60'}`}>
                            <div className="h-20 w-20 rounded-lg bg-stone-700 flex-shrink-0 overflow-hidden border border-stone-600">
                                <img src={product.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-bold text-white truncate pr-2">{product.name}</h4>
                                    <span className="text-emerald-400 font-mono font-medium whitespace-nowrap">Ksh {product.price}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-400 mt-1">
                                    <span className="bg-stone-700 px-2 py-0.5 rounded text-xs">{product.category}</span>
                                    {product.isInStock ? (
                                        <span className="text-emerald-500 flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Stock</span>
                                    ) : (
                                        <span className="text-red-500 flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-red-500"></span> Out of Stock</span>
                                    )}
                                     {!product.isVisible && (
                                        <span className="text-amber-500 flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Hidden</span>
                                    )}
                                </div>
                                <div className="flex gap-4 mt-3">
                                    <button 
                                        onClick={() => handleEditProduct(product)} 
                                        className="text-sm text-stone-400 hover:text-white flex items-center gap-1 hover:underline transition-colors"
                                    >
                                        <EditIcon className="h-4 w-4" /> Edit
                                    </button>
                                     <button 
                                        onClick={() => handleToggleVisibility(product.id)} 
                                        className="text-sm text-stone-400 hover:text-white flex items-center gap-1 hover:underline transition-colors"
                                    >
                                        {product.isVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        {product.isVisible ? 'Hide' : 'Show'}
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteProduct(product)} 
                                        className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline transition-colors"
                                    >
                                        <TrashIcon className="h-4 w-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative animate-scale-in">
                 <style>{`@keyframes scale-in { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } } .animate-scale-in { animation: scale-in 0.2s ease-out; }`}</style>
                 <button 
                    onClick={() => { setIsFormOpen(false); setEditingProduct(null); }}
                    className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors"
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
