import React, { useState } from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isProductInCart: (productId: string) => boolean;
  onToggleWishlist: (productId: string) => void;
  isProductInWishlist: boolean;
  onVisualizeClick: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
    product, 
    onClose, 
    onAddToCart, 
    isProductInCart,
    onToggleWishlist, 
    isProductInWishlist, 
    onVisualizeClick 
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCartClick = () => {
    if (isProductInCart(product.id) || isAdding) return;
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product);
      setIsAdding(false);
    }, 700);
  };
  
  const handlePrev = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <style>{`
        @keyframes fade-in-image { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in-image { animation: fade-in-image 0.3s ease-in-out; }
      `}</style>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col md:flex-row relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 rounded-full text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors z-20"
          aria-label="Close product details"
        >
          <XIcon />
        </button>

        {/* Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col p-4 sm:p-6 bg-stone-50">
          <div className="relative aspect-square w-full flex-grow flex items-center justify-center overflow-hidden">
            <img 
              key={activeImageIndex}
              src={product.imageUrls[activeImageIndex]} 
              alt={`${product.name} - view ${activeImageIndex + 1}`} 
              className="max-w-full max-h-full object-contain rounded-lg animate-fade-in-image"
            />
            {product.imageUrls.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 text-stone-800 backdrop-blur-sm hover:bg-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-stone-500 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 text-stone-800 backdrop-blur-sm hover:bg-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-stone-500 z-10"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {product.imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                    activeImageIndex === index ? 'bg-stone-800' : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col overflow-y-auto">
          <div className="flex-grow">
            <div className="text-sm font-medium text-stone-500 mb-1">{product.category}</div>
            <h2 className="text-3xl font-bold text-stone-900">{product.name}</h2>
            <p className="text-3xl font-bold text-stone-800 mt-2">Ksh {product.price.toFixed(2)}</p>
            <p className="text-stone-600 mt-4 text-base leading-relaxed">{product.description}</p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
            <div className="flex items-stretch gap-3">
               <button 
                onClick={handleAddToCartClick}
                disabled={isProductInCart(product.id) || isAdding}
                className={`w-full flex-grow py-3 px-4 rounded-md font-semibold text-base flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isProductInCart(product.id)
                    ? 'bg-emerald-500 text-white cursor-not-allowed'
                    : isAdding
                    ? 'bg-stone-500 text-white cursor-wait'
                    : 'bg-stone-800 text-white hover:bg-stone-700 focus:ring-stone-600'
                }`}
              >
                {isAdding ? <SpinnerIcon /> : isProductInCart(product.id) ? <CheckIcon /> : <PlusIcon />}
                <span className="ml-2">{isAdding ? 'Adding...' : isProductInCart(product.id) ? 'In Cart' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3 rounded-md transition-colors duration-200 border-2 ${
                  isProductInWishlist 
                    ? 'bg-red-50 text-red-500 border-red-200' 
                    : 'bg-stone-100 text-stone-700 hover:bg-red-50 hover:text-red-500 border-stone-200'
                }`}
                aria-label={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HeartIcon filled={isProductInWishlist} className="h-6 w-6"/>
              </button>
            </div>
             <button 
              onClick={() => onVisualizeClick(product)}
              className="w-full py-3 px-4 rounded-md font-semibold text-base flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
            >
              <SparklesIcon />
              <span className="ml-2">Visualize in your room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
