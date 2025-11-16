
export type ProductCategory = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  category: ProductCategory;
  price: number;
}