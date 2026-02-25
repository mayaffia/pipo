FROM node:20-alpine AS builder

WORKDIR /app

# Копирование package files
COPY package*.json ./
COPY tsconfig.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY src ./src

# Сборка приложения
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Копирование package files и tsconfig
COPY package*.json ./
COPY tsconfig.json ./

# Установка всех зависимостей (включая typeorm для миграций)
RUN npm ci

# Копирование исходного кода (нужен для миграций)
COPY src ./src

# Копирование собранного приложения
COPY --from=builder /app/dist ./dist

# Создание непривилегированного пользователя
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Создание директории для логов
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8000

CMD ["node", "dist/server.js"]