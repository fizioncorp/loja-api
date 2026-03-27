export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  cost: number;
  stock: number;
  active: boolean;
  createdAt: string;
}

export interface CreateProductDTO {
  name: string;
  barcode: string;
  price: number;
  cost: number;
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}
