
import React, { useState } from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { XSocialIcon } from './icons/XSocialIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { MailIcon } from './icons/MailIcon';
import { LinkIcon } from './icons/LinkIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ShareModalProps {
  product: Product;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);
  // Simulating a direct product link using query parameters
  const shareUrl = `${window.location.origin}/?product=${product.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FacebookIcon className="h-6 w-6" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'X (Twitter)',
      icon: <XSocialIcon className="h-5 w-5" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on WEMISI!`)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black hover:bg-stone-800'
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="h-6 w-6" />,
      url: `https://wa.me/?text=${encodeURIComponent(`Check out ${product.name}: ${shareUrl}`)}`,
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      name: 'Email',
      icon: <MailIcon className="h-6 w-6" />,
      url: `mailto:?subject=${encodeURIComponent(`Check out ${product.name}`)}&body=${encodeURIComponent(`I found this amazing product on WEMISI: ${product.name}\n\n${product.description}\n\nView it here: ${shareUrl}`)}`,
      color: 'bg-stone-600 hover:bg-stone-700'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <style>{`
          @keyframes fade-in-up { 
            from { opacity: 0; transform: translateY(10px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        `}</style>
        <div className="flex justify-between items-center p-4 border-b border-stone-100">
          <h3 className="font-bold text-lg text-stone-800">Share Product</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Preview */}
          <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
            <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
            <div>
              <p className="font-semibold text-stone-900 line-clamp-1">{product.name}</p>
              <p className="text-sm text-stone-500">Ksh {product.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-4 gap-4">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform group-hover:-translate-y-1 shadow-sm ${link.color}`}>
                  {link.icon}
                </div>
                <span className="text-xs text-stone-600 font-medium">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Copy Link */}
          <div className="relative">
            <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">Product Link</label>
            <div className="flex shadow-sm rounded-md">
              <div className="relative flex-grow flex items-center focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="focus:ring-stone-500 focus:border-stone-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-stone-300 py-2.5 bg-stone-50 text-stone-600"
                />
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              >
                {copied ? <CheckIcon className="h-5 w-5 text-emerald-600" /> : <span>Copy</span>}
              </button>
            </div>
            {copied && (
              <p className="absolute top-full left-0 mt-1 text-xs text-emerald-600 font-medium animate-pulse">
                Link copied to clipboard!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
