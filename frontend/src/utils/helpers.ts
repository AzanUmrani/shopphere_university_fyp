import type { Product, FilterOptions } from "../types";

export const formatPrice = (price: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};

export const formatDiscount = (
  originalPrice: number,
  currentPrice: number
): string => {
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return `${Math.round(discount)}%`;
};

export const calculateDiscountPercentage = (
  originalPrice: number,
  currentPrice: number
): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatShortDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export const unslugify = (slug: string): string => {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + "...";
};

export const filterProducts = (
  products: Product[],
  filters: FilterOptions,
  searchQuery = ""
): Product[] => {
  let filteredProducts = [...products];

  // Search query filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.categories.includes(product.category)
    );
  }

  // Brand filter
  if (filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.brands.includes(product.brand)
    );
  }

  // Price range filter
  filteredProducts = filteredProducts.filter(
    (product) =>
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
  );

  // Rating filter
  if (filters.rating > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.rating >= filters.rating
    );
  }

  // Stock filter
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter((product) => product.inStock);
  }

  // Tags filter
  if (filters.tags.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.tags.some((tag) => product.tags.includes(tag))
    );
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "price":
        comparison = a.price - b.price;
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "newest":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "popularity":
        comparison = a.reviewCount - b.reviewCount;
        break;
      default:
        comparison = 0;
    }

    return filters.sortOrder === "desc" ? -comparison : comparison;
  });

  return filteredProducts;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const generateStarRating = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
  );
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const isValidZipCode = (zipCode: string, country = "US"): boolean => {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
  };

  const pattern = patterns[country as keyof typeof patterns];
  return pattern ? pattern.test(zipCode) : true;
};

export const calculateShipping = (
  subtotal: number,
  shippingMethod = "standard"
): number => {
  if (subtotal >= 100) return 0; // Free shipping over $100

  const rates = {
    standard: 9.99,
    express: 19.99,
    overnight: 39.99,
  };

  return rates[shippingMethod as keyof typeof rates] || rates.standard;
};

export const calculateTax = (subtotal: number, taxRate = 0.08): number => {
  return subtotal * taxRate;
};
