import { Business } from '../types/business';

export const businessService = {
  async getBusinesses(categoryId?: string, city?: string): Promise<import('../types').PaginatedResponse<Business>> {
    const params = new URLSearchParams();
    if (categoryId) params.append('category', categoryId); // Assuming categoryId is slug here or update accordingly
    if (city) params.append('city', city);
    
    const response = await fetch(`/api/businesses?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    return response.json();
  },

  async getBusinessById(id: string): Promise<Business> {
    const response = await fetch(`/api/businesses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch business details');
    return response.json();
  },

  async createBusiness(data: Partial<Business>): Promise<Business> {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/businesses', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create business');
    }
    return response.json();
  }
};
