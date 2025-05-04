import { useState } from 'react';
import styled from 'styled-components';
import { List as ListIcon, Plus, Search, Filter, MoreVertical } from 'lucide-react';

const InventoryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #F4F6F8;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #4CAF50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: #4CAF50;
    color: white;
    border: none;
    &:hover {
      background: #388E3C;
    }
  }

  &.secondary {
    background: #E8F5E9;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    &:hover {
      background: #F4F6F8;
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  margin-left: 0.5rem;
  color: #111936;

  &::placeholder {
    color: #94a3b8;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(76,175,80,0.06);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  color: #111936;
  margin: 0;
`;

const CardContent = styled.div`
  margin-top: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const InfoLabel = styled.span`
  color: #94a3b8;
`;

const InfoValue = styled.span`
  color: #111936;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: 'available' | 'low' | 'out' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ status }) => status === 'available' && `
    background: #E8F5E9;
    color: #388E3C;
  `}

  ${({ status }) => status === 'low' && `
    background: #fef9c3;
    color: #854d0e;
  `}

  ${({ status }) => status === 'out' && `
    background: #fee2e2;
    color: #991b1b;
  `}
`;

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Datos de ejemplo
  const items = [
    {
      id: 1,
      name: 'Fertilizante NPK',
      category: 'Fertilizantes',
      quantity: 150,
      unit: 'kg',
      status: 'available',
      lastUpdate: '2024-03-15'
    },
    {
      id: 2,
      name: 'Herbicida',
      category: 'Agroquímicos',
      quantity: 5,
      unit: 'L',
      status: 'low',
      lastUpdate: '2024-03-14'
    },
    {
      id: 3,
      name: 'Semillas de Maíz',
      category: 'Semillas',
      quantity: 0,
      unit: 'kg',
      status: 'out',
      lastUpdate: '2024-03-13'
    }
  ];

  return (
    <InventoryContainer>
      <Header>
        <Title>
          <ListIcon size={24} />
          Inventario
        </Title>
        <Actions>
          <SearchBar>
            <Search size={18} color="#94a3b8" />
            <SearchInput
              placeholder="Buscar en inventario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          <Button className="secondary">
            <Filter size={18} />
            Filtros
          </Button>
          <Button className="primary">
            <Plus size={18} />
            Nuevo Item
          </Button>
        </Actions>
      </Header>

      <Grid>
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <Button className="secondary">
                <MoreVertical size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              <InfoRow>
                <InfoLabel>Categoría:</InfoLabel>
                <InfoValue>{item.category}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Cantidad:</InfoLabel>
                <InfoValue>{item.quantity} {item.unit}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Estado:</InfoLabel>
                <StatusBadge status={item.status as 'available' | 'low' | 'out'}>
                  {item.status === 'available' ? 'Disponible' : 
                   item.status === 'low' ? 'Bajo Stock' : 'Agotado'}
                </StatusBadge>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Última actualización:</InfoLabel>
                <InfoValue>{item.lastUpdate}</InfoValue>
              </InfoRow>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </InventoryContainer>
  );
} 