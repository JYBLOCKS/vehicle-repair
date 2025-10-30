# syntax=docker/dockerfile:1.6
FROM node:20-alpine

WORKDIR /app

# Habilitar Corepack y usar pnpm con lockfile para instalaciones reproducibles
COPY package.json pnpm-lock.yaml ./
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable \
 && corepack prepare pnpm@9.12.2 --activate
RUN pnpm install --frozen-lockfile

# Copiar el resto del código (el montaje por volumen en docker-compose seguirá funcionando en desarrollo)
COPY . ./app

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
