# Инструкция по запуску проекта Task Management System

## Описание проекта

Полнофункциональная система управления задачами, соответствующая всем требованиям финального проекта НИС "Промышленная инженерия программного обеспечения" (10 баллов).

## Выполненные требования

### ✅ Группа 1 (4 балла)

1. **Аутентификация и контроль доступа** - JWT токены, middleware для защиты роутов
2. **HTTP API с CRUD** - Express.js с 4+ методами (create, read, update, delete)
3. **Тесты** - Jest для unit и интеграционных тестов
4. **PostgreSQL** - База данных для пользователей и задач
5. **Миграции БД** - TypeORM с версионированием схемы
6. **Генерация моделей** - TypeORM entities с декораторами

### ✅ Группа 2 (4 балла)

1. **Логирование** - Winston с JSON форматом
2. **Метрики** - Prometheus client на `/metrics`
3. **Kubernetes** - Полные манифесты (deployment, service, ingress)
4. **Сбор логов** - Централизованное логирование через Winston

### ✅ Группа 3 (2 балла)

1. **CI/CD** - GitHub Actions с автоматическими тестами и деплоем
2. **Swagger** - Автогенерация документации на `/api-docs`

## Структура проекта

```
task-management-system/
├── backend/              # Node.js + TypeScript + Express
├── frontend/             # React + TypeScript + Vite
├── k8s/                  # Kubernetes манифесты
├── .github/workflows/    # CI/CD pipeline
├── docker-compose.yml    # Локальная разработка
└── README.md
```

## Быстрый старт

### Вариант 1: Docker Compose (рекомендуется для начала)

1. **Установите зависимости:**

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

2. **Настройте переменные окружения:**

```bash
# Из корневой директории проекта
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# ИЛИ если вы уже в директории backend/frontend:
# cd backend
# cp .env.example .env
# cd ../frontend
# cp .env.example .env
```

3. **Запустите через Docker Compose:**

```bash
docker-compose up --build
```

4. **Откройте приложение:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/api-docs
- Prometheus метрики: http://localhost:8000/metrics

### Вариант 2: Локальная разработка

1. **Запустите PostgreSQL:**

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=taskpass \
  -e POSTGRES_DB=taskdb \
  -p 5432:5432 \
  postgres:15-alpine
```

2. **Backend:**

```bash
cd backend
npm install
cp .env.example .env
npm run migration:run
npm run dev
```

3. **Frontend:**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Вариант 3: Kubernetes

1. **Создайте namespace:**

```bash
kubectl apply -f k8s/namespace.yaml
```

2. **Примените все манифесты:**

```bash
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

3. **Проверьте статус:**

```bash
kubectl get pods -n task-system
kubectl get services -n task-system
```

4. **Добавьте в /etc/hosts:**

```
127.0.0.1 task-system.local
```

5. **Откройте:** http://task-system.local

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

### Линтеры

```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь (требует токен)

### Tasks (требуется аутентификация)

- `POST /api/tasks` - Создать задачу
- `GET /api/tasks` - Получить список задач
- `GET /api/tasks/:id` - Получить задачу
- `PUT /api/tasks/:id` - Обновить задачу
- `DELETE /api/tasks/:id` - Удалить задачу
- `GET /api/tasks/stats` - Статистика задач

### Monitoring

- `GET /health` - Health check
- `GET /metrics` - Prometheus метрики
- `GET /api-docs` - Swagger документация

## Примеры использования API

### Регистрация

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Вход

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Создание задачи

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Моя первая задача",
    "description": "Описание задачи",
    "priority": "high",
    "status": "todo"
  }'
```

## CI/CD

GitHub Actions автоматически:

1. Запускает линтеры (ESLint)
2. Запускает тесты (Jest)
3. Собирает Docker образы
4. Деплоит в Kubernetes (при push в main)

### Необходимые секреты в GitHub:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `KUBE_CONFIG` - Kubernetes config (base64)

## Мониторинг и логирование

### Логи

- Формат: JSON (Winston)
- Уровни: error, warn, info, debug
- Файлы: `logs/error.log`, `logs/combined.log`

### Метрики (Prometheus)

- HTTP запросы: `http_requests_total`, `http_request_duration_seconds`
- База данных: `db_query_duration_seconds`, `db_connections_active`
- Бизнес-метрики: `tasks_total`, `users_total`

### Просмотр метрик

```bash
curl http://localhost:8000/metrics
```

## Troubleshooting

### Backend не запускается

```bash
# Проверьте PostgreSQL
docker ps | grep postgres

# Проверьте логи
docker logs task-system-backend

# Проверьте переменные окружения
cat backend/.env
```

### Frontend не подключается к API

```bash
# Проверьте VITE_API_URL в frontend/.env
cat frontend/.env

# Должно быть: VITE_API_URL=http://localhost:8000/api
```

### Ошибки миграций

```bash
cd backend
npm run migration:revert  # Откатить последнюю миграцию
npm run migration:run     # Применить миграции
```

### Kubernetes pods не запускаются

```bash
# Проверьте статус
kubectl get pods -n task-system

# Посмотрите логи
kubectl logs -n task-system deployment/task-backend
kubectl logs -n task-system deployment/postgres

# Проверьте секреты
kubectl get secrets -n task-system
```

## Дополнительная информация

### Технологии

- **Backend**: Node.js 20, TypeScript 5, Express.js, TypeORM, PostgreSQL
- **Frontend**: React 18, TypeScript 5, Vite, Material-UI, React Router
- **DevOps**: Docker, Kubernetes, GitHub Actions, Prometheus

### Безопасность

- JWT токены с истечением срока действия
- Bcrypt для хеширования паролей
- Helmet для HTTP заголовков
- Rate limiting для защиты от DDoS
- CORS настроен для frontend

### Производительность

- Connection pooling для БД
- Индексы на часто используемых полях
- Кэширование статических файлов (nginx)
- Gzip compression

## Контакты и поддержка

Для вопросов и предложений создавайте Issues в репозитории проекта.

## Лицензия

MIT
