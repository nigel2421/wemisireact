import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { INITIAL_PRODUCTS, ADMIN_CREDENTIALS } from './constants';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import RoomVisualizer from './components/RoomVisualizer';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'products' | 'admin'>('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [productToVisualize, setProductToVisualize] = useState<Product | null>(null);

  // Load products from localStorage or use initial products
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
      }
    } catch (error) {
      console.error("Failed to load products from localStorage", error);
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);
  
  // Persist products to localStorage whenever they change
  const persistProducts = (updatedProducts: Product[]) => {
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => [...prevItems, product]);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isProductInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };
  
  const handleLogin = (username: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    // Simulate network request
    setTimeout(() => {
      const isAdmin = ADMIN_CREDENTIALS.some(
        cred => cred.username === username && cred.password === password
      );
      if (isAdmin) {
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid username or password.');
      }
      setIsAuthLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('products');
  };
  
  const handleNavigate = (view: 'products' | 'admin') => {
    setCurrentView(view);
  };

  return (
    <div className="bg-stone-100 min-h-screen flex flex-col font-sans">
      <Header
        cartItemCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'products' && (
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            isProductInCart={isProductInCart}
            onVisualizeClick={(product) => setProductToVisualize(product)}
          />
        )}
        {currentView === 'admin' && !isAuthenticated && (
            <Login onLogin={handleLogin} error={authError} isLoading={isAuthLoading} />
        )}
        {currentView === 'admin' && isAuthenticated && (
           <AdminPanel 
             products={products}
             setProducts={persistProducts}
           />
        )}
      </main>
      <CartView
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
      />
      {productToVisualize && (
        <RoomVisualizer 
          product={productToVisualize} 
          onClose={() => setProductToVisualize(null)}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;