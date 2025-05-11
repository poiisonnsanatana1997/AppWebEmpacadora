import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { colors } from '../styles/colors'
import styled from 'styled-components'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  box-shadow: 0 2px 4px ${colors.shadow.medium};
`

const Logo = styled.div`
  color: ${colors.background.light};
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`

const UserButton = styled.button`
  background: none;
  border: none;
  color: ${colors.background.light};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`

const UserAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.background.light};
  font-size: 1.1rem;
  box-shadow: 0 2px 8px ${colors.shadow.medium};
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const UserName = styled.span`
  font-weight: 500;
  color: ${colors.background.light};
`

const UserRole = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
  color: ${colors.background.light};
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${colors.background.light};
  border-radius: 0.75rem;
  box-shadow: 0 4px 16px ${colors.shadow.medium};
  border: 1px solid ${colors.border.light};
  min-width: 180px;
  overflow: hidden;
  z-index: 2000;
`

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: ${colors.text.primary};
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.7rem;

  &:hover {
    background: rgba(74, 107, 87, 0.08);
  }
`

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Usuario en Header:', user);
  }, [user]);

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate('/login')
  }

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/home')}>
        AgroPack
      </Logo>
      <div style={{ position: 'relative' }}>
        <UserButton onClick={() => setShowDropdown(!showDropdown)}>
          <UserAvatar>
            {user?.name?.charAt(0) || 'U'}
          </UserAvatar>
          <UserInfo>
            <UserName>{user?.name || 'Usuario'}</UserName>
            <UserRole>{user?.roleName || 'Rol'}</UserRole>
          </UserInfo>
        </UserButton>
        {showDropdown && (
          <Dropdown>
            <DropdownButton onClick={handleLogout}>
              Cerrar sesión
            </DropdownButton>
          </Dropdown>
        )}
      </div>
    </HeaderContainer>
  )
}

export default Header 