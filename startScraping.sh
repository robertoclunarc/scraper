#!/bin/bash

# Obtiene la ubicación de la implementación actual
DEPLOYMENT_GROUP_NAME=$(curl https://54.167.26.168/latest/user-data/ -s | tr -d '\n' | sed 's/.*DEPLOYMENT_GROUP_NAME=//')

# Define la ruta de origen de la implementación actual
DEPLOYMENT_SOURCE="/opt/codedeploy-agent/deployment-root/$DEPLOYMENT_GROUP_NAME/"

# Copia los archivos de implementación a /var/www/scraper
cp -r "$DEPLOYMENT_SOURCE" /var/www/scraper/

# Agrega esta línea para cargar nvm y configurar el entorno de Node.js
source ~/.nvm/nvm.sh

# Navega al directorio donde se encuentra tu aplicación
cd /var/www/scraper

# Instala las dependencias (si es necesario)
# Esto asume que tu proyecto utiliza npm como gestor de paquetes
npm install

# Inicia tu aplicación
# Reemplaza "node index.js" con el comando real para iniciar tu aplicación
node index.js