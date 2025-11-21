
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import StarRating from './StarRating';
import { UserIcon } from './icons/UserIcon';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isProductInCart: (productId: string) => boolean;
  onToggleWishlist: (productId: string) => void;
  isProductInWishlist: boolean;
  onVisualizeClick: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => Promise<void>;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
    product, 
    onClose, 
    onAddToCart, 
    isProductInCart,
    onToggleWishlist, 
    isProductInWishlist, 
    onVisualizeClick,
    onAddReview
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleAddToCartClick = () => {
    if (isProductInCart(product.id) || isAdding || !product.isInStock) return;
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product);
      setIsAdding(false);
    }, 700);
  };
  
  const handlePrev = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reviewName.trim() || !reviewComment.trim()) return;
      
      setIsSubmittingReview(true);
      await onAddReview(product.id, {
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment
      });
      
      // Reset form
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      setIsSubmittingReview(false);
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;
  
  const reviewCount = product.reviews?.length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <style>{`
        @keyframes fade-in-image { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in-image { animation: fade-in-image 0.3s ease-in-out; }
      `}</style>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col md:flex-row relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 rounded-full text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors z-20"
          aria-label="Close product details"
        >
          <XIcon />
        </button>

        {/* Image Gallery - Mobile: Top, Desktop: Left */}
        <div className="w-full md:w-1/2 flex flex-col p-4 sm:p-6 bg-stone-50 h-1/3 md:h-auto">
          <div className="relative aspect-square w-full flex-grow flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
            <img 
              key={activeImageIndex}
              src={product.imageUrls[activeImageIndex]} 
              alt={`${product.name} - view ${activeImageIndex + 1}`} 
              className={`max-w-full max-h-full object-contain animate-fade-in-image ${!product.isInStock ? 'grayscale-[50%]' : ''}`}
            />
            {!product.isInStock && (
             <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="bg-stone-800/90 text-white px-6 py-3 rounded-md font-bold text-lg uppercase tracking-wider shadow-lg backdrop-blur-sm">
                    Out of Stock
                </span>
             </div>
            )}
            {product.imageUrls.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 text-stone-800 backdrop-blur-sm hover:bg-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-stone-500 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/60 text-stone-800 backdrop-blur-sm hover:bg-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-stone-500 z-10"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {product.imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                    activeImageIndex === index ? 'bg-stone-800' : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Reviews - Scrollable Area */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col overflow-y-auto bg-white">
          <div className="flex-shrink-0 mb-6">
            <div className="text-sm font-medium text-stone-500 mb-1 uppercase tracking-wide">{product.category}</div>
            <h2 className="text-3xl font-bold text-stone-900 leading-tight">{product.name}</h2>
            
            <div className="flex items-center gap-2 mt-2">
               <StarRating rating={averageRating} sizeClass="h-5 w-5" />
               <span className="text-stone-600 font-medium">
                 {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'}
               </span>
               <span className="text-stone-400 text-sm">
                 ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
               </span>
            </div>

            <p className="text-2xl font-bold text-stone-800 mt-4">Ksh {product.price.toFixed(2)}</p>
            <p className="text-stone-600 mt-4 text-base leading-relaxed border-b border-stone-100 pb-6">{product.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 space-y-3 mb-8">
            <div className="flex items-stretch gap-3">
               <button 
                onClick={handleAddToCartClick}
                disabled={isProductInCart(product.id) || isAdding || !product.isInStock}
                className={`w-full flex-grow py-3 px-4 rounded-md font-semibold text-base flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  !product.isInStock 
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : isProductInCart(product.id)
                    ? 'bg-emerald-500 text-white cursor-not-allowed'
                    : isAdding
                    ? 'bg-stone-500 text-white cursor-wait'
                    : 'bg-stone-800 text-white hover:bg-stone-700 focus:ring-stone-600'
                }`}
              >
                {isAdding ? <SpinnerIcon /> : isProductInCart(product.id) ? <CheckIcon /> : product.isInStock ? <PlusIcon /> : null}
                <span className="ml-2">
                    {isAdding ? 'Adding...' : isProductInCart(product.id) ? 'In Cart' : !product.isInStock ? 'Out of Stock' : 'Add to Cart'}
                </span>
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3 rounded-md transition-colors duration-200 border-2 ${
                  isProductInWishlist 
                    ? 'bg-red-50 text-red-500 border-red-200' 
                    : 'bg-stone-100 text-stone-700 hover:bg-red-50 hover:text-red-500 border-stone-200'
                }`}
                aria-label={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HeartIcon filled={isProductInWishlist} className="h-6 w-6"/>
              </button>
            </div>
             <button 
              onClick={() => onVisualizeClick(product)}
              className="w-full py-3 px-4 rounded-md font-semibold text-base flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
            >
              <SparklesIcon />
              <span className="ml-2">Visualize in your room</span>
            </button>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-stone-200 pt-8">
            <h3 className="text-xl font-bold text-stone-800 mb-4">Customer Reviews</h3>
            
            {/* Reviews List */}
            <div className="space-y-6 mb-8">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="bg-stone-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <div className="bg-stone-200 p-1 rounded-full">
                            <UserIcon className="h-4 w-4 text-stone-500"/>
                         </div>
                         <span className="font-semibold text-stone-900">{review.userName}</span>
                      </div>
                      <span className="text-xs text-stone-500">{review.date}</span>
                    </div>
                    <StarRating rating={review.rating} sizeClass="h-4 w-4" />
                    <p className="text-stone-700 mt-2 text-sm">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-stone-500 italic">No reviews yet. Be the first to review this product!</p>
              )}
            </div>

            {/* Write Review Form */}
            <div className="bg-stone-50 p-5 rounded-xl border border-stone-100">
               <h4 className="font-bold text-stone-800 mb-3">Write a Review</h4>
               <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Your Rating</label>
                    <StarRating 
                        rating={reviewRating} 
                        interactive={true} 
                        onRatingChange={setReviewRating} 
                        sizeClass="h-6 w-6"
                    />
                  </div>
                  <div>
                     <label htmlFor="reviewName" className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                     <input 
                       type="text" 
                       id="reviewName" 
                       value={reviewName}
                       onChange={(e) => setReviewName(e.target.value)}
                       className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                       placeholder="John Doe"
                       required
                     />
                  </div>
                  <div>
                     <label htmlFor="reviewComment" className="block text-sm font-medium text-stone-700 mb-1">Comment</label>
                     <textarea 
                       id="reviewComment"
                       rows={3}
                       value={reviewComment}
                       onChange={(e) => setReviewComment(e.target.value)}
                       className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                       placeholder="Share your thoughts..."
                       required
                     />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmittingReview}
                    className="bg-stone-800 text-white py-2 px-4 rounded-md font-medium hover:bg-stone-700 transition-colors disabled:bg-stone-400 disabled:cursor-wait"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;