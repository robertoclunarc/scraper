#!/bin/bash

# Agrega esta línea para cargar nvm y configurar el entorno de Node.js
source ~/.nvm/nvm.sh

# Navega al directorio donde se encuentra tu aplicación
cd /var/www/scraper

# Instala las dependencias (si es necesario)
# Esto asume que tu proyecto utiliza npm como gestor de paquetes
npm install

# Compila tu aplicacion
npm run build