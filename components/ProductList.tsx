
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { SearchIcon } from './icons/SearchIcon';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isProductInCart: (productId: string) => boolean;
  onToggleWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
  onVisualizeClick: (product: Product) => void;
  onProductClick: (product: Product) => void;
  selectedCategory: string;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onAddToCart, 
  isProductInCart,
  onToggleWishlist,
  isProductInWishlist,
  onVisualizeClick,
  onProductClick,
  selectedCategory,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-stone-500">
        <SearchIcon className="mx-auto h-12 w-12" />
        <h2 className="mt-4 text-xl font-semibold text-stone-800">No Products Found</h2>
        <p className="mt-2 text-sm">Your search did not match any products in the "{selectedCategory}" category. Please try a different term.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-stone-200">
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}.
          </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
            isInCart={isProductInCart(product.id)}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={isProductInWishlist(product.id)}
            onVisualizeClick={onVisualizeClick}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;