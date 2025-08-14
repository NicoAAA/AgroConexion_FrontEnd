// interface (Modelo o especie de plano que las instancias deben seguir)

// Modelo para el usuario
export interface User {
  username: string;
  email: string;
  userImage: string;
  userName: string;
  userEmail: string;
  isSeller: boolean;
  isBuyer: boolean;
  address?: string;
  phone_number?: string;
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
  access: string;
  refresh: string;
  userImage: string;
  userName: string;
  userEmail: string;
  isSeller: boolean;
  isBuyer: boolean;
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