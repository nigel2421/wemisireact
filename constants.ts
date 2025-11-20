
import { Product } from './types';

export const WHATSAPP_NUMBER = '254721202052'; // IMPORTANT: Replace with a real WhatsApp number (including country code without +)

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
    imageUrls: ['https://picsum.photos/seed/marble1/600/400'],
    category: 'Marble',
    price: 1170.00,
    isNewArrival: true,
    isInStock: true,
    reviews: [
      {
        id: 'r1',
        userName: 'Alice M.',
        rating: 5,
        comment: 'Absolutely stunning tiles! They transformed my bathroom completely.',
        date: '2023-10-05'
      },
      {
        id: 'r2',
        userName: 'John D.',
        rating: 4,
        comment: 'Great quality, but shipping took a bit longer than expected.',
        date: '2023-09-20'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Modern Slate Fence Panel',
    description: 'Sleek and durable slate panels for a contemporary garden or property boundary. Offers privacy and style.',
    imageUrls: ['https://picsum.photos/seed/fence1/600/400'],
    category: 'Fences',
    price: 20150.00,
    isNewArrival: true,
    isInStock: true,
    reviews: [
       {
        id: 'r3',
        userName: 'Sarah K.',
        rating: 5,
        comment: 'Very solid and looks expensive. My neighbors are jealous!',
        date: '2023-11-01'
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Terracotta Hexagon Tiles',
    description: 'Warm, rustic terracotta tiles in a modern hexagon shape. Ideal for kitchens and entryways.',
    imageUrls: ['https://picsum.photos/seed/tiles1/600/400'],
    category: 'Tiles',
    price: 845.00,
    isInStock: false,
    reviews: []
  },
  {
    id: 'prod-4',
    name: 'Emperador Dark Marble Slab',
    description: 'A rich, dark brown marble with intricate light veining. Makes a bold statement for countertops or feature walls.',
    imageUrls: ['https://picsum.photos/seed/marble2/600/400'],
    category: 'Marble',
    price: 12415.00,
    isInStock: true,
    reviews: []
  },
  {
    id: 'prod-5',
    name: 'Cobblestone Pavers',
    description: 'Authentic, old-world cobblestone for creating charming driveways, walkways, and patios.',
    imageUrls: ['https://picsum.photos/seed/stone1/600/400'],
    category: 'Stone',
    price: 620.00,
    isInStock: true,
    reviews: [
      {
        id: 'r4',
        userName: 'Mike R.',
        rating: 5,
        comment: 'Perfect for my garden path.',
        date: '2023-08-15'
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Subway Ceramic Tiles',
    description: 'Versatile and clean ceramic subway tiles. A classic choice for backsplashes in kitchens and bathrooms.',
    imageUrls: ['https://picsum.photos/seed/tiles2/600/400'],
    category: 'Tiles',
    price: 390.00,
    isInStock: true,
    reviews: []
  },
   {
    id: 'prod-7',
    name: 'Wrought Iron Fence Section',
    description: 'Elegant and secure wrought iron fencing with ornate details. Perfect for classic and formal landscapes.',
    imageUrls: ['https://picsum.photos/seed/fence2/600/400'],
    category: 'Fences',
    price: 35750.00,
    isNewArrival: true,
    isInStock: true,
    reviews: []
  },
  {
    id: 'prod-8',
    name: 'Travertine Stone Flooring',
    description: 'Natural travertine stone with a unique textured finish. Brings a touch of earthy elegance to any space.',
    imageUrls: ['https://picsum.photos/seed/stone2/600/400'],
    category: 'Stone',
    price: 945.00,
    isInStock: true,
    reviews: []
  },
];