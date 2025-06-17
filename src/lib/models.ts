export interface Product {
  id: number;
  name: string;
  description: string;
  long_description?: string;
  price: number;
  category_id: number;
  in_stock: boolean;
  // Add other fields as necessary
}

export interface Category {
  id: number;
  name: string;
  // Add other fields as necessary
}
