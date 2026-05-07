# Etapa de construcción
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --omit=dev

# Copiar código de la aplicación
COPY . .

# Etapa de ejecución
FROM node:18-alpine

# Crear usuario no privilegiado
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Directorio de trabajo
WORKDIR /app

# Copiar aplicación desde builder
COPY --from=builder /app ./

# Asignar permisos
RUN chown -R appuser:appgroup /app

# Usar usuario no-root
USER appuser

# Exponer puerto de la aplicación
EXPOSE 3000

# Variable de entorno de producción
ENV NODE_ENV=production

# Iniciar aplicación
CMD ["node", "app.js"]