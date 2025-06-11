import * as React from "react"
import styled from "styled-components"

const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`

const MenuTrigger = styled.div`
  cursor: pointer;
`

const MenuContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  z-index: 50;
  min-width: 8rem;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 0.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: ${props => props.isOpen ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-in'};

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
`

const MenuItem = styled.div<{ inset?: boolean; variant?: 'default' | 'destructive' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.25rem;
  color: ${props => props.variant === 'destructive' ? 'var(--destructive)' : 'inherit'};
  padding-left: ${props => props.inset ? '2rem' : '0.75rem'};

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`

const MenuSeparator = styled.div`
  height: 1px;
  background-color: var(--border);
  margin: 0.25rem -0.25rem;
`

const MenuLabel = styled.div<{ inset?: boolean }>`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  padding-left: ${props => props.inset ? '2rem' : '0.75rem'};
`

const MenuShortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  letter-spacing: 0.05em;
`

const MenuCheckboxItem = styled(MenuItem)`
  padding-left: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const MenuRadioItem = styled(MenuItem)`
  padding-left: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

interface ContextMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export function ContextMenu({ children, trigger }: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <MenuContainer ref={menuRef}>
      <MenuTrigger onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </MenuTrigger>
      <MenuContent isOpen={isOpen}>
        {children}
      </MenuContent>
    </MenuContainer>
  );
}

export {
  MenuItem as ContextMenuItem,
  MenuCheckboxItem as ContextMenuCheckboxItem,
  MenuRadioItem as ContextMenuRadioItem,
  MenuLabel as ContextMenuLabel,
  MenuSeparator as ContextMenuSeparator,
  MenuShortcut as ContextMenuShortcut,
}
