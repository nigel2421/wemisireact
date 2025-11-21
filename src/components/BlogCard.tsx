
import React from 'react';
import { BlogPost } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserIcon } from './icons/UserIcon';

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <article 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col h-full group cursor-pointer"
      onClick={() => onClick(post)}
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm uppercase tracking-wide">
          {post.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-stone-600 transition-colors line-clamp-2">
          {post.title}
        </h2>
        
        <p className="text-stone-600 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
          {post.excerpt}
        </p>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <UserIcon />
            <span>{post.author}</span>
          </div>
          <span className="text-sm font-semibold text-stone-800 group-hover:translate-x-1 transition-transform flex items-center">
            Read Article &rarr;
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
