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

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  const handleWhatsAppInquiry = () => {
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
          <h2 className="text-xl font-bold text-stone-800">Your Inquiry Cart</h2>
          <button onClick={onClose} className="p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
            &times;
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
             <p className="text-stone-600">Your cart is empty.</p>
             <p className="text-sm text-stone-500 mt-2">Add products to send an inquiry.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-4">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-grow">
                    <p className="font-semibold text-stone-800">{item.name}</p>
                    <p className="text-sm text-stone-500">Ksh {item.price.toFixed(2)}</p>
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
              disabled={isSending}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center hover:bg-emerald-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:cursor-wait"
            >
              {isSending ? (
                <>
                  <SpinnerIcon />
                  <span className="ml-2">Redirecting...</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon />
                  <span className="ml-2">Send Inquiry on WhatsApp</span>
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