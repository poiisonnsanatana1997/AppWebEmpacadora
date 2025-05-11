import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  HelpCircle} from 'lucide-react';
import { Button } from '@/components/ui/button';
import styled from 'styled-components';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, #1E40AF, #3B82F6);
    opacity: 0.8;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2.5rem;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;

  svg {
    color: #1E40AF;
    background: #F8FAFC;
    padding: 1.25rem;
    border-radius: 1rem;
    border: 1px solid #E2E8F0;
    width: 64px;
    height: 64px;
  }

  @media (min-width: 768px) {
    font-size: 1.75rem;

    svg {
      width: 72px;
      height: 72px;
      padding: 1.5rem;
    }
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
  max-width: 600px;
  line-height: 1.5;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
    gap: 0.75rem;
    flex-wrap: nowrap;
  }
`;

const QuickActions = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid #E2E8F0;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: #F1F5F9;
    color: #1E293B;
    border-color: #CBD5E1;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 640px) {
    padding: 0.375rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: #F8FAFC;
  color: #1E293B;
  font-size: 0.875rem;
  width: 100%;
  max-width: 300px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
`;

interface ProductsHeaderProps {
  onNewProduct: () => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  onExport?: () => void;
  onHelp?: () => void;
}

export function ProductsHeader({ 
  onNewProduct,
  onSearch,
  onFilter,
  onExport,
  onHelp
}: ProductsHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilter = (filters: any) => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  return (
    <Header>
      <HeaderContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderTitle>
            <Package />
            <div>
              Productos
              <HeaderSubtitle>
                Gestiona tu catálogo de productos agrícolas
              </HeaderSubtitle>
            </div>
          </HeaderTitle>
        </motion.div>
      </HeaderContent>

      <HeaderActions>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionButton onClick={handleSearch}>
                  <Search />
                </ActionButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buscar productos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SearchContainer>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button onClick={onNewProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </motion.div>

        <QuickActions>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionButton onClick={() => handleFilter({})}>
                  <Filter />
                </ActionButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar productos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionButton onClick={onExport}>
                  <Download />
                </ActionButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar productos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionButton onClick={onHelp}>
                  <HelpCircle />
                </ActionButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ayuda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </QuickActions>
      </HeaderActions>
    </Header>
  );
}

export default ProductsHeader; 