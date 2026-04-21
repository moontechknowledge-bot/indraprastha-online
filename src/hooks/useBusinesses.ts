import { useState, useEffect } from 'react';
import { Business } from '../types/business';
import { businessService } from '../services/businessService';

export function useBusinesses(categoryId?: string, city?: string) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    businessService.getBusinesses(categoryId, city)
      .then(response => setBusinesses(response.businesses))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId, city]);

  return { businesses, loading, error };
}
