import React, { useState } from 'react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { TrashIcon } from './icons/TrashIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface CartViewProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveFromCart: (productId: string) => void;
}

// Helper function to safely format the price
const formatPrice = (price: number | undefined | null): string => {
  // Fix: Safely handle undefined or null prices, treating them as 0 for calculation
  const safePrice = price ?? 0;
  return safePrice.toFixed(2);
};

const CartView: React.FC<CartViewProps> = ({ isOpen, onClose, cartItems, onRemoveFromCart }) => {
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  // Calculate total. We ensure the accumulator starts at 0 and item prices default to 0.
  const cartTotal = cartItems.reduce((total, item) => total + (item.price ?? 0), 0);

  const handleWhatsAppInquiry = () => {
    setIsSending(true);
    
    // FIX: Ensure item.price is safely handled within the map operation (Previous crash point)
    const productList = cartItems.map(item => 
      `- ${item.name} (Ksh ${formatPrice(item.price)})`
    ).join('\n');
    
    // Safely format cartTotal
    const message = `Hello! I'm interested in the following products:\n\n${productList}\n\nTotal: Ksh ${formatPrice(cartTotal)}\n\nPlease provide me with more information. Thank you.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Simulate delay for a better user experience while the WhatsApp message is prepared
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSending(false);
      onClose();
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-stone-800">Your Inquiry Cart ({cartItems.length})</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
            aria-label="Close Cart"
          >
            &times;
          </button>
        </div>
        
        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
             <p className="text-stone-600">Your cart is empty.</p>
             <p className="text-sm text-stone-500 mt-2">Add products to send an inquiry.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-4">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-md object-cover flex-shrink-0" 
                    // Fallback for image loading issues
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src = `https://placehold.co/100x100/A8A29E/ffffff?text=No+Img`;
                    }}
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-stone-800 truncate">{item.name}</p>
                    {/* FIX: Ensure item.price is safely handled in the display */}
                    <p className="text-sm text-stone-500">Ksh {formatPrice(item.price)}</p>
                  </div>
                  <button 
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-2 rounded-full text-stone-500 hover:bg-red-100 hover:text-red-600 transition-colors flex-shrink-0"
                    aria-label={`Remove ${item.name}`}
                    title="Remove from Cart"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t bg-stone-50">
             <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-semibold text-stone-700">Total Inquiry Value</span>
                <span className="font-bold text-stone-900">Ksh {formatPrice(cartTotal)}</span>
            </div>
            <button 
              onClick={handleWhatsAppInquiry}
              disabled={isSending}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:bg-emerald-400 disabled:cursor-wait"
            >
              {isSending ? (
                <>
                  <SpinnerIcon className="animate-spin mr-2 h-5 w-5" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon className="mr-2 h-5 w-5" />
                  <span>Send Inquiry on WhatsApp</span>
                </>
              )}
            </button>
             <p className="text-xs text-stone-500 mt-2 text-center">You will be redirected to WhatsApp to send your message.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;