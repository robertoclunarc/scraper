#!/bin/bash

# Agrega esta línea para cargar nvm y configurar el entorno de Node.js
source ~/.nvm/nvm.sh

# Navega al directorio donde se encuentra tu aplicación
cd /var/www/scraper

# Instala las dependencias 
npm install

# Compilae la aplicacion
npm run build