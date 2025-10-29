# syntax=docker/dockerfile:1.6
FROM node:20-alpine

WORKDIR /app

# Instala dependencias primero para aprovechar cache
COPY package.json ./
RUN npm install

COPY . ./app

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
