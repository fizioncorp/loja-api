import { api } from "@/services/api";
import type { CreateProductDTO, PaginatedResponse, Product } from "@/types/product";

interface ListProductsParams {
  page?: number;
  limit?: number;
}

export async function listProducts(params: ListProductsParams = {}) {
  const response = await api.get<PaginatedResponse<Product>>("/products", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 8,
    },
  });

  return response.data;
}

export async function searchProducts(name: string) {
  const response = await api.get<Product[]>("/products/search", {
    params: { name },
  });

  return response.data;
}

export async function createProduct(data: CreateProductDTO) {
  const response = await api.post<Product>("/products", data);

  return response.data;
}

export async function updateProduct(productId: string, data: CreateProductDTO) {
  const response = await api.put<Product>(`/products/${productId}`, data);

  return response.data;
}

export async function activateProduct(productId: string) {
  await api.patch(`/products/${productId}/activate`);
}

export async function deactivateProduct(productId: string) {
  await api.patch(`/products/${productId}/deactivate`);
}
