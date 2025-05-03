import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchProducts({ 
  limit = 10, 
  skip = 0, 
  sort = null,
  sortDirection = 'asc'
}) {
  const sortParam = sort ? `&sortBy=${sort}&order=${sortDirection}` : '';
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}${sortParam}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

export async function fetchProductById(id: string) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  
  return response.json();
}

export async function addProduct(product: any) {
  const response = await fetch('https://dummyjson.com/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  
  return response.json();
}

export async function updateProduct(id: string, product: any) {
  const response = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  
  return response.json();
}

export async function deleteProduct(id: string) {
  const response = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  
  return response.json();
}
