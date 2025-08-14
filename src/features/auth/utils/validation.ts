// Libreria que nos permite validar datos de forma segura
import { z } from 'zod';

// Validacion del inicio de sesion
export const loginSchema = z.object({
  // Inidcamos que sera una cadena de al menos un caracter o mandara el mensaje de error
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  // Inidcamos que sera una cadena de al menos un caracter o mandara el mensaje de error
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Validacion del registro del usuario
export const registerSchema = z.object({
  // Inidcamos que sera una cadena de al menos un caracter o mandara el mensaje de error
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  // El email debe ser de formato valido
  email: z.string().email('Email inválido'),
  // Validaciones de la contraseña
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/\d/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Debe contener al menos un carácter especial'),
  password2: z.string().min(1, 'La confirmación de contraseña es requerida'),
}).refine((data) => data.password === data.password2, {
  message: 'Las contraseñas no coinciden',
  path: ['password2'],
});

// Indicamos los Modelos a utilizar para que zod losd extraiga automaticamente para lkas validaciones
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;