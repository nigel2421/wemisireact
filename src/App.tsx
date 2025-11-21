
import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory, Review } from './types';
import { getProducts, saveProducts, getCategories, saveCategories, login } from './lib/api';
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
import Notification from './components/Notification';
import { EyeIcon } from './components/icons/EyeIcon';
import { XIcon } from './components/icons/XIcon';

type View = 'products' | 'admin' | 'about' | 'blog' | 'careers';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  
  // --- State Persistence ---
  // Load cart, wishlist, and auth status from localStorage on initial load.
  const [cartItems, setCartItems] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  // --- End State Persistence ---

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('products');
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  const [productToVisualize, setProductToVisualize] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Admin State - Website Preview Toggle
  const [isWebsiteOpen, setIsWebsiteOpen] = useState(false);

  // Scroll Ref
  const websiteContentRef = useRef<HTMLDivElement>(null);

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
        setNotification({ type: 'error', message: 'Failed to load application data. Please check your internet connection.' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // --- State Persistence Effects ---
  // Save cart and wishlist to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  const persistProducts = async (updatedProducts: Product[]) => {
      try {
        await saveProducts(updatedProducts);
        setProducts(updatedProducts);
        
        // Update items in cart to reflect new product state (e.g. price changes, out of stock)
        setCartItems(prevCart => prevCart.map(cartItem => {
            const updatedItem = updatedProducts.find(p => p.id === cartItem.id);
            return updatedItem ? updatedItem : cartItem;
        }));

        setNotification({ type: 'success', message: 'Products updated successfully.' });
      } catch (error) {
          console.error("Failed to save products", error);
          setNotification({ type: 'error', message: 'Failed to save changes. Please try again.' });
          throw error; // Re-throw to allow caller to handle failure (e.g. stop loading spinner)
      }
  };

  const persistCategories = async (updatedCategories: ProductCategory[]) => {
      try {
        await saveCategories(updatedCategories);
        setCategories(updatedCategories);
        setNotification({ type: 'success', message: 'Categories updated successfully.' });
      } catch (error) {
          console.error("Failed to save categories", error);
          setNotification({ type: 'error', message: 'Failed to save categories. Please try again.' });
          throw error;
      }
  };

  const handleAddToCart = (product: Product) => {
    if (!product.isInStock) {
      setNotification({ type: 'error', message: 'This item is currently out of stock.' });
      return;
    }
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
    if (product.isInStock) {
        handleRemoveFromWishlist(product.id);
    }
  };

  const isProductInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const handleLogin = async (username: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      await login(username, password);
      setIsAuthenticated(true);
      setIsWebsiteOpen(false); // Default to Admin View
    } catch (error: any) {
      setAuthError(error.message || 'An unknown error occurred.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setIsWebsiteOpen(false);
    setCurrentView('products');
  };
  
  const handleNavigate = (view: View) => {
    if (currentView === 'products' && view !== 'products') {
        setSearchQuery('');
        setSelectedCategory('All');
    }
    setCurrentView(view);
    
    // Scroll container to top
    if (websiteContentRef.current) {
        websiteContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleSelectCategory = (category: ProductCategory | 'All') => {
    setSelectedCategory(category);
    setCurrentView('products');
  };

  const handleVisualizeClick = (product: Product) => {
    setSelectedProduct(null); // Close detail modal if open
    setProductToVisualize(product);
  }

  const handleAddReview = async (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const updatedProduct = {
          ...p,
          reviews: [...(p.reviews || []), newReview]
        };
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(updatedProduct);
        }
        return updatedProduct;
      }
      return p;
    });

    try {
        await saveProducts(updatedProducts);
        setProducts(updatedProducts);
        setNotification({ type: 'success', message: 'Review added successfully.' });
    } catch (error) {
        console.error("Failed to save review", error);
        setNotification({ type: 'error', message: 'Failed to submit review. Please try again.' });
    }
  };

  // Handler for opening website preview
  const handleOpenWebsite = () => {
      setIsWebsiteOpen(true);
      // Important: Switch view to 'products' if we are currently on 'admin' 
      // to prevent showing a blank screen (since 'admin' view renders null when authenticated)
      if (currentView === 'admin') {
          setCurrentView('products');
      }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Common Content Render Helper
  const renderWebsiteContent = () => (
     <div ref={websiteContentRef} className="flex-1 flex flex-col h-full overflow-y-auto relative scroll-smooth bg-stone-100">
        <Header
            cartItemCount={cartItems.length}
            wishlistItemCount={wishlist.length}
            onCartClick={() => setIsCartOpen(true)}
            onWishlistClick={() => setIsWishlistOpen(true)}
            onNavigate={handleNavigate}
            currentView={currentView}
            isAuthenticated={isAuthenticated}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onAdminMenuClick={() => setIsWebsiteOpen(false)} // Allows returning to dashboard
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
            <BlogPage products={products} onProductClick={setSelectedProduct} />
            ) : currentView === 'careers' ? (
            <CareersPage />
            ) : currentView === 'admin' && !isAuthenticated ? (
                <Login 
                    onLogin={handleLogin} 
                    error={authError} 
                    isLoading={isAuthLoading} 
                />
            ) : null}
        </main>

        <Footer onNavigate={handleNavigate} isAuthenticated={isAuthenticated} />

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
            onAddReview={handleAddReview}
            />
        )}
      </div>
  );

  return (
    <div className="h-screen bg-stone-100 font-sans overflow-hidden relative">
      
      {isAuthenticated ? (
        // --- AUTHENTICATED LAYOUT ---
        // Admin Panel is the base layer (Primary View)
        // Website is the overlay/drawer (Secondary View)
        <>
            <div className="absolute inset-0 z-0 bg-stone-900 overflow-y-auto">
                <AdminPanel 
                    products={products}
                    setProducts={persistProducts}
                    categories={categories}
                    setCategories={persistCategories}
                    onLogout={handleLogout}
                    onOpenWebsite={handleOpenWebsite}
                    fullScreen
                />
            </div>

            {/* Website Preview Drawer */}
            <div className={`
                absolute inset-0 z-50 bg-stone-100 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
                ${isWebsiteOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Preview Mode Banner */}
                <div className="bg-emerald-700 text-white px-4 py-2 text-sm font-bold flex justify-between items-center flex-shrink-0 shadow-md z-50">
                    <div className="flex items-center gap-2">
                        <EyeIcon className="h-5 w-5 text-emerald-200"/> 
                        <span>Website Preview Mode</span>
                    </div>
                    <button 
                        onClick={() => setIsWebsiteOpen(false)} 
                        className="bg-emerald-800/50 hover:bg-emerald-900/50 px-3 py-1.5 rounded text-white transition-colors flex items-center gap-1 text-xs uppercase tracking-wide border border-emerald-600/50"
                    >
                        <XIcon className="h-4 w-4" /> Return to Admin
                    </button>
                </div>
                
                {/* Website Content Wrapper */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {renderWebsiteContent()}
                </div>
            </div>
        </>
      ) : (
        // --- PUBLIC LAYOUT ---
        renderWebsiteContent()
      )}

      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
};

export default App;
