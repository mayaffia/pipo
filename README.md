# Task Management System

Полнофункциональная система управления задачами с backend на Node.js (TypeScript) и frontend на React (TypeScript).

## Требования проекта

### Группа 1 (4 балла)

- ✅ Приложение поддерживает аутентификацию пользователей и контроль доступа к API.
- ✅ Приложение имеет gRPC или HTTP API (минимум четыре бизнес-метода: создание,
  получение, изменение, удаление).
- ✅ Все сервисы и API покрыты тестами (unit и функциональными).
- ✅ PПриложение использует внешнюю БД для хранения пользователей и бизнес-
  информации.
- ✅ Схема базы данных создаётся при запуске или деплое приложения, поддерживается
  версионирование схемы.
- ✅ Схема базы данных отражается в код при сборке. Несоответствие ORM-моделей,
  запросов и схемы приводит к ошибке сборки.

### Группа 2 (2 балла)

- ✅ Приложение поддерживает логирование.
- ✅ Приложение поддерживает метрики.
- ❌ Приложение может быть запущено в Kubernetes (приложение, БД, логирование,
  балансировщик и сервис).
- ❌ Поддерживается сборка логов приложения и всех взаимодействующих с приложением
  инфраструктурных объектов в Kubernetes.

### Группа 3 (1 балл)

- ❌ Каждый коммит в мастер-ветку собирается при помощи CI/CD системы. В случае
  ошибочной сборки об этом сигнализируется каким-либо образом (плашка на GitHub,
  нотификация в чат-бот).
- ✅ По всем API-методам есть Swagger-документация, доступная из приложения.

Итого: 7 баллов

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
