export interface UsuarioDto {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
}

export interface CrearUsuarioDto {
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  roleId: number;
}

export interface ActualizarUsuarioDto {
  name: string;
  phoneNumber: string;
  isActive: boolean;
} 

export interface UsuarioFormData {
    name: string;
    username: string;
    email: string;
    password?: string;
    phoneNumber: string;
    isActive: boolean;
    roleId: number;
  }