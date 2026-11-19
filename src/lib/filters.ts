// Search, Category, and Price Sort Helper utilities for SalonBook catalog

export interface ServiceFilterState {
  searchTerm: string;
  category: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'duration-asc' | 'popular';
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Featured & Newest' },
  { value: 'price-asc', label: 'Price: Low to High ($)' },
  { value: 'price-desc', label: 'Price: High to Low ($$)' },
  { value: 'duration-asc', label: 'Duration: Shortest First' },
  { value: 'popular', label: 'Most Popular' },
] as const;

export const SALON_CATEGORIES = [
  'All',
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
] as const;
