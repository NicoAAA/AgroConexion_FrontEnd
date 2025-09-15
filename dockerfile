# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Definimos directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias primero (para aprovechar cache)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el código del proyecto
COPY . .

# Construimos la aplicación ignorando ESLint
RUN npm run build --no-lint

# Etapa 2: Producción
FROM node:18-alpine AS runner

WORKDIR /app

# Copiamos solo lo necesario de la etapa anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Instalamos dependencias de producción
RUN npm install --only=production

# Exponemos el puerto que usa Next.js
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]

