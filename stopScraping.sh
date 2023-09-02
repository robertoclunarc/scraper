#!/bin/bash

# Obtén el PID del proceso de Node.js (asumiendo que está en una variable de entorno)
NODE_PID=$NODE_PID

# Verifica si el PID está definido
if [ -z "$NODE_PID" ]; then
  echo "El PID del proceso Node.js no está definido."
  exit 1
fi

# Detén la aplicación utilizando el comando kill
kill $NODE_PID
