
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-stone-500">
        <p>&copy; {new Date().getFullYear()} Interior Lux. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
