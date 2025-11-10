import React from 'react';
import { CartIcon } from './icons/CartIcon';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onNavigate: (view: 'products' | 'admin') => void;
  currentView: 'products' | 'admin';
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onNavigate, currentView, isAuthenticated, onLogout }) => {
  const linkClasses = (view: 'products' | 'admin') => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'bg-stone-800 text-white' 
        : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900'
    }`;
    
  const logoutButtonClass = 'px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-200 hover:text-stone-900';

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Interior Lux</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <button onClick={() => onNavigate('products')} className={linkClasses('products')}>
              Products
            </button>
            {isAuthenticated ? (
               <button onClick={onLogout} className={logoutButtonClass}>
                Logout
              </button>
            ) : (
              <button onClick={() => onNavigate('admin')} className={linkClasses('admin')}>
                Admin Panel
              </button>
            )}
          </nav>
          <div className="flex items-center">
            <button 
              onClick={onCartClick} 
              className="relative p-2 rounded-full text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
              aria-label="Open cart"
            >
              <CartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
         <div className="md:hidden flex justify-center pb-2">
            <div className="flex items-center space-x-2 bg-stone-200 p-1 rounded-lg">
                <button onClick={() => onNavigate('products')} className={linkClasses('products')}>
                Products
                </button>
                {isAuthenticated ? (
                  <button onClick={onLogout} className="px-3 py-2 rounded-md text-sm font-medium text-stone-600">
                    Logout
                  </button>
                ) : (
                  <button onClick={() => onNavigate('admin')} className={linkClasses('admin')}>
                    Admin
                  </button>
                )}
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;