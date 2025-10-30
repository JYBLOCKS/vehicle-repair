# syntax=docker/dockerfile:1.6
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable \
 && corepack prepare pnpm@9.12.2 --activate
RUN pnpm install --frozen-lockfile

COPY . ./app

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
