import { Category, Business } from '../types';
import { fetchWithAuth } from '../utils/api';

const API_BASE = '/api';

let categoriesCache: Category[] | null = null;
let sellerBusinessesCache: { data: Business[], timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

export const apiService = {
  async getCategories(force: boolean = false): Promise<Category[]> {
    if (!force && categoriesCache && categoriesCache.length > 0) return categoriesCache;
    
    let lastError: any = null;
    const maxRetries = 2; // Reduced retries
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        const categories = Array.isArray(data) ? data : [];
        
        // Only cache if we actually got categories
        if (categories.length > 0) {
          categoriesCache = categories;
          return categories;
        }
        
        // If empty, maybe wait and retry (could be seeding)
        console.warn(`getCategories: Received empty array (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay
      } catch (error) {
        lastError = error;
        console.warn(`getCategories: Attempt ${i + 1} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay
      }
    }
    
    throw lastError || new Error('Failed to fetch categories after retries');
  },

  async getBusinesses(params?: { category_id?: string; category?: string; subcategory?: string; city?: string; page?: number; limit?: number; verified?: boolean; search?: string }): Promise<import('../types').PaginatedResponse<Business>> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    const url = `${API_BASE}/businesses${query ? `?${query}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    const data = await response.json();
    return {
      businesses: Array.isArray(data.businesses) ? data.businesses : [],
      total_results: data.total_results || 0,
      current_page: data.current_page || 1,
      total_pages: data.total_pages || 1
    };
  },

  async getBusinessById(id: string): Promise<Business> {
    const response = await fetch(`${API_BASE}/businesses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch business details');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async createBusiness(data: Partial<Business>): Promise<Business> {
    const response = await fetchWithAuth(`${API_BASE}/businesses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Prioritize details over generic error message
      throw new Error(errorData.details || errorData.error || 'Failed to create business');
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    
    // Clear seller cache after successful creation
    this.clearSellerCache();
    
    return response.json();
  },

  clearSellerCache() {
    console.log('apiService: Clearing seller businesses cache');
    sellerBusinessesCache = null;
  },

  async updateBusiness(data: Partial<Business>): Promise<Business> {
    if (!data.id) throw new Error('Business ID is required for update');
    const response = await fetchWithAuth(`${API_BASE}/businesses/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update business');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async getBusinessesBySeller(forceRefresh = false): Promise<Business[]> {
    console.log('apiService: getBusinessesBySeller called', { forceRefresh });
    
    if (!forceRefresh && sellerBusinessesCache && (Date.now() - sellerBusinessesCache.timestamp < CACHE_DURATION)) {
      console.log('apiService: Returning cached seller businesses');
      return sellerBusinessesCache.data;
    }

    try {
      // Add a cache-busting timestamp to bypass potential service worker caching
      const timestamp = new Date().getTime();
      const url = `${API_BASE}/seller/businesses?t=${timestamp}`;
      
      console.log('apiService: Fetching from:', url);
      const response = await fetchWithAuth(url);
      console.log('apiService: getBusinessesBySeller response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch seller businesses');
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('apiService: getBusinessesBySeller non-JSON response');
        throw new Error('Server returned non-JSON response');
      }
      const data = await response.json();
      console.log('apiService: getBusinessesBySeller data parsed:', data);
      
      const businesses = Array.isArray(data) ? data : [];
      sellerBusinessesCache = { data: businesses, timestamp: Date.now() };
      return businesses;
    } catch (error) {
      console.error('apiService: getBusinessesBySeller error:', error);
      throw error;
    }
  },

  clearCache() {
    sellerBusinessesCache = null;
  },

  async seedDemoData(): Promise<{ message: string }> {
    const response = await fetchWithAuth(`${API_BASE}/seller/seed-demo-data`, {
      method: 'POST'
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || 'Failed to seed demo data');
    }
    return response.json();
  },

  // Product Methods
  async getProductsByBusiness(business_id: string): Promise<import('../types').Product[]> {
    const response = await fetch(`${API_BASE}/products/${business_id}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async createProduct(data: Partial<import('../types').Product>): Promise<import('../types').Product> {
    const response = await fetchWithAuth(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create product');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async updateProduct(data: Partial<import('../types').Product>): Promise<import('../types').Product> {
    if (!data.id) throw new Error('Product ID is required for update');
    const response = await fetchWithAuth(`${API_BASE}/products/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const response = await fetchWithAuth(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  // Business Link Methods
  async getBusinessLinks(business_id: string): Promise<any> {
    const response = await fetch(`${API_BASE}/business-links/${business_id}`);
    if (!response.ok) throw new Error('Failed to fetch business links');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async upsertBusinessLinks(data: any): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/business-links`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save business links');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  // Admin Methods
  async getAdminBusinesses(status?: string): Promise<Business[]> {
    const query = status ? `?status=${status}` : '';
    const response = await fetchWithAuth(`${API_BASE}/admin/businesses${query}`);
    if (!response.ok) throw new Error('Failed to fetch admin businesses');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async updateBusinessStatus(id: string, status: 'approved' | 'rejected'): Promise<Business> {
    const response = await fetchWithAuth(`${API_BASE}/admin/businesses/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update business status');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  // Payment Methods
  async submitPayment(businessId: string, screenshotUrl: string): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/payments/submit`, {
      method: 'POST',
      body: JSON.stringify({ business_id: businessId, screenshot_url: screenshotUrl }),
    });
    if (!response.ok) throw new Error('Failed to submit payment');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  // Admin Payment Methods
  async getPendingPayments(): Promise<any[]> {
    const response = await fetchWithAuth(`${API_BASE}/admin/payments`);
    if (!response.ok) throw new Error('Failed to fetch pending payments');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async approvePayment(requestId: string): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/admin/payments/${requestId}/approve`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to approve payment');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async rejectPayment(requestId: string): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/admin/payments/${requestId}/reject`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to reject payment');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async directUpgrade(businessId: string): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/admin/businesses/${businessId}/upgrade`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to upgrade business');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async downgradeBusiness(businessId: string): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/admin/businesses/${businessId}/downgrade`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to downgrade business');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async deleteBusiness(id: string): Promise<{ success: boolean }> {
    const response = await fetchWithAuth(`${API_BASE}/seller/businesses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete business');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    return response.json();
  },

  async trackLead(businessId: string, type: 'call' | 'whatsapp'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, type }),
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Lead tracking failed with non-JSON response');
        }
      }
    } catch (error) {
      // Silent fail as per requirements
      console.error('Lead tracking failed:', error);
    }
  },

  async getLeadsSummary(): Promise<{ call: number; whatsapp: number }> {
    console.log('apiService: getLeadsSummary called');
    try {
      const response = await fetchWithAuth(`${API_BASE}/leads/summary`);
      console.log('apiService: getLeadsSummary response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch leads summary');
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('apiService: getLeadsSummary non-JSON response');
        throw new Error('Server returned non-JSON response');
      }
      const data = await response.json();
      console.log('apiService: getLeadsSummary data parsed:', data);
      return {
        call: data.call || 0,
        whatsapp: data.whatsapp || 0
      };
    } catch (error) {
      console.error('apiService: getLeadsSummary error:', error);
      throw error;
    }
  },

  async getLeads(): Promise<any[]> {
    const response = await fetchWithAuth(`${API_BASE}/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async checkHealth(): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/seller/health`);
    return response.json();
  },

  // Review Methods
  async getBusinessReviews(businessId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/reviews/${businessId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  async createReview(data: { business_id: string; rating: number; comment: string }): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    const response = await fetchWithAuth(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
  },

  // Favorite Methods
  async toggleFavorite(businessId: string): Promise<{ favorited: boolean }> {
    const response = await fetchWithAuth(`${API_BASE}/favorites/toggle`, {
      method: 'POST',
      body: JSON.stringify({ business_id: businessId }),
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
  },

  async getMyFavorites(): Promise<any[]> {
    const response = await fetchWithAuth(`${API_BASE}/favorites/my`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  },

  async checkFavoriteStatus(businessId: string): Promise<{ favorited: boolean }> {
    const response = await fetchWithAuth(`${API_BASE}/favorites/status/${businessId}`);
    if (!response.ok) throw new Error('Failed to check favorite status');
    return response.json();
  },

  // Used Item Methods (OLX-like feature)
  async getUsedItems(params?: { category?: string; city?: string; search?: string }): Promise<import('../types').UsedItem[]> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    const url = `${API_BASE}/used-items${query ? `?${query}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch used items');
    return response.json();
  },

  async getMyUsedItems(): Promise<import('../types').UsedItem[]> {
    const response = await fetchWithAuth(`${API_BASE}/used-items/my`);
    if (!response.ok) throw new Error('Failed to fetch my used items');
    return response.json();
  },

  async getUsedItemStatus(): Promise<{ 
    plan: 'free' | 'lifetime'; 
    isEarlyBird: boolean; 
    rank: number;
    monthlyCount: number;
    totalCount: number;
    monthlyLimit: number;
    nextResetDate: string;
  }> {
    const response = await fetchWithAuth(`${API_BASE}/used-items/status`);
    if (!response.ok) throw new Error('Failed to fetch marketplace status');
    return response.json();
  },

  async createUsedItem(data: Partial<import('../types').UsedItem>): Promise<import('../types').UsedItem> {
    const response = await fetchWithAuth(`${API_BASE}/used-items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || 'Failed to create used item');
    }
    return response.json();
  },

  async updateUsedItemStatus(id: string, status: 'available' | 'sold'): Promise<import('../types').UsedItem> {
    const response = await fetchWithAuth(`${API_BASE}/used-items/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update item status');
    return response.json();
  },

  async deleteUsedItem(id: string): Promise<{ message: string }> {
    const response = await fetchWithAuth(`${API_BASE}/used-items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete used item');
    return response.json();
  },

  async upgradeMarketplace(): Promise<any> {
    const response = await fetchWithAuth(`${API_BASE}/used-items/upgrade`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to upgrade marketplace');
    return response.json();
  }
};
