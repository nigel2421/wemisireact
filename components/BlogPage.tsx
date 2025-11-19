
import React, { useState } from 'react';
import { BlogPost, Product } from '../types';
import BlogCard from './BlogCard';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserIcon } from './icons/UserIcon';
import { ClockIcon } from './icons/ClockIcon';

// Updated Mock Data with detailed content and product links
const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-3',
    title: "Natural Stone vs. Ceramic Tiles: Which is Right for You?",
    excerpt: "Debating between the raw beauty of stone and the durability of ceramic? We break down the pros and cons of each to help you decide.",
    content: `
      <p class="lead">Choosing between natural stone and ceramic (or porcelain) tiles is one of the biggest decisions you'll make for your renovation. Both have distinct advantages, but the right choice depends heavily on your lifestyle, budget, and the specific room you are designing.</p>
      
      <h3>The Case for Natural Stone</h3>
      <p>Nothing beats the authenticity of real stone. It offers a unique, luxurious look that man-made materials strive to replicate but never quite match perfectly. Each piece is a slice of the earth, meaning no two tiles are exactly alike.</p>
      
      <p>For example, the <a href="#" data-product-id="prod-1" class="text-emerald-600 hover:underline font-semibold" title="View Product">Carrara Marble Tile</a> is a prime example of timeless elegance. Its soft white background and grey veining have been a symbol of luxury since Ancient Rome. It adds significant resale value to a home and ages gracefully if maintained well.</p>
      
      <p>If you are looking for something with more warmth and texture, <a href="#" data-product-id="prod-8" class="text-emerald-600 hover:underline font-semibold" title="View Product">Travertine Stone Flooring</a> offers an earthy, rustic appeal that feels incredible underfoot. However, keep in mind that natural stone is porous. It requires sealing upon installation and regular maintenance to prevent staining.</p>
      
      <p>For a bold, dramatic statement—perhaps for a feature wall or a powder room vanity—the <a href="#" data-product-id="prod-4" class="text-emerald-600 hover:underline font-semibold" title="View Product">Emperador Dark Marble Slab</a> provides a rich, dark brown aesthetic with intricate light veining that demands attention.</p>

      <h3>The Practicality of Ceramic & Porcelain</h3>
      <p>Man-made tiles are engineered for durability and ease of maintenance. Modern printing technology allows them to mimic wood, cement, and even stone with surprising accuracy.</p>
      
      <p>For high-traffic utility areas like mudrooms, kitchens, or family bathrooms, <a href="#" data-product-id="prod-6" class="text-emerald-600 hover:underline font-semibold" title="View Product">Subway Ceramic Tiles</a> are a classic, bulletproof choice. They are non-porous, meaning they won't absorb water or stains, and they are incredibly easy to clean. They are also generally more affordable than natural stone.</p>

      <h3>The Verdict</h3>
      <ul>
        <li><strong>Choose Natural Stone if:</strong> You prioritize unique aesthetics, luxury, and resale value, and you don't mind a bit of maintenance.</li>
        <li><strong>Choose Ceramic/Porcelain if:</strong> You need a waterproof, low-maintenance solution for a busy household or wet area.</li>
      </ul>
    `,
    author: "David Chen",
    date: "Sep 15, 2023",
    imageUrl: "https://picsum.photos/seed/stonetile/800/600",
    category: "Materials",
    readTime: "8 min read"
  },
  {
    id: 'blog-1',
    title: "Mastering the Art of Grouting: A Step-by-Step Guide",
    excerpt: "Grouting is often the most intimidating part of a tiling project, but it doesn't have to be. Learn the secrets to a perfect finish.",
    content: `
      <p>Grouting defines the final look of your tiled surface. It fills the joints between tiles, locking them in place and preventing moisture from getting behind them. However, improper grouting can ruin an otherwise perfect installation, leading to cracking, discoloration, or water damage.</p>
      
      <h3>Step 1: Choosing the Right Grout</h3>
      <p>Before you start, ensure you have the correct type of grout. 
      <br><strong>Sanded grout</strong> is best for joints wider than 1/8 inch. The sand provides structural strength and prevents shrinking as it cures. It is perfect for rustic styles like our <a href="#" data-product-id="prod-3" class="text-emerald-600 hover:underline font-semibold" title="View Product">Terracotta Hexagon Tiles</a>, where wider joints emphasize the shape.</p>
      <p><strong>Unsanded grout</strong> is ideal for narrow joints (often found with rectified tiles) and delicate surfaces like marble that might scratch from the sand particles.</p>
      
      <h3>Step 2: Mixing Consistency</h3>
      <p>The most common mistake is adding too much water. Your grout should have the consistency of smooth peanut butter. If it's too runny, the color will be weak (efflorescence), and it may crack as it dries. Mix small batches to ensure you can apply it all before it begins to set in the bucket.</p>
      
      <h3>Step 3: Application Technique</h3>
      <ul>
        <li><strong>Load the Float:</strong> Use a rubber grout float to scoop up a generous amount of grout.</li>
        <li><strong>Press it In:</strong> Hold your float at a 45-degree angle to the floor. Press the grout firmly into the joints to fill them completely and eliminate air bubbles. Don't just skim the surface.</li>
        <li><strong>Clean Off Excess:</strong> Once the joints are full, hold the float at a 90-degree angle and scrape off the excess grout from the face of the tiles, moving diagonally across the grout lines to avoid digging them out.</li>
      </ul>
      
      <h3>Step 4: The Sponge Wipe</h3>
      <p>Wait about 15-20 minutes for the grout to firm up slightly. Use a damp (not soaking wet!) sponge to gently wipe the tiles in a circular motion. Rinse the sponge frequently. This shapes the grout joints and removes the haze from the tile surface.</p>
      
      <p>With patience and the right technique, your DIY grouting job can look just as good as a professional's.</p>
    `,
    author: "Alex Johnson",
    date: "Oct 12, 2023",
    imageUrl: "https://picsum.photos/seed/grout/800/600",
    category: "DIY Guides",
    readTime: "6 min read"
  },
  {
    id: 'blog-2',
    title: "5 Common Mistakes When Installing Fence Panels",
    excerpt: "Installing a fence seems straightforward, but small errors can lead to leaning posts and short lifespans. Here is what to avoid.",
    content: `
      <p>A good fence provides privacy, security, and aesthetic appeal. However, a poorly installed one can become a headache within months. Here are the top mistakes homeowners make when installing fences themselves, and how to fix them.</p>
      
      <h3>1. Not Checking Underground Utilities</h3>
      <p>Before you dig a single post hole, call your local utility companies. Hitting a gas line or water pipe is dangerous and expensive. It’s the most critical "measure twice, cut once" rule of fencing.</p>
      
      <h3>2. Shallow Post Holes</h3>
      <p>A general rule of thumb is that at least 1/3 of the post's total length should be underground. Heavy, premium materials like the <a href="#" data-product-id="prod-2" class="text-emerald-600 hover:underline font-semibold" title="View Product">Modern Slate Fence Panel</a> require deep, stable footings to handle wind load and the weight of the stone.</p>
      
      <h3>3. Ignoring Property Lines</h3>
      <p>Installing a fence even a few inches onto your neighbor's property can lead to legal disputes and the eventual need to tear down your hard work. Always get a property survey done first.</p>
      
      <h3>4. Incorrect Post Spacing</h3>
      <p>Don't assume all panels are exactly 6 or 8 feet. Measure your panels first, then set your posts using a spacer bar. Precision is vital, especially with rigid, high-end systems like the <a href="#" data-product-id="prod-7" class="text-emerald-600 hover:underline font-semibold" title="View Product">Wrought Iron Fence Section</a>, which has very little tolerance for error compared to wood fencing.</p>
      
      <h3>5. Skipping the Gravel</h3>
      <p>Concrete creates a solid base, but it traps water. Putting a few inches of gravel at the bottom of your post hole allows water to drain away from the base of the post, preventing rot (for wood) or rust (for metal).</p>
    `,
    author: "Sarah Miller",
    date: "Sep 28, 2023",
    imageUrl: "https://picsum.photos/seed/fencepost/800/600",
    category: "Construction",
    readTime: "5 min read"
  },
  {
    id: 'blog-4',
    title: "The Ultimate Maintenance Routine for Marble Surfaces",
    excerpt: "Marble is timeless but delicate. Follow this routine to keep your countertops and floors looking pristine for decades.",
    content: `
      <p>Marble is a metamorphic rock composed of recrystallized carbonate minerals. In plain English? It's beautiful, but it's softer and more porous than granite or quartz. Whether you have <a href="#" data-product-id="prod-1" class="text-emerald-600 hover:underline font-semibold" title="View Product">Carrara Marble Tiles</a> in your bathroom or an <a href="#" data-product-id="prod-4" class="text-emerald-600 hover:underline font-semibold" title="View Product">Emperador Dark Marble Slab</a> on your kitchen island, the care routine is similar.</p>
      
      <h3>Daily Cleaning</h3>
      <p>The golden rule of marble: <strong>No Acid.</strong></p>
      <p>Avoid vinegar, lemon juice, or standard bathroom cleaners. The acid reacts with the calcium carbonate in the marble, causing dull white spots known as "etching." Instead, use a pH-neutral cleaner specifically designed for natural stone, or simply warm water with a mild dish soap.</p>
      
      <h3>Dealing with Spills</h3>
      <p>Blot spills immediately—do not wipe. Wiping spreads the liquid. Blotting absorbs it. Wine, coffee, and citrus juices are the enemies of marble. If a stain does happen, a poultice (a paste made of baking soda and water) can often draw it out if left overnight.</p>
      
      <h3>Sealing is Non-Negotiable</h3>
      <p>You should seal your marble surfaces upon installation and then re-seal them every 6 to 12 months depending on usage. A sealer doesn't make the stone stain-proof, but it buys you time to clean up spills before they penetrate the surface.</p>
    `,
    author: "Alex Johnson",
    date: "Aug 30, 2023",
    imageUrl: "https://picsum.photos/seed/marblecare/800/600",
    category: "Maintenance",
    readTime: "4 min read"
  },
  {
    id: 'blog-5',
    title: "Creating a Zen Garden with Cobblestone Pavers",
    excerpt: "Transform your backyard into a peaceful retreat using the rustic charm of cobblestone and thoughtful landscaping.",
    content: `
      <p>In a busy world, a Zen garden offers a sanctuary of calm. While traditional Japanese rock gardens use gravel and sand, you can create a functional, durable version for your home using <a href="#" data-product-id="prod-5" class="text-emerald-600 hover:underline font-semibold" title="View Product">Cobblestone Pavers</a>.</p>
      <p>Cobblestones add texture and old-world charm that feels organic rather than manufactured. Arrange them in curving paths to encourage a slower walking pace—straight lines rush the eye, while curves invite you to linger.</p>
      <p>Combine the grey stone with lush green moss, ferns, and a simple water feature. The contrast between the hard, permanent stone and the soft, changing foliage is the essence of Zen design.</p>
    `,
    author: "Sarah Miller",
    date: "Aug 12, 2023",
    imageUrl: "https://picsum.photos/seed/zen/800/600",
    category: "Landscaping",
    readTime: "4 min read"
  },
  {
    id: 'blog-6',
    title: "How to Waterproof Your Bathroom Walls Before Tiling",
    excerpt: "Tiles are water-resistant, but grout is not. Learn why waterproofing is the most critical step in bathroom renovation.",
    content: "<p>Water seeping behind tiles causes mold and rot. Use a liquid waterproofing membrane or a waterproof backer board system (like Kerdi or Wedi) to create a tank-like seal before laying a single tile.</p>",
    author: "David Chen",
    date: "Jul 25, 2023",
    imageUrl: "https://picsum.photos/seed/waterproof/800/600",
    category: "Construction",
    readTime: "7 min read"
  },
  {
    id: 'blog-7',
    title: "Choosing the Best Grout Color for Your Tiles",
    excerpt: "Contrast or blend? The color of your grout can completely change the aesthetic of your tiled room.",
    content: "<p>Matching grout color creates a seamless, modern look that makes a room feel larger. Contrasting grout (e.g., black grout on white subway tile) highlights the pattern and shape of the tile.</p>",
    author: "Emily Davis",
    date: "Jul 10, 2023",
    imageUrl: "https://picsum.photos/seed/groutcolor/800/600",
    category: "Design",
    readTime: "3 min read"
  },
  {
    id: 'blog-8',
    title: "Reviving Dull Stone: Polishing Techniques",
    excerpt: "Has your natural stone lost its shine? Discover how to safely polish and restore its original luster.",
    content: "<p>Over time, foot traffic wears down the polish on stone floors. For minor dullness, a polishing powder and a buffing pad can work wonders. For deep scratches, professional honing might be required.</p>",
    author: "Alex Johnson",
    date: "Jun 22, 2023",
    imageUrl: "https://picsum.photos/seed/polish/800/600",
    category: "Maintenance",
    readTime: "5 min read"
  },
  {
    id: 'blog-9',
    title: "Understanding Tile Ratings: PEI and Slip Resistance",
    excerpt: "Don't buy the wrong tile. Understand what PEI ratings mean for durability and why slip resistance matters.",
    content: "<p>PEI ratings range from 1 (wall only) to 5 (heavy commercial). For a residential floor, look for PEI 3 or 4. In wet areas like showers, prioritize a high COF (Coefficient of Friction) to prevent slipping.</p>",
    author: "David Chen",
    date: "Jun 05, 2023",
    imageUrl: "https://picsum.photos/seed/tilerating/800/600",
    category: "Materials",
    readTime: "6 min read"
  },
  {
    id: 'blog-10',
    title: "Outdoor Paving Trends for 2024",
    excerpt: "From large format porcelain to eco-friendly permeable pavers, see what's trending in outdoor design.",
    content: "<p>Large format pavers (24x24 inches or larger) are dominating to create a clean, modern look with fewer grout lines. Permeable pavers are also gaining popularity for their eco-friendly drainage properties.</p>",
    author: "Sarah Miller",
    date: "May 18, 2023",
    imageUrl: "https://picsum.photos/seed/paving/800/600",
    category: "Trends",
    readTime: "4 min read"
  },
  {
    id: 'blog-11',
    title: "Wrought Iron Fences: Installation and Care",
    excerpt: "Wrought iron is elegant but heavy. Learn how to install it securely and keep rust at bay.",
    content: "<p>Wrought iron needs substantial concrete footing to support its weight. To prevent rust, inspect paint annually and touch up chips immediately with rust-inhibiting paint.</p>",
    author: "Alex Johnson",
    date: "May 01, 2023",
    imageUrl: "https://picsum.photos/seed/ironfence/800/600",
    category: "Construction",
    readTime: "5 min read"
  },
  {
    id: 'blog-12',
    title: "DIY Backsplash: A Weekend Project",
    excerpt: "A kitchen backsplash is the perfect entry-level tiling project. Here is your shopping list and guide.",
    content: "<p>You'll need: tiles, adhesive (mastic is fine for dry areas), spacers, a trowel, a tile cutter, grout, and a sponge. Start from the center of the wall and work outwards for symmetry.</p>",
    author: "Emily Davis",
    date: "Apr 15, 2023",
    imageUrl: "https://picsum.photos/seed/backsplash/800/600",
    category: "DIY Guides",
    readTime: "8 min read"
  }
];

