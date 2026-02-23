# 🚀 Запуск проекта БЕЗ Docker

У вас не установлен Docker, поэтому запустим проект локально через Node.js.

## Требования

- Node.js 20+ (проверьте: `node --version`)
- PostgreSQL 15+ (или используем Docker только для БД)

## Вариант 1: PostgreSQL через Docker (рекомендуется)

Если Docker установлен, но не работает docker-compose:

```bash
# Запустите только PostgreSQL
docker run -d \
  --name task-postgres \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=taskpass \
  -e POSTGRES_DB=taskdb \
  -p 5432:5432 \
  postgres:15-alpine

# Проверьте, что запустился
docker ps | grep task-postgres
```

## Вариант 2: Установите PostgreSQL локально

### macOS (через Homebrew):

```bash
brew install postgresql@15
brew services start postgresql@15

# Создайте базу данных
createdb taskdb
```

### Настройка PostgreSQL:

```bash
# Подключитесь к PostgreSQL
psql postgres

# Создайте пользователя и базу
CREATE USER taskuser WITH PASSWORD 'taskpass';
CREATE DATABASE taskdb OWNER taskuser;
\q
```

## Запуск Backend

### 1. Перейдите в директорию backend

```bash
cd /Users/mayaffia/Desktop/pipo_project/backend
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Создайте .env файл

```bash
cp .env.example .env
```

### 4. Отредактируйте .env (если нужно)

```bash
# Откройте в редакторе
nano .env

# Или используйте значения по умолчанию:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=taskuser
# DB_PASSWORD=taskpass
# DB_DATABASE=taskdb
```

### 5. Запустите миграции

```bash
npm run migration:run
```

### 6. Запустите backend

```bash
npm run dev
```

Backend запустится на http://localhost:8000

**Оставьте этот терминал открытым!**

## Запуск Frontend

### 1. Откройте НОВЫЙ терминал

### 2. Перейдите в директорию frontend

```bash
cd /Users/mayaffia/Desktop/pipo_project/frontend
```

### 3. Установите зависимости

```bash
npm install
```

### 4. Создайте .env файл

```bash
cp .env.example .env
```

### 5. Запустите frontend

```bash
npm run dev
```

Frontend запустится на http://localhost:3000

## Проверка работы

### 1. Проверьте Backend

Откройте в браузере или выполните:

```bash
curl http://localhost:8000/health
```

Должно вернуть:

```json
{ "status": "ok", "timestamp": "..." }
```

### 2. Проверьте Frontend

Откройте в браузере: http://localhost:3000

### 3. Проверьте Swagger

Откройте: http://localhost:8000/api-docs

## Остановка приложения

В каждом терминале нажмите `Ctrl+C`

Чтобы остановить PostgreSQL (если через Docker):

```bash
docker stop task-postgres
docker rm task-postgres
```

## Частые проблемы

### "Cannot find module"

```bash
# Переустановите зависимости
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### "Port 5432 already in use"

```bash
# Найдите процесс
lsof -i :5432

# Остановите PostgreSQL
brew services stop postgresql@15
# или
docker stop task-postgres
```

### "Port 8000 already in use"

```bash
# Найдите и остановите процесс
lsof -i :8000
kill -9 <PID>
```

### "Connection refused" к PostgreSQL

```bash
# Проверьте, что PostgreSQL запущен
# Через Docker:
docker ps | grep postgres

# Локально:
brew services list | grep postgresql
```

## Установка Docker (опционально)

Если хотите использовать Docker в будущем:

### macOS:

1. Скачайте Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Установите и запустите
3. После установки команда `docker-compose` будет доступна

### Проверка установки:

```bash
docker --version
docker-compose --version
```

## Краткая шпаргалка

```bash
# Терминал 1 - Backend
cd /Users/mayaffia/Desktop/pipo_project/backend
npm run dev

# Терминал 2 - Frontend
cd /Users/mayaffia/Desktop/pipo_project/frontend
npm run dev

# Терминал 3 - PostgreSQL (если через Docker)
docker run -d --name task-postgres \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=taskpass \
  -e POSTGRES_DB=taskdb \
  -p 5432:5432 \
  postgres:15-alpine
```

## Готово! 🎉

Теперь у вас запущен полный проект:

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Swagger: http://localhost:8000/api-docs
- Метрики: http://localhost:8000/metrics
