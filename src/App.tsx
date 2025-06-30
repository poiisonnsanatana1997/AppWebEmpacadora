import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import Inventory from './pages/Inventory'
import Productos from './pages/Productos'
import OrdenesEntrada from './pages/OrdenesEntrada'
import DetalleOrdenEntrada from './pages/DetalleOrdenEntrada'
import Usuarios from './pages/Usuarios'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Proveedores from './pages/Proveedores'

// Componente para proteger rutas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div>Cargando...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

function App() {
  return (
    <div style={{ 
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#F5F5F5',
      color: '#212121',
      width: '100%',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <AuthProvider>
        <BrowserRouter basename="/empacadora">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <PrivateRoute>
                  <Inventory />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/productos" 
              element={
                <PrivateRoute>
                  <Productos />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/ordenes-entrada" 
              element={
                <PrivateRoute>
                  <OrdenesEntrada />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/ordenes-entrada/:codigo" 
              element={
                <PrivateRoute>
                  <DetalleOrdenEntrada />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/usuarios" 
              element={
                <PrivateRoute>
                  <Usuarios />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/proveedores" 
              element={
                <PrivateRoute>
                  <Proveedores />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
