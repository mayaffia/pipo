# Task Management System

Полнофункциональная система управления задачами с backend на Node.js (TypeScript) и frontend на React (TypeScript).

## Требования проекта

### Группа 1 (4 балла)

- ✅ Аутентификация пользователей и контроль доступа к API (JWT)
- ✅ HTTP REST API с CRUD операциями (создание, получение, изменение, удаление)
- ✅ Unit и функциональные тесты (Jest, Supertest)
- ✅ PostgreSQL для хранения данных
- ✅ Миграции БД с версионированием (TypeORM)
- ✅ Генерация моделей из схемы БД (TypeORM entities)

### Группа 2 (4 балла)

- ✅ Логирование (Winston)
- ✅ Метрики (Prometheus client)
- ❌ Kubernetes манифесты (deployment, service, ingress)
- ❌ Централизованный сбор логов (EFK stack)

### Группа 3 (2 балла)

- ❌ CI/CD pipeline (GitHub Actions)
- ✅ Swagger документация (swagger-jsdoc + swagger-ui-express)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход (получение JWT токена)
- `GET /api/auth/me` - Получение текущего пользователя

### Tasks (требуется аутентификация)

- `POST /api/tasks` - Создание задачи
- `GET /api/tasks` - Получение списка задач
- `GET /api/tasks/:id` - Получение задачи по ID
- `PUT /api/tasks/:id` - Обновление задачи
- `DELETE /api/tasks/:id` - Удаление задачи

### Monitoring

- `GET /metrics` - Prometheus метрики
- `GET /health` - Health check
- `GET /api-docs` - Swagger UI

## Быстрый старт

### Локальная разработка

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd task-management-system
```

2. Запустите через Docker Compose:

```bash
docker-compose up --build
```

3. Откройте приложение:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/api-docs
- Metrics: http://localhost:8000/metrics

### Backend разработка

```bash
cd backend
npm install
npm run dev
```

### Frontend разработка

```bash
cd frontend
npm install
npm run dev
```

## Тестирование

### Backend тесты

```bash
cd backend
npm test                    # Все тесты
npm run test:unit          # Unit тесты
npm run test:integration   # Интеграционные тесты
npm run test:coverage      # С покрытием
```
