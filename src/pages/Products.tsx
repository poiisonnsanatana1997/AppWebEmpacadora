import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Package, Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import ProductTable from "@/components/products/ProductTable";
import ProductForm from "@/components/forms/ProductForm";
import productsService from "@/api/products";
import type { Product } from "@/types/product";
import ProductsHeader from "@/components/products/ProductsHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Container = styled.div`
  padding: 2rem;
`;

const ProductsTableContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  overflow: hidden;
`;

const TableHeaderSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
`;

const TableContentSection = styled.div`
  padding: 1.5rem;
  overflow-x: auto;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748B;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #DC2626;
  background: #FEE2E2;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748B;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    width: 3rem;
    height: 3rem;
    color: #CBD5E1;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1E293B;
    margin: 0;
  }

  p {
    margin: 0;
    color: #64748B;
  }
`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error: any) {
      console.error('Error al obtener productos:', error);
      setError(error.message || 'Error al cargar los productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelected(product);
    setOpenForm(true);
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await productsService.deleteProduct(productToDelete.id);
      await fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      console.error('Error al eliminar el producto:', error);
      setError(error.message || 'Error al eliminar el producto');
    }
  };

  const handleNew = () => {
    setSelected(null);
    setOpenForm(true);
  };

  return (
    <Container>
      <Toaster richColors position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProductsHeader
          onNewProduct={handleNew}
          onSearch={() => console.log('Búsqueda')}
          onFilter={() => console.log('Filtros')}
          onExport={() => console.log('Exportar')}
        />

        <ProductsTableContainer>
          <TableHeaderSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Lista de Productos
              </h2>
            </motion.div>
          </TableHeaderSection>

          <TableContentSection>
            {loading ? (
              <LoadingMessage>
                <Loader2 />
                <p>Cargando productos...</p>
              </LoadingMessage>
            ) : error ? (
              <ErrorMessage>{error}</ErrorMessage>
            ) : products.length === 0 ? (
              <EmptyState>
                <Package />
                <h3>No hay productos</h3>
                <p>Comienza agregando un nuevo producto al catálogo</p>
              </EmptyState>
            ) : (
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </TableContentSection>
        </ProductsTableContainer>

        <ProductForm
          product={selected}
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSuccess={fetchProducts}
        />

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro que deseas eliminar el producto "{productToDelete?.name}"? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default Products; 