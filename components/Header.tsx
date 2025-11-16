import React, { useState, useRef, useEffect } from 'react';
import { CartIcon } from './icons/CartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ProductCategory } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

type View = 'products' | 'admin' | 'about' | 'blog' | 'careers';

interface HeaderProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
  isAuthenticated: boolean;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: ProductCategory[];
  selectedCategory: string;
  onSelectCategory: (category: ProductCategory | 'All') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItemCount, 
  wishlistItemCount,
  onCartClick, 
  onWishlistClick,
  onNavigate, 
  currentView, 
  isAuthenticated, 
  onLogout,
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks: { view: View, label: string }[] = [
    { view: 'about', label: 'About Us' },
    { view: 'blog', label: 'Blog' },
    { view: 'careers', label: 'Careers' },
  ];

  const linkClasses = (view: View) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'bg-stone-800 text-white' 
        : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900'
    }`;
    
  const mobileLinkClasses = (view?: View) => `block w-full text-left py-3 px-4 text-lg font-medium rounded-md ${
    currentView === view ? 'bg-stone-200 text-stone-900' : 'text-stone-700 hover:bg-stone-100'
  }`;

  const categoryButtonClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
      currentView === 'products'
        ? 'bg-stone-800 text-white' 
        : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900'
    }`;
    
  const authButtonClass = 'px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-200 hover:text-stone-900';

  const handleCategoryClick = (category: ProductCategory | 'All') => {
    onSelectCategory(category);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  const handleMobileNavClick = (view: View) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  }

  const renderDesktopDropdown = () => (
    <div className="absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
      <button onClick={() => handleCategoryClick('All')} className="text-left w-full block px-4 py-2 text-sm text-stone-700 hover:bg-stone-100">
        All Products
      </button>
      {categories.map(category => (
        <button 
          key={category} 
          onClick={() => handleCategoryClick(category)} 
          className="text-left w-full block px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
        >
          {category}
        </button>
      ))}
    </div>
  );

  const renderMobileMenu = () => (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
      {/* Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2" aria-label="Close menu">
                <XIcon />
            </button>
        </div>
        <div className="p-4 space-y-2">
            <div>
              <button onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)} className={`${mobileLinkClasses()} flex justify-between items-center`}>
                Categories
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileCategoriesOpen && (
                <div className="pl-4 mt-2 space-y-1 border-l-2 border-stone-200">
                   <button onClick={() => handleCategoryClick('All')} className="block w-full text-left py-2 px-3 text-md text-stone-600 hover:bg-stone-100 rounded-md">
                    All Products
                  </button>
                  {categories.map(category => (
                    <button key={category} onClick={() => handleCategoryClick(category)} className="block w-full text-left py-2 px-3 text-md text-stone-600 hover:bg-stone-100 rounded-md">
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {navLinks.map(link => (
              <button key={link.view} onClick={() => handleMobileNavClick(link.view)} className={mobileLinkClasses(link.view)}>
                {link.label}
              </button>
            ))}
            {isAuthenticated && (
              <button onClick={onLogout} className={mobileLinkClasses()}>
                Logout
              </button>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
               <button onClick={() => onNavigate('products')} className="text-2xl font-bold text-stone-800 tracking-tight">WEMISI</button>
            </div>

            {/* Search Bar - Desktop */}
            {currentView === 'products' && (
              <div className="hidden md:flex flex-1 justify-center px-4">
                <div className="relative w-full max-w-lg">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="text-stone-400" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="block w-full rounded-md border border-stone-300 bg-white py-2 pl-10 pr-3 leading-5 text-stone-900 placeholder-stone-500 focus:border-stone-500 focus:placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500 sm:text-sm"
                    placeholder="Search products..."
                  />
                </div>
              </div>
            )}
            
            <div className="flex-shrink-0 flex items-center">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className={categoryButtonClasses}
                  >
                    Categories <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && renderDesktopDropdown()}
                </div>
                
                {navLinks.map(link => (
                  <button key={link.view} onClick={() => onNavigate(link.view)} className={linkClasses(link.view)}>
                    {link.label}
                  </button>
                ))}
                {isAuthenticated && (
                   <button onClick={onLogout} className={authButtonClass}>
                    Logout
                  </button>
                )}
              </nav>

              {/* Icons and Mobile Menu Trigger */}
              <div className="flex items-center space-x-2 md:ml-4">
                <button 
                  onClick={onWishlistClick} 
                  className="relative p-2 rounded-full text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
                  aria-label="Open wishlist"
                >
                  <HeartIcon />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {wishlistItemCount}
                    </span>
                  )}
                </button>
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
                <div className="md:hidden">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-full text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors"
                        aria-label="Open menu"
                    >
                        <MenuIcon />
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          {currentView === 'products' && (
            <div className="md:hidden pb-3">
              <div className="relative w-full text-stone-400 focus-within:text-stone-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon />
                </div>
                <input
                  type="search"
                  name="search-mobile"
                  id="search-mobile"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="block w-full rounded-md border border-stone-300 bg-white py-2 pl-10 pr-3 leading-5 text-stone-900 placeholder-stone-500 focus:border-stone-500 focus:placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500 sm:text-sm"
                  placeholder="Search products..."
                />
              </div>
            </div>
          )}
        </div>
      </header>
      {renderMobileMenu()}
    </>
  );
};

export default Header;