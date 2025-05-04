import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate('/login')
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '4rem',
      backgroundColor: '#2E7D32',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    }}>
      <div 
        style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/home')}
      >
        AgroPack
      </div>
      <div style={{ position: 'relative' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontWeight: 500, color: 'white' }}>{user?.name || 'Usuario'}</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.8, color: 'white' }}>{user?.role || 'Rol'}</span>
          </div>
        </button>
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E0E0E0',
            minWidth: '180px',
            overflow: 'hidden',
            zIndex: 2000
          }}>
            <button
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                color: '#212121',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem'
              }}
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 