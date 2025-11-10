
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isProductInCart: (productId: string) => boolean;
  onVisualizeClick: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, isProductInCart, onVisualizeClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
          isInCart={isProductInCart(product.id)}
          onVisualizeClick={onVisualizeClick}
        />
      ))}
    </div>
  );
};

export default ProductList;
