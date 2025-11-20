
export type ProductCategory = string;

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  category: ProductCategory;
  price: number;
  isNewArrival?: boolean;
  isInStock: boolean;
  reviews?: Review[];
  isVisible?: boolean;
}

export interface BlogPost {
  id:string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  readTime: string;
}