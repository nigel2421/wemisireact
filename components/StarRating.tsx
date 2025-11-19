
import React from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxRating?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  sizeClass?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  interactive = false, 
  onRatingChange,
  sizeClass = "h-5 w-5" 
}) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= Math.round(rating);
    
    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => interactive && onRatingChange && onRatingChange(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
        disabled={!interactive}
        aria-label={`Rate ${i} out of ${maxRating}`}
      >
        <StarIcon 
          className={`${sizeClass} ${isFilled ? 'text-yellow-400' : 'text-stone-300'}`} 
          filled={isFilled} 
        />
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-0.5">
      {stars}
    </div>
  );
};

export default StarRating;
