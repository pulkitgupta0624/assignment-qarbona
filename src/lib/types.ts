import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  price: z.number().min(0, { message: 'Price must be positive' }),
  discountPercentage: z.number().min(0).max(100, { message: 'Discount must be between 0-100%' }),
  rating: z.number().min(0).max(5, { message: 'Rating must be between 0-5' }),
  stock: z.number().min(0).int({ message: 'Stock must be a whole number' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  thumbnail: z.string().url({ message: 'Thumbnail must be a valid URL' }),
  images: z.array(z.string().url({ message: 'All image URLs must be valid' }))
});

export const productFormSchema = productSchema.extend({
  images: z.string().transform((val) => {
    return val.split('\n').filter(url => url.trim() !== '');
  })
});

export type Product = z.infer<typeof productSchema>;

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductData extends Product {
  id: number;
}