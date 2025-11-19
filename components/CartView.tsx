
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

const CartView: React.FC<CartViewProps> = ({ isOpen, onClose, cartItems, onRemoveFromCart }) => {
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  // Check if any item in the cart is out of stock
  const hasOutOfStockItems = cartItems.some(item => !item.isInStock);

  // Calculate total only for in-stock items? Or full total? Usually full total, but we block checkout.
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  const handleWhatsAppInquiry = () => {
    if (hasOutOfStockItems) return;
    
    setIsSending(true);
    const productList = cartItems.map(item => `- ${item.name} (Ksh ${item.price.toFixed(2)})`).join('\n');
    const message = `Hello! I'm interested in the following products:\n\n${productList}\n\nTotal: Ksh ${cartTotal.toFixed(2)}\n\nPlease provide me with more information. Thank you.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSending(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-stone-800">Your Cart</h2>
          <button onClick={onClose} className="p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
            &times;
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
             <p className="text-stone-600">Your cart is empty.</p>
             <p className="text-sm text-stone-500 mt-2">Add products to your cart to get started.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            {hasOutOfStockItems && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-bold text-red-800">Action Required</h4>
                    <p className="text-xs text-red-700 mt-1">Some items in your cart are no longer available. Please remove them to proceed.</p>
                  </div>
              </div>
            )}

            <ul className="space-y-4">
              {cartItems.map(item => (
                <li key={item.id} className={`flex items-center space-x-4 ${!item.isInStock ? 'opacity-60' : ''}`}>
                  <div className="relative">
                    <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                    {!item.isInStock && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                            <span className="text-[10px] font-bold bg-red-600 text-white px-1 rounded">SOLD OUT</span>
                        </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-stone-800">{item.name}</p>
                    {item.isInStock ? (
                        <p className="text-sm text-stone-500">Ksh {item.price.toFixed(2)}</p>
                    ) : (
                        <p className="text-sm text-red-600 font-bold">Out of Stock</p>
                    )}
                  </div>
                  <button 
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-2 rounded-full text-stone-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-4 border-t bg-stone-50">
             <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-semibold text-stone-700">Total</span>
                <span className="font-bold text-stone-900">Ksh {cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleWhatsAppInquiry}
              disabled={isSending || hasOutOfStockItems}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center hover:bg-emerald-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed"
              title={hasOutOfStockItems ? "Please remove out of stock items first" : "Send inquiry via WhatsApp"}
            >
              {isSending ? (
                <>
                  <SpinnerIcon />
                  <span className="ml-2">Redirecting...</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon />
                  <span className="ml-2">Checkout via WhatsApp</span>
                </>
              )}
            </button>
             <p className="text-xs text-stone-500 mt-2 text-center">
               {hasOutOfStockItems 
                 ? "Please remove out of stock items to checkout." 
                 : "You will be redirected to WhatsApp to send your message."}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;
