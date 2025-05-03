'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/utils';
import { ProductsTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function ProductsPage() {
  // Set page title
  useEffect(() => {
    document.title = "All Products – MyShop";
  }, []);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, limit, sort, sortDirection],
    queryFn: () => fetchProducts({ 
      limit, 
      skip: (page - 1) * limit,
      sort,
      sortDirection
    }),
  });

  const handleSort = (column: string) => {
    if (sort === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(column);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddNew = () => {
    router.push('/products/add');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products: {(error as Error).message}</div>;

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button onClick={handleAddNew}>Add New Product</Button>
        </div>
        
        <ProductsTable 
          data={data?.products || []} 
          total={data?.total || 0}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onSort={handleSort}
          currentSort={sort}
          currentSortDirection={sortDirection}
        />
      </div>
    </>
  );
}