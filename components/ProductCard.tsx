import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
  onVisualizeClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isInCart, onVisualizeClick }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCartClick = () => {
    if (isInCart || isAdding) return;
    setIsAdding(true);
    // Simulate network delay
    setTimeout(() => {
      onAddToCart(product);
      setIsAdding(false);
    }, 700);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-2 left-2 bg-stone-800 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-stone-900 truncate">{product.name}</h3>
        <p className="text-xl font-bold text-stone-800 mt-1">Ksh {product.price.toFixed(2)}</p>
        <p className="text-stone-600 text-sm mt-2 flex-grow">{product.description}</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
           <button 
            onClick={() => onVisualizeClick(product)}
            className="w-full sm:w-auto flex-grow py-2 px-3 rounded-md font-semibold text-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
            title="Visualize in your room"
          >
            <SparklesIcon />
            <span className="ml-2 hidden sm:inline">Visualize</span>
          </button>
          <button 
            onClick={handleAddToCartClick}
            disabled={isInCart || isAdding}
            className={`w-full sm:w-auto flex-grow py-2 px-3 rounded-md font-semibold text-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isInCart
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
            ) : (
              <>
                <PlusIcon />
                <span className="ml-2">Add to Inquiry</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;