const ITEMS_PER_PAGE = 10;

interface BlogPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ products, onProductClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const totalPages = Math.ceil(BLOG_POSTS.length / ITEMS_PER_PAGE);
  
  // Logic for displaying current posts
  const indexOfLastPost = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;
  const currentPosts = BLOG_POSTS.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Handle clicks on product links embedded in the HTML content
    const target = e.target as HTMLElement;
    // Traverse up to find anchor tag if we clicked a child of it
    const anchor = target.closest('a');
    
    if (anchor && anchor.dataset.productId) {
      e.preventDefault();
      const productId = anchor.dataset.productId;
      const product = products.find(p => p.id === productId);
      if (product) {
        onProductClick(product);
      }
    }
  };

  // --- Detail View ---
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
        <style>{`@keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } } .animate-fade-in { animation: fade-in 0.4s ease-out; }`}</style>
        
        <div className="relative h-64 sm:h-96 w-full">
           <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 sm:p-10">
             <div>
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 inline-block">
                  {selectedPost.category}
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight text-shadow-sm">
                  {selectedPost.title}
                </h1>
             </div>
           </div>
        </div>

        <div className="p-6 sm:p-10">
           <div className="flex flex-wrap items-center gap-6 text-sm text-stone-500 mb-8 border-b border-stone-100 pb-6">
              <div className="flex items-center gap-2">
                 <UserIcon className="h-5 w-5 text-stone-400"/>
                 <span className="font-medium text-stone-700">{selectedPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                 <CalendarIcon className="h-5 w-5 text-stone-400"/>
                 <time dateTime={selectedPost.date}>{selectedPost.date}</time>
              </div>
              <div className="flex items-center gap-2">
                 <ClockIcon className="h-5 w-5 text-stone-400"/>
                 <span>{selectedPost.readTime}</span>
              </div>
           </div>

           <div 
             className="prose prose-stone prose-lg max-w-none text-stone-800 blog-content"
             dangerouslySetInnerHTML={{ __html: selectedPost.content }}
             onClick={handleContentClick}
           />

           <div className="mt-12 pt-8 border-t border-stone-200 flex justify-between items-center">
              <button 
                onClick={handleBackToBlog}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-stone-100 text-stone-700 font-semibold hover:bg-stone-200 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" /> Back to Blog
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">WEMISI Blog</h1>
        <p className="mt-4 text-lg text-stone-600">
          Expert advice on construction, DIY home improvement, and material selection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map(post => (
          <BlogCard key={post.id} post={post} onClick={handleCardClick} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-8 border-t border-stone-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-stone-800 text-white shadow-md'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
             <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
