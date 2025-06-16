import styled from 'styled-components';

const ImageContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #F7FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A0AEC0;
  font-size: 1.5rem;
`;

interface ProductImageProps {
  src?: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  if (!src) {
    return (
      <ImageContainer>
        <Placeholder>
          <i className="fas fa-image" />
        </Placeholder>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer>
      <Image src={src} alt={alt} />
    </ImageContainer>
  );
} 