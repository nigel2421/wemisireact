
export type ProductCategory = 'Tiles' | 'Marble' | 'Fences' | 'Stone';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: ProductCategory;
  price: number;
}