# Usa una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo en /app
WORKDIR /dist

# Copia el archivo package.json y package-lock.json a /app
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente de la aplicación a /app
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3500

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
