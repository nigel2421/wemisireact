import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { XSocialIcon } from './icons/XSocialIcon';

type View = 'products' | 'admin' | 'about' | 'blog' | 'careers';

interface FooterProps {
  onNavigate: (view: View) => void;
  isAuthenticated: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, isAuthenticated }) => {
  return (
    <footer className="bg-white border-t border-stone-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with columns */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Column 1: Wemisi */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-stone-800">WEMISI</h3>
            <p className="text-stone-600">
              The leading Kenyan supplier of high-quality interior design products, including tiles, marble, fences, and natural stone for elegant and timeless spaces.
            </p>
          </div>

          {/* Column 2: The Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-800">The Company</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('about')} className="text-stone-600 hover:text-stone-900 hover:underline">About Us</button></li>
              <li><button onClick={() => onNavigate('blog')} className="text-stone-600 hover:text-stone-900 hover:underline">Blog</button></li>
              <li><button onClick={() => onNavigate('careers')} className="text-stone-600 hover:text-stone-900 hover:underline">Careers</button></li>
              {!isAuthenticated && (
                <li><button onClick={() => onNavigate('admin')} className="text-stone-600 hover:text-stone-900 hover:underline">Admin Panel</button></li>
              )}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-800">Contact Us</h3>
             <div>
              <p className="text-stone-700"><strong>Email:</strong> <a href="mailto:hello@wemisi.com" className="hover:underline">hello@wemisi.com</a></p>
              <p className="text-stone-700"><strong>WhatsApp:</strong> <a href="tel:+254712345678" className="hover:underline">+254 712 345 678</a></p>
            </div>
            <p className="text-stone-600">
              <strong>Address:</strong><br />
              123 Industrial Area, Off Mombasa Road<br/>
              Nairobi, Kenya
            </p>
             <p className="text-stone-600">
              <strong>Business Hours:</strong><br />
               Mon - Fri: 9am - 5pm
            </p>
          </div>
        </div>

        {/* Bottom section with copyright and social links */}
        <div className="py-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-stone-500">&copy; {new Date().getFullYear()} WEMISI. All Rights Reserved.</p>
          <div className="flex justify-center space-x-6 mt-4 sm:mt-0">
            <a href="#" aria-label="Facebook" className="text-stone-400 hover:text-stone-600 transition-colors">
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Instagram" className="text-stone-400 hover:text-stone-600 transition-colors">
              <InstagramIcon className="h-6 w-6" />
            </a>
            <a href="#" aria-label="X" className="text-stone-400 hover:text-stone-600 transition-colors">
              <XSocialIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;