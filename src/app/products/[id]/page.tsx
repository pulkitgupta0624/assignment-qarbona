'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });
  
  // Set dynamic page title based on product
  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} – MyShop`;
    } else {
      document.title = "Product Details – MyShop";
    }
  }, [product?.title]);

  const handleEdit = () => {
    router.push(`/products/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/products');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product: {(error as Error).message}</div>;

  return (
    <>
      <div className="container mx-auto py-6">
        <Button onClick={handleBack} variant="outline" className="mb-4">Back to Products</Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={product?.thumbnail} 
              alt={product?.title} 
              className="w-full rounded-lg"
            />
            
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product?.images?.slice(0, 4).map((img: string, i: number) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`${product?.title} ${i}`} 
                  className="w-full h-16 object-cover rounded"
                />
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{product?.title}</h1>
              <Button onClick={handleEdit}>Edit</Button>
            </div>
            
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{product?.rating}/5</span>
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold text-green-600">
                ${product?.price.toFixed(2)}
                {product?.discountPercentage > 0 && (
                  <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                    {product?.discountPercentage}% OFF
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm">In Stock: {product?.stock}</div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="mt-2">{product?.description}</p>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Brand</span>
                <div>{product?.brand}</div>
              </div>
              <div>
                <span className="text-gray-500">Category</span>
                <div>{product?.category}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
