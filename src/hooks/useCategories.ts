import { useState, useEffect } from 'react';
import { Category } from '../types/category';
import { categoryService } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService.getCategories()
      .then(setCategories)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
