export interface Business {
  id: string;
  name: string;
  category_id: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  image_url: string;
  is_verified: boolean;
  is_prime: boolean;
  created_at: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: string;
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
