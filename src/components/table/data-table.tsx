import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { deleteProduct } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

import type { ProductData } from '@/lib/types';

interface ProductsTableProps {
  data: ProductData[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSort: (column: string) => void;
  currentSort: string | null;
  currentSortDirection: 'asc' | 'desc';
}

export function ProductsTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  onSort,
  currentSort,
  currentSortDirection
}: ProductsTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const totalPages = Math.ceil(total / limit);
  
  const handleRowClick = (id: number) => {
    router.push(`/products/${id}`);
  };
  
  const mutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
  
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      try {
        await mutation.mutateAsync(id.toString());
        setDeleteConfirmId(null);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    } else {
      setDeleteConfirmId(id);
    }
  };
  
  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${id}/edit`);
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };
  
  const renderSortIcon = (column: string) => {
    if (currentSort !== column) return null;
    return currentSortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('title')}
            >
              Title {renderSortIcon('title')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('brand')}
            >
              Brand {renderSortIcon('brand')}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => onSort('price')}
            >
              Price {renderSortIcon('price')}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-center"
              onClick={() => onSort('rating')}
            >
              Rating {renderSortIcon('rating')}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-center"
              onClick={() => onSort('stock')}
            >
              Stock {renderSortIcon('stock')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow 
              key={product.id} 
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handleRowClick(product.id)}
            >
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-center">{product.rating}/5</TableCell>
              <TableCell className="text-center">{product.stock}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEdit(product.id, e)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {deleteConfirmId === product.id ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => handleDelete(product.id, e)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelDelete}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={(e) => handleDelete(product.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} products
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}