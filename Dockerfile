# Imagen base ligera
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar resto del proyecto
COPY . .

# Exponer puerto
EXPOSE 3000

# Ejecutar app
CMD ["node", "app.js"]