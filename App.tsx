
import React, { useState } from 'react';
import { Product } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Header from './components/Header';
import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import CartView from './components/CartView';
import Footer from './components/Footer';

type View = 'products' | 'admin';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<View>('products');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}-${Math.random()}`,
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    setCurrentView('products'); // Switch back to product view after adding
  };

  const addToCart = (productToAdd: Product) => {
    setCart(prevCart => {
      if (prevCart.find(p => p.id === productToAdd.id)) {
        return prevCart; // Prevent duplicates
      }
      return [...prevCart, productToAdd];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(p => p.id !== productId));
  };

  const isProductInCart = (productId: string) => {
    return cart.some(p => p.id === productId);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col">
      <Header
        cartItemCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'products' && (
          <ProductList 
            products={products} 
            onAddToCart={addToCart} 
            isProductInCart={isProductInCart}
          />
        )}
        {currentView === 'admin' && <AdminPanel onAddProduct={addProduct} />}
      </main>
      <CartView 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveFromCart={removeFromCart}
      />
      <Footer />
    </div>
  );
};

export default App;
