import { STORAGE_KEYS } from '@/utils/storage/constants';
import { storage } from '@/utils/storage/storage';
import { Product } from '@/types/product';

export const saveProduct = (product: Product): void => {
  const products = storage.get<Product[]>("PRODUCTS") || [];
  const existingIndex = products.findIndex(p => p.id === product.id);

  if (existingIndex > -1) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  storage.set("PRODUCTS", products);
};

export const getProducts = (): Product[] => {
  return storage.get<Product[]>("PRODUCTS") || [];
};

export const getProductById = (id: string): Product | undefined => {
  const products = storage.get<Product[]>("PRODUCTS") || [];
  return products.find(p => p.id === id);
};

export const removeProduct = (id: string): void => {
  let products = storage.get<Product[]>("PRODUCTS") || [];
  products = products.filter(p => p.id !== id);
  storage.set("PRODUCTS", products);
};