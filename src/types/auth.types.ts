// Modelo para el usuario
export interface User {
  id: number
  username: string;
  email: string;
  profile_image: string;
  userName: string;
  userEmail: string;
  is_seller: boolean;
  address?: string;
  phone_number?: string;
  group_profile?: GroupProfile
}

export interface GroupProfile{
  nit: string,
  organization_type: string,
  legal_representative: string,
  representative_cedula: string,
  image_cedula: File | null
  rut_document: File | null
}

// Modelo para iniciar sesion
export interface LoginRequest {
  username: string;
  password: string;
}

// Modelo para registrar a un usrario
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
}

// Modelo de respuesta al iniciar sesion
export interface LoginResponse {
  id: number
  access: string;
  refresh: string;
  userImage: string;
  userName: string;
  userEmail: string;
  isSeller: boolean;
  message?: string
  email?:string
}

// Modelo de respuesta al registrar a un usuario
export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Modelo de formularios
export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

// Respuesta de errores cual sale algo mal
export interface ApiError {
  detail?: string;
  username?: string[];
  email?: string[];
  password?: string[];
  password2?: string[];
  non_field_errors?: string[];
}

// Tipo para verificar la cuenta
export type VerifyAccountProps = {
  email: string
  URL: string
} 
// tipo para enviar los datos a la hora de evrificar una cuenta
export type VerifyPayload = {
  email: string
  code: number
}

// tipo para actualizar contraseÑa
export type NewPassword = {
    email: string
    code: number
    new_password: string
    new_password2: string
}

// tipo para recuperaciuon de contraseña
export type LostPassword = {
    email: string
}

// Tipo para registrar una agrupacion
export type RegisterAgroup = {
    username: string
    email: string
    password: string
    password2: string
    phone_number: string
    address: string
    profile_image: File | null
    group_profile: GroupProfile | null
}