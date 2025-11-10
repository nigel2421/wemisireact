import { Product } from './types';

export const WHATSAPP_NUMBER = '15551234567'; // IMPORTANT: Replace with a real WhatsApp number (including country code without +)

// Updated to support multiple admin users
export const ADMIN_CREDENTIALS = [
  { username: 'superadmin', password: 'supersecretpassword!@#' },
  { username: 'admin', password: 'babatibim1' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Carrara Marble Tile',
    description: 'Classic Italian polished marble, perfect for elegant floors and walls. A timeless choice for luxury interiors.',
    imageUrl: 'https://picsum.photos/seed/marble1/600/400',
    category: 'Marble',
  },
  {
    id: 'prod-2',
    name: 'Modern Slate Fence Panel',
    description: 'Sleek and durable slate panels for a contemporary garden or property boundary. Offers privacy and style.',
    imageUrl: 'https://picsum.photos/seed/fence1/600/400',
    category: 'Fences',
  },
  {
    id: 'prod-3',
    name: 'Terracotta Hexagon Tiles',
    description: 'Warm, rustic terracotta tiles in a modern hexagon shape. Ideal for kitchens and entryways.',
    imageUrl: 'https://picsum.photos/seed/tiles1/600/400',
    category: 'Tiles',
  },
  {
    id: 'prod-4',
    name: 'Emperador Dark Marble Slab',
    description: 'A rich, dark brown marble with intricate light veining. Makes a bold statement for countertops or feature walls.',
    imageUrl: 'https://picsum.photos/seed/marble2/600/400',
    category: 'Marble',
  },
  {
    id: 'prod-5',
    name: 'Cobblestone Pavers',
    description: 'Authentic, old-world cobblestone for creating charming driveways, walkways, and patios.',
    imageUrl: 'https://picsum.photos/seed/stone1/600/400',
    category: 'Stone',
  },
  {
    id: 'prod-6',
    name: 'Subway Ceramic Tiles',
    description: 'Versatile and clean ceramic subway tiles. A classic choice for backsplashes in kitchens and bathrooms.',
    imageUrl: 'https://picsum.photos/seed/tiles2/600/400',
    category: 'Tiles',
  },
   {
    id: 'prod-7',
    name: 'Wrought Iron Fence Section',
    description: 'Elegant and secure wrought iron fencing with ornate details. Perfect for classic and formal landscapes.',
    imageUrl: 'https://picsum.photos/seed/fence2/600/400',
    category: 'Fences',
  },
  {
    id: 'prod-8',
    name: 'Travertine Stone Flooring',
    description: 'Natural travertine stone with a unique textured finish. Brings a touch of earthy elegance to any space.',
    imageUrl: 'https://picsum.photos/seed/stone2/600/400',
    category: 'Stone',
  },
];