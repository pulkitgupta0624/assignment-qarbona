'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { productFormSchema, type Product } from '@/lib/types';
import { fetchProductById, updateProduct } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      brand: '',
      category: '',
      thumbnail: '',
      images: ['']
    }
  });
  
  useEffect(() => {
    if (product) {
      reset({
        ...product,
        images: Array.isArray(product.images) ? product.images.join('\n') : ''
      });
      
      // Set page title
      document.title = `Edit ${product.title} – MyShop`;
    } else {
      document.title = "Edit Product – MyShop";
    }
  }, [product, reset]);
  
  const mutation = useMutation({
    mutationFn: (data: Product) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      router.push(`/products/${id}`);
    },
  });
  
  const onSubmit = async (data: Product) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/products/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product: {(error as Error).message}</div>;

  return (
    <>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Edit Product: {product?.title}</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block">Title</label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="brand" className="block">Brand</label>
              <Input id="brand" {...register('brand')} />
              {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="block">Price ($)</label>
              <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="discountPercentage" className="block">Discount Percentage</label>
              <Input 
                id="discountPercentage" 
                type="number" 
                step="0.1" 
                {...register('discountPercentage', { valueAsNumber: true })} 
              />
              {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="rating" className="block">Rating (0-5)</label>
              <Input 
                id="rating" 
                type="number" 
                step="0.1" 
                max="5" 
                {...register('rating', { valueAsNumber: true })} 
              />
              {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="stock" className="block">Stock</label>
              <Input 
                id="stock" 
                type="number" 
                {...register('stock', { valueAsNumber: true })} 
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block">Category</label>
              <Input id="category" {...register('category')} />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="thumbnail" className="block">Thumbnail URL</label>
              <Input id="thumbnail" {...register('thumbnail')} />
              {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block">Description</label>
            <Textarea id="description" rows={4} {...register('description')} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block">Images URLs (one per line)</label>
            <Textarea 
              rows={4} 
              {...register('images')}
              value={Array.isArray(product?.images) ? product.images.join('\n') : ''}
              onChange={(e) => {
                const value = e.target.value;
                const imageArray = value.split('\n').filter(url => url.trim() !== '');
                e.target.value = imageArray.join('\n');
              }}
            />
            {errors.images && <p className="text-red-500 text-sm">All images must be valid URLs</p>}
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}