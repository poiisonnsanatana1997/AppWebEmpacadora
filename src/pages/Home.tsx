import { Home as HomeIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#F4F6F8'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(76,175,80,0.06)',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          color: '#4CAF50',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <HomeIcon size={24} />
          Bienvenido a Empacadora
        </h1>
        <p style={{
          color: '#7B8A99',
          fontSize: '1.125rem',
          lineHeight: '1.5'
        }}>
          Plataforma integral para la gestión de la empacadora. Aquí podrás monitorear y gestionar todos los aspectos de tu operación de manera eficiente.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(76,175,80,0.06)'
        }}>
          <h3 style={{
            color: '#388E3C',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            Total de Cultivos
          </h3>
          <div style={{
            color: '#4CAF50',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            12
          </div>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(76,175,80,0.06)'
        }}>
          <h3 style={{
            color: '#388E3C',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            Área Total
          </h3>
          <div style={{
            color: '#4CAF50',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            45 ha
          </div>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(76,175,80,0.06)'
        }}>
          <h3 style={{
            color: '#388E3C',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            Próximas Actividades
          </h3>
          <div style={{
            color: '#4CAF50',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            5
          </div>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(76,175,80,0.06)'
        }}>
          <h3 style={{
            color: '#388E3C',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            Alertas Activas
          </h3>
          <div style={{
            color: '#4CAF50',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            2
          </div>
        </div>
      </div>
    </div>
  );
}