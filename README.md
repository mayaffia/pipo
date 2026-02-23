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
- ✅ Kubernetes манифесты (deployment, service, ingress)
- ✅ Централизованный сбор логов (EFK stack)

### Группа 3 (2 балла)

- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Swagger документация (swagger-jsdoc + swagger-ui-express)

## Технологический стек

### Backend

- **Runtime**: Node.js 20
- **Language**: TypeScript 5
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator, class-transformer
- **Logging**: Winston
- **Metrics**: prom-client
- **Testing**: Jest, Supertest
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)

### Frontend

- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Routing**: React Router
- **UI Components**: Material-UI (MUI)
- **Forms**: React Hook Form
- **Testing**: Vitest, React Testing Library

### Infrastructure

- **Container**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## Структура проекта

```
task-management-system/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # Конфигурация
│   │   ├── entities/          # TypeORM entities
│   │   ├── migrations/        # Database migrations
│   │   ├── controllers/       # API controllers
│   │   ├── services/          # Бизнес-логика
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Утилиты
│   │   ├── types/             # TypeScript types
│   │   └── app.ts             # Express app
│   ├── tests/                 # Тесты
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── pages/             # Страницы
│   │   ├── services/          # API клиенты
│   │   ├── context/           # React Context
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Утилиты
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── k8s/                        # Kubernetes манифесты
│   ├── backend/
│   ├── frontend/
│   ├── postgres/
│   └── ingress/
├── .github/workflows/          # CI/CD
├── docker-compose.yml
└── README.md
```

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

## Функциональность

### Backend

- JWT аутентификация с refresh tokens
- CRUD операции для задач
- Фильтрация и сортировка задач
- Валидация входных данных
- Обработка ошибок
- Логирование всех операций
- Метрики производительности
- Swagger документация

### Frontend

- Регистрация и вход пользователей
- Создание, редактирование, удаление задач
- Фильтрация задач по статусу и приоритету
- Поиск задач
- Адаптивный дизайн
- Обработка ошибок
- Индикаторы загрузки

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

### Frontend тесты

```bash
cd frontend
npm test                   # Все тесты
npm run test:coverage      # С покрытием
```

## Деплой в Kubernetes

```bash
# Создайте namespace
kubectl create namespace task-system

# Примените манифесты
kubectl apply -f k8s/

# Проверьте статус
kubectl get pods -n task-system
kubectl get services -n task-system
```

## CI/CD

GitHub Actions автоматически:

1. Запускает линтеры (ESLint, Prettier)
2. Запускает тесты
3. Собирает Docker образы
4. Деплоит в Kubernetes (при push в main)

## Переменные окружения

### Backend (.env)

```
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://taskuser:taskpass@localhost:5432/taskdb
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
LOG_LEVEL=info
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:8000/api
```

## Мониторинг

- **Логи**: Winston с JSON форматом
- **Метрики**: Prometheus метрики на `/metrics`
- **Health check**: `/health` endpoint
- **Swagger**: Интерактивная документация на `/api-docs`

## Лицензия

MIT
