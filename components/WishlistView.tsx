import React from 'react';
import { Product } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';
import { CheckIcon } from './icons/CheckIcon';

interface WishlistViewProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  isProductInCart: (productId: string) => boolean;
}

const WishlistView: React.FC<WishlistViewProps> = ({ 
    isOpen, 
    onClose, 
    wishlistItems, 
    onRemoveFromWishlist, 
    onMoveToCart,
    isProductInCart
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <HeartIcon className="text-stone-700" />
            Your Wishlist
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
            &times;
          </button>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
             <HeartIcon className="h-12 w-12 text-stone-300 mb-4" />
             <p className="text-stone-600 font-semibold">Your wishlist is empty.</p>
             <p className="text-sm text-stone-500 mt-2">Tap the heart on products to save them.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-4">
              {wishlistItems.map(item => (
                <li key={item.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-stone-50 transition-colors">
                  <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold text-stone-800">{item.name}</p>
                    <p className="text-sm text-stone-500">Ksh {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="p-2 rounded-full text-stone-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <TrashIcon />
                    </button>
                    <button 
                      onClick={() => onMoveToCart(item)}
                      disabled={isProductInCart(item.id)}
                      className={`py-1 px-3 rounded-full text-sm font-semibold flex items-center gap-1 transition-colors ${
                        isProductInCart(item.id) 
                        ? 'bg-emerald-100 text-emerald-700 cursor-default'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                      aria-label={`Move ${item.name} to inquiry cart`}
                    >
                      {isProductInCart(item.id) ? <CheckIcon/> : <PlusIcon />}
                      {isProductInCart(item.id) ? 'In Cart' : 'Add'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
         {wishlistItems.length > 0 && (
          <div className="p-4 border-t bg-stone-50">
             <button 
              onClick={onClose}
              className="w-full bg-stone-800 text-white py-3 px-4 rounded-lg font-bold hover:bg-stone-700 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistView;