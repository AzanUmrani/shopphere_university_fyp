import { sequelize } from './src/config/database';
import { User } from './src/models/User';
import { CreatorProfile } from './src/models/CreatorProfile';
import { Category } from './src/models/Category';
import { Product } from './src/models/Product';
import { ProductImage } from './src/models/ProductImage';
import bcrypt from 'bcrypt';

// Sample categories data
const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home decor and gardening essentials',
    sortOrder: 3,
    isActive: true
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Sports equipment and fitness gear',
    sortOrder: 4,
    isActive: true
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, and digital content',
    sortOrder: 5,
    isActive: true
  },
  {
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Health and beauty products',
    sortOrder: 6,
    isActive: true
  },
  {
    name: 'Arts & Crafts',
    slug: 'arts-crafts',
    description: 'Creative supplies and handmade items',
    sortOrder: 7,
    isActive: true
  }
];

// Sample creator users data
const creatorUsers = [
  {
    email: 'creator1@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'creator' as const,
    isActive: true,
    isEmailVerified: true,
    businessName: 'TechCraft Solutions',
    businessDescription: 'Innovative electronics and tech accessories',
    businessType: 'small_business'
  },
  {
    email: 'creator2@example.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'creator' as const,
    isActive: true,
    isEmailVerified: true,
    businessName: 'Urban Fashion Hub',
    businessDescription: 'Contemporary fashion for modern lifestyle',
    businessType: 'small_business'
  },
  {
    email: 'creator3@example.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'creator' as const,
    isActive: true,
    isEmailVerified: true,
    businessName: 'Home Harmony',
    businessDescription: 'Beautiful home decor and furniture',
    businessType: 'individual'
  },
  {
    email: 'creator4@example.com',
    password: 'password123',
    firstName: 'David',
    lastName: 'Thompson',
    role: 'creator' as const,
    isActive: true,
    isEmailVerified: true,
    businessName: 'FitLife Gear',
    businessDescription: 'Premium fitness equipment and sportswear',
    businessType: 'corporation'
  },
  {
    email: 'creator5@example.com',
    password: 'password123',
    firstName: 'Lisa',
    lastName: 'Williams',
    role: 'creator' as const,
    isActive: true,
    isEmailVerified: true,
    businessName: 'Wellness & Glow',
    businessDescription: 'Natural health and beauty products',
    businessType: 'small_business'
  }
];

