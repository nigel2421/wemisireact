
import React from 'react';
import { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isInCart }) => {
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
        <p className="text-stone-600 text-sm mt-1 flex-grow">{product.description}</p>
        <button 
          onClick={() => !isInCart && onAddToCart(product)}
          disabled={isInCart}
          className={`w-full mt-4 py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isInCart
              ? 'bg-emerald-500 text-white cursor-not-allowed'
              : 'bg-stone-800 text-white hover:bg-stone-700 focus:ring-stone-600'
          }`}
        >
          {isInCart ? (
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
  );
};

export default ProductCard;
