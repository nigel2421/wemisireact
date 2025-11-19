
import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ShareIcon } from './icons/ShareIcon';
import StarRating from './StarRating';
import ShareModal from './ShareModal';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
  onVisualizeClick: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isInCart, onToggleWishlist, isInWishlist, onVisualizeClick, onProductClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showWishlistMessage, setShowWishlistMessage] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart || isAdding || !product.isInStock) return;
    setIsAdding(true);
    // Simulate network delay
    setTimeout(() => {
      onAddToCart(product);
      setIsAdding(false);
    }, 700);
  };

  const handleVisualizeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onVisualizeClick(product);
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent product click
    onToggleWishlist(product.id);
    
    // If we are adding (currently not in wishlist), show message
    if (!isInWishlist) {
        setShowWishlistMessage(true);
        setTimeout(() => {
            setShowWishlistMessage(false);
        }, 2000);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const reviewCount = product.reviews?.length || 0;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!product.isInStock ? 'opacity-90' : ''}`}>
      <style>{`
        @keyframes fade-in-up { 
          from { opacity: 0; transform: translateY(5px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
      <div className="relative">
        <div onClick={() => onProductClick(product)} className="cursor-pointer relative">
          <img 
            src={product.imageUrls[0]} 
            alt={product.name} 
            className={`w-full h-48 object-cover ${!product.isInStock ? 'grayscale-[50%]' : ''}`} 
          />
          {!product.isInStock && (
             <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
                <span className="bg-stone-800/90 text-white px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wider shadow-lg backdrop-blur-sm">
                    Out of Stock
                </span>
             </div>
          )}
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
            <div className="bg-stone-800 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.category}
            </div>
            {product.isNewArrival && (
                <div className="bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    New Arrival
                </div>
            )}
        </div>
        
        {/* Action Buttons (Share & Wishlist) */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
                onClick={handleShareClick}
                className="p-2 rounded-full transition-colors duration-200 bg-white/80 text-stone-700 hover:bg-stone-100 hover:text-stone-900 shadow-sm"
                aria-label="Share product"
            >
                <ShareIcon className="h-5 w-5" />
            </button>
            <button
                onClick={handleWishlistClick}
                className={`p-2 rounded-full transition-colors duration-200 shadow-sm ${
                    isInWishlist 
                    ? 'bg-red-500/80 text-white' 
                    : 'bg-white/80 text-stone-700 hover:bg-red-100 hover:text-red-500'
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <HeartIcon filled={isInWishlist} className="h-5 w-5" />
            </button>
        </div>

        {showWishlistMessage && (
            <div className="absolute top-14 right-2 bg-stone-800 text-white text-xs py-1.5 px-3 rounded-md shadow-lg animate-fade-in-up z-20 pointer-events-none after:content-[''] after:absolute after:bottom-full after:right-3 after:border-4 after:border-transparent after:border-b-stone-800">
                Added to wishlist
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div onClick={() => onProductClick(product)} className="flex-grow cursor-pointer">
          <div className="flex justify-between items-start">
             <h3 className="text-lg font-bold text-stone-900 truncate group-hover:text-stone-600 transition-colors">{product.name}</h3>
          </div>
          
          {/* Ratings Display */}
          <div className="flex items-center gap-1 mt-1 mb-2">
            <StarRating rating={averageRating} sizeClass="h-4 w-4" />
            <span className="text-xs text-stone-500 ml-1">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <p className="text-xl font-bold text-stone-800 mt-1">Ksh {product.price.toFixed(2)}</p>
          <p className="text-stone-600 text-sm mt-2 flex-grow line-clamp-2">{product.description}</p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
           <button 
            onClick={handleVisualizeClick}
            className="w-full sm:w-auto flex-grow py-2 px-3 rounded-md font-semibold text-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
            title="Visualize in your room"
          >
            <SparklesIcon />
            <span className="ml-2 hidden sm:inline">Visualize</span>
          </button>
          <button 
            onClick={handleAddToCartClick}
            disabled={isInCart || isAdding || !product.isInStock}
            className={`w-full sm:w-auto flex-grow py-2 px-3 rounded-md font-semibold text-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !product.isInStock 
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-500 text-white cursor-not-allowed'
                : isAdding
                ? 'bg-stone-500 text-white cursor-wait'
                : 'bg-stone-800 text-white hover:bg-stone-700 focus:ring-stone-600'
            }`}
          >
            {isAdding ? (
              <>
                <SpinnerIcon />
                <span className="ml-2">Adding...</span>
              </>
            ) : isInCart ? (
              <>
                <CheckIcon />
                <span className="ml-2">In Cart</span>
              </>
            ) : !product.isInStock ? (
               <span className="ml-2">Out of Stock</span>
            ) : (
              <>
                <PlusIcon />
                <span className="ml-2">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {isShareModalOpen && (
        <ShareModal product={product} onClose={() => setIsShareModalOpen(false)} />
      )}
    </div>
  );
};

export default ProductCard;