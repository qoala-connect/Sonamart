export type ProductCategory = 'marble' | 'granite' | 'quartz' | 'limestone' | 'sandstone' | 'onyx' | 'other';

export type ProductStatus = 'in-stock' | 'low-stock' | 'pre-order' | 'unavailable';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  minQuantity: number;
  status: ProductStatus;
  location?: string; // City name
  images: string[];
  specifications: {
    origin: string;
    thickness?: string;
    finish: string;
    dimensions?: string;
  };
  certifications?: string[];
  priceRange?: string; // Display label e.g. "₹80–₹150 / sq ft"
}

export interface Stone {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  color: string;
  image: string;
  origin: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
}
