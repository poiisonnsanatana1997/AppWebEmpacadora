import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled(Button)`
  padding: 0.5rem;
  height: auto;
  width: auto;
  color: #64748b;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #1e293b;
    background: transparent;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface OrdenesEntradaPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const OrdenesEntradaPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: OrdenesEntradaPaginationProps) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <PaginationContainer>
      <PageInfo>
        Página {currentPage} de {totalPages}
      </PageInfo>
      <PageButtons>
        <PageButton
          variant="ghost"
          size="icon"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </PageButton>
        <PageButton
          variant="ghost"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </PageButton>
      </PageButtons>
    </PaginationContainer>
  );
}; 