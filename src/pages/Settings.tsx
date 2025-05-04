import { useState } from 'react';
import styled from 'styled-components';
import { Settings as SettingsIcon, Save, Bell, Lock, Globe } from 'lucide-react';

const SettingsContainer = styled.div`
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

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #4CAF50;
  color: white;
  border: none;

  &:hover {
    background: #388E3C;
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SettingsCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: #E8F5E9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  color: #4CAF50;
  margin: 0;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  color: #64748b;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background-color: #4f5de3;
    }

    &:checked + span:before {
      transform: translateX(26px);
    }
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: .4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
`;

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    passwordExpiry: true
  });

  const [profile, setProfile] = useState({
    language: 'es',
    timezone: 'America/Mexico_City'
  });

  const handleToggle = (category: string, setting: string) => {
    if (category === 'notifications') {
      setNotifications(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      }));
    } else if (category === 'security') {
      setSecurity(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      }));
    }
  };

  return (
    <SettingsContainer>
      <Header>
        <Title>
          <SettingsIcon size={24} />
          Configuración
        </Title>
        <Button>
          <Save size={18} />
          Guardar Cambios
        </Button>
      </Header>

      <SettingsGrid>
        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Bell size={20} />
            </CardIcon>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <SettingItem>
            <SettingLabel>Notificaciones por Email</SettingLabel>
            <Toggle>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
              />
              <span />
            </Toggle>
          </SettingItem>
          <SettingItem>
            <SettingLabel>Notificaciones Push</SettingLabel>
            <Toggle>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
              />
              <span />
            </Toggle>
          </SettingItem>
          <SettingItem>
            <SettingLabel>Reporte Semanal</SettingLabel>
            <Toggle>
              <input
                type="checkbox"
                checked={notifications.weekly}
                onChange={() => handleToggle('notifications', 'weekly')}
              />
              <span />
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Lock size={20} />
            </CardIcon>
            <CardTitle>Seguridad</CardTitle>
          </CardHeader>
          <SettingItem>
            <SettingLabel>Autenticación de Dos Factores</SettingLabel>
            <Toggle>
              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={() => handleToggle('security', 'twoFactor')}
              />
              <span />
            </Toggle>
          </SettingItem>
          <SettingItem>
            <SettingLabel>Expiración de Contraseña</SettingLabel>
            <Toggle>
              <input
                type="checkbox"
                checked={security.passwordExpiry}
                onChange={() => handleToggle('security', 'passwordExpiry')}
              />
              <span />
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <CardIcon>
              <Globe size={20} />
            </CardIcon>
            <CardTitle>Preferencias</CardTitle>
          </CardHeader>
          <SettingItem>
            <SettingLabel>Idioma</SettingLabel>
            <select
              value={profile.language}
              onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                color: '#111936'
              }}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </SettingItem>
          <SettingItem>
            <SettingLabel>Zona Horaria</SettingLabel>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                color: '#111936'
              }}
            >
              <option value="America/Mexico_City">Ciudad de México</option>
              <option value="America/New_York">Nueva York</option>
            </select>
          </SettingItem>
        </SettingsCard>
      </SettingsGrid>
    </SettingsContainer>
  );
} 