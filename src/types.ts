export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  order_index: number;
  is_active: boolean;
}

export interface Business {
  id?: string;
  name: string;
  category_id: string;
  category_name?: string;
  description: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  image_url?: string;
  images?: string[];
  map_url?: string;
  opening_time?: string;
  closing_time?: string;
  slug?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_featured?: boolean;
  plan_type?: 'free' | 'showroom' | 'prime';
  status?: 'pending' | 'approved' | 'rejected';
  payment_status?: 'PENDING' | 'SUCCESS' | 'REJECTED';
  created_at?: string;
  seller_id?: string;
  seller_email?: string;
}

export interface BusinessLinks {
  id?: string;
  business_id: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface Product {
  id?: string;
  business_id: string;
  seller_id: string;
  name: string;
  category?: string;
  price?: number;
  image_url?: string;
  description: string;
  created_at?: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  email?: string;
  plan: 'free' | 'showroom' | 'prime';
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface UsedItem {
  id?: string;
  seller_id: string;
  seller_name?: string;
  seller_phone?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  city: string;
  image_url?: string;
  status: 'available' | 'sold';
  created_at?: string;
}

export interface PaginatedResponse<T> {
  total_results: number;
  current_page: number;
  total_pages: number;
  businesses: T[];
}
