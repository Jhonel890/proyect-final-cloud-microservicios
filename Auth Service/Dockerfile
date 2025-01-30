# Usa Node.js como imagen base
FROM node:18

# Configuración de la carpeta de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala solo dependencias de producción
RUN npm install --omit=dev

# Copia el código fuente
COPY . .

# Expone el puerto donde correrá el servicio
EXPOSE 3001

# Comando para correr el servidor
CMD ["node", "./bin/www"]
