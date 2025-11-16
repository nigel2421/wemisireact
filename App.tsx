import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from './types';
import { ADMIN_CREDENTIALS } from './constants';
import { getProducts, saveProducts, getCategories, saveCategories } from './lib/api';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import WishlistView from './components/WishlistView';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import RoomVisualizer from './components/RoomVisualizer';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import ProductDetailModal from './components/ProductDetailModal';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import CareersPage from './components/CareersPage';

type View = 'products' | 'admin' | 'about' | 'blog' | 'careers';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); // Store product IDs
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [productToVisualize, setProductToVisualize] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  // Load initial data from our simulated API
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const persistProducts = async (updatedProducts: Product[]) => {
      try {
        await saveProducts(updatedProducts);
        setProducts(updatedProducts);
      } catch (error) {
          console.error("Failed to save products", error);
      }
  };

  const persistCategories = async (updatedCategories: ProductCategory[]) => {
      try {
        await saveCategories(updatedCategories);
        setCategories(updatedCategories);
      } catch (error) {
          console.error("Failed to save categories", error);
      }
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
  
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prevWishlist => 
      prevWishlist.includes(productId)
        ? prevWishlist.filter(id => id !== productId)
        : [...prevWishlist, productId]
    );
  };
  
  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist(prevWishlist => prevWishlist.filter(id => id !== productId));
  };

  const handleMoveToCart = (product: Product) => {
    if (!isProductInCart(product.id)) {
      handleAddToCart(product);
    }
    handleRemoveFromWishlist(product.id);
  };

  const isProductInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const handleLogin = (username: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
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
  
  const handleNavigate = (view: View) => {
    if (currentView === 'products' && view !== 'products') {
        setSearchQuery('');
        setSelectedCategory('All');
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };
  
  const handleSelectCategory = (category: ProductCategory | 'All') => {
    setSelectedCategory(category);
    setCurrentView('products');
  };

  const handleVisualizeClick = (product: Product) => {
    setSelectedProduct(null); // Close detail modal if open
    setProductToVisualize(product);
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-stone-100 min-h-screen flex flex-col font-sans">
      <Header
        cartItemCount={cartItems.length}
        wishlistItemCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <SpinnerIcon className="h-12 w-12 text-stone-500" />
          </div>
        ) : currentView === 'products' ? (
          <ProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            isProductInCart={isProductInCart}
            onToggleWishlist={handleToggleWishlist}
            isProductInWishlist={isProductInWishlist}
            onVisualizeClick={handleVisualizeClick}
            onProductClick={(product) => setSelectedProduct(product)}
            selectedCategory={selectedCategory}
          />
        ) : currentView === 'about' ? (
          <AboutPage />
        ) : currentView === 'blog' ? (
          <BlogPage />
        ) : currentView === 'careers' ? (
          <CareersPage />
        ) : currentView === 'admin' && !isAuthenticated ? (
            <Login onLogin={handleLogin} error={authError} isLoading={isAuthLoading} />
        ) : currentView === 'admin' && isAuthenticated ? (
           <AdminPanel 
             products={products}
             setProducts={persistProducts}
             categories={categories}
             setCategories={persistCategories}
           />
        ) : null}
      </main>
      <CartView
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
      />
      <WishlistView
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={products.filter(p => wishlist.includes(p.id))}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        isProductInCart={isProductInCart}
      />
      {productToVisualize && (
        <RoomVisualizer 
          product={productToVisualize} 
          onClose={() => setProductToVisualize(null)}
        />
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isProductInCart={isProductInCart}
          onToggleWishlist={handleToggleWishlist}
          isProductInWishlist={isProductInWishlist(selectedProduct.id)}
          onVisualizeClick={handleVisualizeClick}
        />
      )}
      <Footer onNavigate={handleNavigate} isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default App;