// Sample products data
const generateProducts = (categoryIds: string[], creatorIds: string[]) => [
  // Electronics Products
  {
    name: 'Wireless Bluetooth Headphones Pro',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life and crystal-clear audio quality.',
    price: 199.99,
    originalPrice: 249.99,
    sku: 'WBHP-001',
    categoryId: categoryIds[0], // Electronics
    creatorId: creatorIds[0],
    brand: 'TechCraft',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 50,
    tags: ['wireless', 'bluetooth', 'headphones', 'noise-canceling'],
    features: ['30-hour battery', 'Active noise canceling', 'Quick charge', 'Wireless charging case'],
    discount: 20,
    isNew: true,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 0.25,
    viewCount: 2341,
    salesCount: 89
  },
  {
    name: 'Smart Fitness Watch Ultra',
    description: 'Advanced fitness tracking watch with GPS, heart rate monitor, and 7-day battery life.',
    price: 299.99,
    originalPrice: 399.99,
    sku: 'SFW-002',
    categoryId: categoryIds[0], // Electronics
    creatorId: creatorIds[0],
    brand: 'TechCraft',
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 35,
    tags: ['smartwatch', 'fitness', 'gps', 'heart-rate'],
    features: ['GPS tracking', 'Heart rate monitor', '7-day battery', 'Water resistant', '50+ workout modes'],
    discount: 25,
    isNew: false,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 0.05,
    viewCount: 1876,
    salesCount: 67
  },
  {
    name: 'USB-C Hub 8-in-1',
    description: 'Versatile USB-C hub with HDMI, USB 3.0, SD card slots, and fast charging capabilities.',
    price: 49.99,
    originalPrice: 69.99,
    sku: 'UCH-003',
    categoryId: categoryIds[0], // Electronics
    creatorId: creatorIds[0],
    brand: 'TechCraft',
    rating: 4.5,
    reviewCount: 98,
    inStock: true,
    stockQuantity: 120,
    tags: ['usb-c', 'hub', 'hdmi', 'adapter'],
    features: ['8 ports', 'HDMI 4K output', 'Fast charging', 'Compact design'],
    discount: 28,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.1,
    viewCount: 567,
    salesCount: 145
  },

  // Fashion Products
  {
    name: 'Premium Cotton T-Shirt Collection',
    description: 'Soft, breathable cotton t-shirts in various colors. Perfect for casual wear and everyday comfort.',
    price: 29.99,
    originalPrice: 39.99,
    sku: 'PCT-004',
    categoryId: categoryIds[1], // Fashion
    creatorId: creatorIds[1],
    brand: 'Urban Fashion Hub',
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    stockQuantity: 200,
    tags: ['cotton', 't-shirt', 'casual', 'comfortable'],
    features: ['100% cotton', 'Pre-shrunk', 'Multiple colors', 'Unisex fit'],
    discount: 25,
    isNew: false,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 0.2,
    viewCount: 1456,
    salesCount: 234
  },
  {
    name: 'Designer Leather Jacket',
    description: 'Genuine leather jacket with modern styling and premium craftsmanship.',
    price: 249.99,
    originalPrice: 349.99,
    sku: 'DLJ-005',
    categoryId: categoryIds[1], // Fashion
    creatorId: creatorIds[1],
    brand: 'Urban Fashion Hub',
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 25,
    tags: ['leather', 'jacket', 'designer', 'premium'],
    features: ['Genuine leather', 'Modern cut', 'Multiple pockets', 'Premium lining'],
    discount: 28,
    isNew: true,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 1.2,
    viewCount: 923,
    salesCount: 34
  },
  {
    name: 'Classic Denim Jeans',
    description: 'High-quality denim jeans with perfect fit and lasting comfort.',
    price: 79.99,
    originalPrice: 99.99,
    sku: 'CDJ-006',
    categoryId: categoryIds[1], // Fashion
    creatorId: creatorIds[1],
    brand: 'Urban Fashion Hub',
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
    stockQuantity: 85,
    tags: ['denim', 'jeans', 'classic', 'comfortable'],
    features: ['Premium denim', 'Classic fit', 'Reinforced stitching', 'Multiple sizes'],
    discount: 20,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.6,
    viewCount: 1234,
    salesCount: 156
  },

  // Home & Garden Products
  {
    name: 'Scandinavian Table Lamp',
    description: 'Modern minimalist table lamp with warm LED lighting and wooden base.',
    price: 89.99,
    originalPrice: 119.99,
    sku: 'STL-007',
    categoryId: categoryIds[2], // Home & Garden
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.8,
    reviewCount: 125,
    inStock: true,
    stockQuantity: 45,
    tags: ['lamp', 'scandinavian', 'led', 'wooden'],
    features: ['LED bulb included', 'Wooden base', 'Adjustable brightness', 'Energy efficient'],
    discount: 25,
    isNew: true,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 1.5,
    viewCount: 678,
    salesCount: 67
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Beautiful set of 3 ceramic plant pots with drainage holes and saucers.',
    price: 34.99,
    originalPrice: 49.99,
    sku: 'CPS-008',
    categoryId: categoryIds[2], // Home & Garden
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    stockQuantity: 78,
    tags: ['ceramic', 'plant-pot', 'set', 'drainage'],
    features: ['Set of 3 pots', 'Drainage holes', 'Matching saucers', 'Various sizes'],
    discount: 30,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 2.3,
    viewCount: 456,
    salesCount: 123
  },
  {
    name: 'Memory Foam Throw Pillow',
    description: 'Luxurious memory foam throw pillow with removable, washable cover.',
    price: 24.99,
    originalPrice: 34.99,
    sku: 'MFP-009',
    categoryId: categoryIds[2], // Home & Garden
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.6,
    reviewCount: 167,
    inStock: true,
    stockQuantity: 150,
    tags: ['memory-foam', 'pillow', 'throw', 'washable'],
    features: ['Memory foam filling', 'Removable cover', 'Machine washable', 'Hypoallergenic'],
    discount: 28,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.8,
    viewCount: 789,
    salesCount: 198
  },

  // Sports & Fitness Products
  {
    name: 'Professional Yoga Mat Pro',
    description: 'Premium non-slip yoga mat with superior grip and cushioning for all yoga practices.',
    price: 59.99,
    originalPrice: 79.99,
    sku: 'YMP-010',
    categoryId: categoryIds[3], // Sports & Fitness
    creatorId: creatorIds[3],
    brand: 'FitLife Gear',
    rating: 4.9,
    reviewCount: 289,
    inStock: true,
    stockQuantity: 95,
    tags: ['yoga', 'mat', 'non-slip', 'premium'],
    features: ['6mm thickness', 'Non-slip surface', 'Eco-friendly material', 'Carrying strap included'],
    discount: 25,
    isNew: false,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 1.1,
    viewCount: 1567,
    salesCount: 245
  },
  {
    name: 'Adjustable Resistance Bands Set',
    description: 'Complete resistance band set with 5 resistance levels and door anchor.',
    price: 39.99,
    originalPrice: 59.99,
    sku: 'RBS-011',
    categoryId: categoryIds[3], // Sports & Fitness
    creatorId: creatorIds[3],
    brand: 'FitLife Gear',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 120,
    tags: ['resistance-bands', 'adjustable', 'fitness', 'portable'],
    features: ['5 resistance levels', 'Door anchor included', 'Comfort grip handles', 'Exercise guide'],
    discount: 33,
    isNew: true,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.6,
    viewCount: 892,
    salesCount: 178
  },
  {
    name: 'Smart Water Bottle with Tracker',
    description: 'Intelligent water bottle that tracks your hydration and reminds you to drink.',
    price: 49.99,
    originalPrice: 69.99,
    sku: 'SWB-012',
    categoryId: categoryIds[3], // Sports & Fitness
    creatorId: creatorIds[3],
    brand: 'FitLife Gear',
    rating: 4.5,
    reviewCount: 134,
    inStock: true,
    stockQuantity: 67,
    tags: ['smart', 'water-bottle', 'tracker', 'hydration'],
    features: ['Hydration tracking', 'App connectivity', 'LED reminders', 'BPA-free'],
    discount: 28,
    isNew: true,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.4,
    viewCount: 543,
    salesCount: 89
  },

  // Books & Media Products
  {
    name: 'Digital Photography Masterclass',
    description: 'Comprehensive online course covering advanced digital photography techniques.',
    price: 99.99,
    originalPrice: 149.99,
    sku: 'DPM-013',
    categoryId: categoryIds[4], // Books & Media
    creatorId: creatorIds[0],
    brand: 'TechCraft',
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    stockQuantity: 999,
    tags: ['digital', 'photography', 'course', 'online'],
    features: ['10+ hours content', 'Downloadable resources', 'Certificate included', 'Lifetime access'],
    discount: 33,
    isNew: true,
    isFeatured: true,
    isActive: true,
    isDigital: true,
    digitalFileSize: 2048,
    downloadUrl: '/downloads/photography-course.zip',
    viewCount: 432,
    salesCount: 56
  },
  {
    name: 'The Art of Minimalist Living - eBook',
    description: 'Inspiring guide to simplifying your life and embracing minimalism.',
    price: 14.99,
    originalPrice: 24.99,
    sku: 'AML-014',
    categoryId: categoryIds[4], // Books & Media
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.6,
    reviewCount: 198,
    inStock: true,
    stockQuantity: 999,
    tags: ['ebook', 'minimalism', 'lifestyle', 'guide'],
    features: ['PDF format', 'Instant download', '200+ pages', 'Practical exercises'],
    discount: 40,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: true,
    digitalFileSize: 15,
    downloadUrl: '/downloads/minimalist-living.pdf',
    viewCount: 876,
    salesCount: 234
  },

  // Health & Beauty Products
  {
    name: 'Organic Face Serum with Vitamin C',
    description: 'Powerful anti-aging serum with natural vitamin C and hyaluronic acid.',
    price: 34.99,
    originalPrice: 49.99,
    sku: 'OFS-015',
    categoryId: categoryIds[5], // Health & Beauty
    creatorId: creatorIds[4],
    brand: 'Wellness & Glow',
    rating: 4.9,
    reviewCount: 267,
    inStock: true,
    stockQuantity: 89,
    tags: ['organic', 'face-serum', 'vitamin-c', 'anti-aging'],
    features: ['Natural ingredients', 'Vitamin C & Hyaluronic acid', 'Cruelty-free', '30ml bottle'],
    discount: 30,
    isNew: false,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 0.1,
    viewCount: 1234,
    salesCount: 178
  },
  {
    name: 'Bamboo Toothbrush Set',
    description: 'Eco-friendly bamboo toothbrushes with soft bristles. Set of 4.',
    price: 16.99,
    originalPrice: 24.99,
    sku: 'BTS-016',
    categoryId: categoryIds[5], // Health & Beauty
    creatorId: creatorIds[4],
    brand: 'Wellness & Glow',
    rating: 4.7,
    reviewCount: 145,
    inStock: true,
    stockQuantity: 200,
    tags: ['bamboo', 'toothbrush', 'eco-friendly', 'set'],
    features: ['Set of 4', 'Biodegradable handle', 'Soft bristles', 'Plastic-free packaging'],
    discount: 32,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.05,
    viewCount: 543,
    salesCount: 267
  },
  {
    name: 'Essential Oil Diffuser Kit',
    description: 'Ultrasonic essential oil diffuser with 6 premium essential oils included.',
    price: 79.99,
    originalPrice: 119.99,
    sku: 'EOD-017',
    categoryId: categoryIds[5], // Health & Beauty
    creatorId: creatorIds[4],
    brand: 'Wellness & Glow',
    rating: 4.8,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 56,
    tags: ['essential-oil', 'diffuser', 'aromatherapy', 'kit'],
    features: ['Ultrasonic technology', '6 essential oils included', 'Timer settings', 'LED lights'],
    discount: 33,
    isNew: true,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 0.8,
    viewCount: 789,
    salesCount: 123
  },

  // Arts & Crafts Products
  {
    name: 'Professional Acrylic Paint Set',
    description: 'High-quality acrylic paint set with 24 vibrant colors and brushes.',
    price: 44.99,
    originalPrice: 64.99,
    sku: 'PAP-018',
    categoryId: categoryIds[6], // Arts & Crafts
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    stockQuantity: 78,
    tags: ['acrylic', 'paint', 'art', 'professional'],
    features: ['24 colors', '5 brushes included', 'Non-toxic', 'Lightfast pigments'],
    discount: 30,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 1.2,
    viewCount: 345,
    salesCount: 67
  },
  {
    name: 'Handmade Ceramic Mug',
    description: 'Beautiful handcrafted ceramic mug with unique glaze patterns.',
    price: 19.99,
    originalPrice: 29.99,
    sku: 'HCM-019',
    categoryId: categoryIds[6], // Arts & Crafts
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 45,
    tags: ['handmade', 'ceramic', 'mug', 'unique'],
    features: ['Handcrafted', 'Unique glaze', 'Microwave safe', 'Dishwasher safe'],
    discount: 33,
    isNew: true,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.4,
    viewCount: 234,
    salesCount: 89
  },

  // Additional varied products
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 29.99,
    originalPrice: 39.99,
    sku: 'WCP-020',
    categoryId: categoryIds[0], // Electronics
    creatorId: creatorIds[0],
    brand: 'TechCraft',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 145,
    tags: ['wireless', 'charging', 'qi', 'fast'],
    features: ['Fast charging', 'Qi compatible', 'LED indicator', 'Non-slip base'],
    discount: 25,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.2,
    viewCount: 456,
    salesCount: 123
  },
  {
    name: 'Organic Cotton Bedsheet Set',
    description: 'Luxurious 100% organic cotton bedsheet set with deep pockets.',
    price: 89.99,
    originalPrice: 129.99,
    sku: 'OCB-021',
    categoryId: categoryIds[2], // Home & Garden
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 67,
    tags: ['organic', 'cotton', 'bedsheet', 'luxury'],
    features: ['100% organic cotton', 'Deep pockets', 'Pre-washed', 'Various colors'],
    discount: 30,
    isNew: false,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 1.8,
    viewCount: 1123,
    salesCount: 156
  },
  {
    name: 'Protein Powder - Vanilla',
    description: 'Premium whey protein powder with 25g protein per serving.',
    price: 39.99,
    originalPrice: 54.99,
    sku: 'PPV-022',
    categoryId: categoryIds[3], // Sports & Fitness
    creatorId: creatorIds[3],
    brand: 'FitLife Gear',
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
    stockQuantity: 89,
    tags: ['protein', 'whey', 'vanilla', 'fitness'],
    features: ['25g protein per serving', 'Low sugar', 'Easy mixing', '2lb container'],
    discount: 27,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.9,
    viewCount: 767,
    salesCount: 145
  },
  {
    name: 'Silk Scarf Collection',
    description: 'Elegant silk scarves in beautiful patterns. Set of 3.',
    price: 69.99,
    originalPrice: 99.99,
    sku: 'SSC-023',
    categoryId: categoryIds[1], // Fashion
    creatorId: creatorIds[1],
    brand: 'Urban Fashion Hub',
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    stockQuantity: 34,
    tags: ['silk', 'scarf', 'elegant', 'set'],
    features: ['100% silk', 'Set of 3', 'Various patterns', 'Gift box included'],
    discount: 30,
    isNew: true,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 0.15,
    viewCount: 456,
    salesCount: 45
  },
  {
    name: 'Natural Lip Balm Set',
    description: 'Moisturizing lip balms with natural ingredients. Set of 4 flavors.',
    price: 12.99,
    originalPrice: 19.99,
    sku: 'NLB-024',
    categoryId: categoryIds[5], // Health & Beauty
    creatorId: creatorIds[4],
    brand: 'Wellness & Glow',
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 189,
    tags: ['natural', 'lip-balm', 'moisturizing', 'set'],
    features: ['4 flavors', 'Natural ingredients', 'Long-lasting', 'Cruelty-free'],
    discount: 35,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.08,
    viewCount: 345,
    salesCount: 189
  },
  {
    name: 'LED Desk Lamp with USB Charging',
    description: 'Modern LED desk lamp with adjustable brightness and USB charging port.',
    price: 54.99,
    originalPrice: 79.99,
    sku: 'LDL-025',
    categoryId: categoryIds[2], // Home & Garden
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.6,
    reviewCount: 123,
    inStock: true,
    stockQuantity: 78,
    tags: ['led', 'desk-lamp', 'usb', 'adjustable'],
    features: ['LED lighting', 'USB charging port', 'Adjustable brightness', 'Touch control'],
    discount: 31,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.9,
    viewCount: 567,
    salesCount: 98
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24h, hot for 12h.',
    price: 24.99,
    originalPrice: 34.99,
    sku: 'SSW-026',
    categoryId: categoryIds[3], // Sports & Fitness
    creatorId: creatorIds[3],
    brand: 'FitLife Gear',
    rating: 4.8,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 145,
    tags: ['stainless-steel', 'water-bottle', 'insulated', 'thermal'],
    features: ['Double-wall insulation', '24oz capacity', 'Leak-proof cap', 'BPA-free'],
    discount: 28,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.5,
    viewCount: 789,
    salesCount: 167
  },
  {
    name: 'Meditation Guide Audio Series',
    description: 'Complete guided meditation series with 20+ sessions for relaxation and mindfulness.',
    price: 19.99,
    originalPrice: 29.99,
    sku: 'MGA-027',
    categoryId: categoryIds[4], // Books & Media
    creatorId: creatorIds[4],
    brand: 'Wellness & Glow',
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 999,
    tags: ['meditation', 'audio', 'guided', 'mindfulness'],
    features: ['20+ sessions', 'MP3 format', 'Various lengths', 'Instant download'],
    discount: 33,
    isNew: true,
    isFeatured: false,
    isActive: true,
    isDigital: true,
    digitalFileSize: 512,
    downloadUrl: '/downloads/meditation-series.zip',
    viewCount: 432,
    salesCount: 89
  },
  {
    name: 'Premium Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID blocking technology.',
    price: 49.99,
    originalPrice: 69.99,
    sku: 'PLW-028',
    categoryId: categoryIds[1], // Fashion
    creatorId: creatorIds[1],
    brand: 'Urban Fashion Hub',
    rating: 4.7,
    reviewCount: 145,
    inStock: true,
    stockQuantity: 67,
    tags: ['leather', 'wallet', 'rfid', 'premium'],
    features: ['Genuine leather', 'RFID blocking', '8 card slots', 'Coin pocket'],
    discount: 28,
    isNew: false,
    isFeatured: false,
    isActive: true,
    isDigital: false,
    weight: 0.12,
    viewCount: 654,
    salesCount: 123
  },
  {
    name: 'Indoor Air Purifier',
    description: 'HEPA air purifier removes 99.97% of airborne particles and allergens.',
    price: 149.99,
    originalPrice: 199.99,
    sku: 'IAP-029',
    categoryId: categoryIds[2], // Home & Garden
    creatorId: creatorIds[2],
    brand: 'Home Harmony',
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    stockQuantity: 34,
    tags: ['air-purifier', 'hepa', 'indoor', 'allergens'],
    features: ['HEPA filter', 'Covers 300 sq ft', 'Quiet operation', 'Filter replacement indicator'],
    discount: 25,
    isNew: true,
    isFeatured: true,
    isActive: true,
    isDigital: false,
    weight: 5.2,
    viewCount: 876,
    salesCount: 67
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('📊 Database synced successfully');

    // Check if data already exists
    const existingUsers = await User.count({ where: { role: 'creator' } });
    const existingCategories = await Category.count();
    const existingProducts = await Product.count();

    if (existingUsers > 0 && existingCategories > 0 && existingProducts > 0) {
      console.log('✅ Database already has sample data!');
      console.log(`
    📊 Current data:
    - Creator Users: ${existingUsers}
    - Categories: ${existingCategories} 
    - Products: ${existingProducts}
      `);
      return;
    }

    // Create categories
    console.log('📂 Creating categories...');
    const createdCategories = await Category.bulkCreate(categories, {
      ignoreDuplicates: true,
      returning: true
    });
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create creator users
    console.log('👥 Creating creator users...');
    const createdUsers = [];
    for (const userData of creatorUsers) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await User.create({
          ...userData,
          password: hashedPassword
        });
        createdUsers.push(user);
        
        // Create creator profile
        await CreatorProfile.create({
          userId: user.id,
          businessName: userData.businessName,
          businessDescription: userData.businessDescription,
          businessType: userData.businessType,
          isVerified: true,
          isActive: true,
          rating: 4.8,
          totalSales: Math.floor(Math.random() * 1000) + 100,
          totalProducts: 0,
          totalEarnings: Math.floor(Math.random() * 5000) + 1000,
          commissionRate: 15,
          joinedAt: new Date()
        });
      } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`⚠️ User with email ${userData.email} already exists, skipping...`);
          // Find the existing user
          const existingUser = await User.findOne({ where: { email: userData.email } });
          if (existingUser) {
            createdUsers.push(existingUser);
          }
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ Processed ${createdUsers.length} creator users with profiles`);

    // Create products
    console.log('🛍️ Creating products...');
    const categoryIds = createdCategories.length > 0 ? createdCategories.map(cat => cat.id) : 
                       (await Category.findAll()).map(cat => cat.id);
    const creatorIds = createdUsers.map(user => user.id);
    
    if (categoryIds.length === 0) {
      throw new Error('No categories found for product creation');
    }
    
    if (creatorIds.length === 0) {
      throw new Error('No creators found for product creation');
    }
    
    console.log(`Using ${categoryIds.length} categories and ${creatorIds.length} creators`);
    
    const products = generateProducts(categoryIds, creatorIds);
    
    console.log(`Generated ${products.length} products to create`);
    
    // Create products one by one to catch individual errors
    const createdProducts = [];
    for (let i = 0; i < products.length; i++) {
      try {
        const product = await Product.create(products[i]);
        createdProducts.push(product);
        console.log(`Created product ${i + 1}/${products.length}: ${product.name}`);
      } catch (error: any) {
        console.error(`Failed to create product ${i + 1}:`, products[i].name, error.message);
        // Continue with next product instead of failing completely
      }
    }
    
    console.log(`✅ Created ${createdProducts.length} products successfully`);

    // Create sample product images
    console.log('🖼️ Creating product images...');
    const productImages = [];
    for (const product of createdProducts) {
      // Add 2-4 images per product
      const imageCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < imageCount; i++) {
        productImages.push({
          productId: product.id,
          imageUrl: `https://picsum.photos/800/600?random=${product.id}-${i}`,
          altText: `${product.name} - Image ${i + 1}`,
          isPrimary: i === 0,
          sortOrder: i
        });
      }
    }
    
    await ProductImage.bulkCreate(productImages, { ignoreDuplicates: true });
    console.log(`✅ Created ${productImages.length} product images`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
    📊 Summary:
    - Categories: ${categoryIds.length}
    - Creator Users: ${createdUsers.length}
    - Products: ${createdProducts.length}
    - Product Images: ${productImages.length}
    `);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;