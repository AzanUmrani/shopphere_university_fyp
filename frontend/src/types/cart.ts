// Cart item interface
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{ url: string; alt: string }>;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Cart interface
export interface Cart {
  id: string | null;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

// API Response interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Cart count response interface
export interface CartCountResponse {
  count: number;
}
