# Тесты Backend

## Покрытие тестами

Тесты покрывают:

### Unit тесты

- **AuthService**: Регистрация, вход, хеширование паролей, генерация JWT токенов
- **TaskService**: CRUD операции, фильтрация задач, изоляция данных пользователей

### Интеграционные тесты

- **Auth API**: Регистрация пользователей, вход, middleware аутентификации
- **Task API**: CRUD операции с задачами, авторизация, валидация данных
- **Безопасность**: Изоляция данных пользователей, предотвращение неавторизованного доступа

## Тестовая база данных

Интеграционные тесты используют ту же конфигурацию базы данных, что и для разработки, но очищают данные перед каждым тестом для обеспечения изоляции.

## Мониторинг и наблюдаемость

### Логирование (Winston)

Приложение использует Winston для структурированного логирования. Логи записываются в:

- **Консоль**
- **Файлы**:
  - `logs/error.log` - Только логи уровня error
  - `logs/combined.log` - Все логи

**Уровни логов:**

- `error` - Сообщения об ошибках
- `warn` - Предупреждения
- `info` - Информационные сообщения
- `debug` - Отладочные сообщения

**Пример использования:**

```typescript
import { logger } from '../utils/logger';

// Info лог
logger.info('Пользователь вошел в систему', { userId: user.id, email: user.email });

// Error лог
logger.error('Ошибка подключения к БД', {
  error: err.message,
  stack: err.stack,
});

// Debug лог
logger.debug('Обработка запроса', {
  method: req.method,
  path: req.path,
});
```

**Формат логов:**

```json
{
  "level": "info",
  "message": "Пользователь вошел в систему",
  "userId": "123",
  "email": "user@example.com",
  "timestamp": "2024-01-15 10:30:00",
  "service": "task-management-api"
}
```

**Конфигурация:**

```typescript
// backend/src/utils/logger.ts
export const logger = winston.createLogger({
  level: config.logging.level, // Из переменных окружения
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

**Просмотр логов:**

```bash
# Все логи
tail -f logs/combined.log

# Только ошибки
tail -f logs/error.log

# Docker логи
docker-compose logs -f backend

# Фильтрация по уровню
cat logs/combined.log | grep '"level":"error"'
```

### Метрики (Prometheus)

Приложение предоставляет метрики Prometheus на эндпоинте `/metrics`.

**Доступные метрики:**

1. **Длительность HTTP запросов** (Histogram)

   ```
   http_request_duration_seconds{method="GET",route="/api/tasks",status_code="200"}
   ```

   Отслеживает время выполнения каждого запроса

2. **Общее количество HTTP запросов** (Counter)

   ```
   http_requests_total{method="POST",route="/api/tasks",status_code="201"}
   ```

   Подсчитывает общее количество запросов

3. **Длительность запросов к БД** (Histogram)

   ```
   db_query_duration_seconds{operation="findOne"}
   ```

   Отслеживает производительность запросов к базе данных

4. **Активные подключения к БД** (Gauge)

   ```
   db_connections_active
   ```

   Текущее количество активных подключений к БД

5. **Общее количество задач** (Gauge)

   ```
   tasks_total{status="todo"}
   tasks_total{status="in_progress"}
   tasks_total{status="done"}
   ```

   Общее количество задач по статусам

6. **Общее количество пользователей** (Gauge)
   ```
   users_total
   ```
   Общее количество зарегистрированных пользователей

**Пример использования:**

```typescript
import { httpRequestDuration, httpRequestTotal } from '../utils/metrics';

// Измерение длительности запроса
const start = Date.now();
// ... обработка запроса ...
const duration = (Date.now() - start) / 1000;
httpRequestDuration.labels(req.method, req.route.path, res.statusCode.toString()).observe(duration);

// Увеличение счетчика запросов
httpRequestTotal.labels(req.method, req.route.path, res.statusCode.toString()).inc();
```

**Доступ к метрикам:**

```bash
# Просмотр всех метрик
curl http://localhost:8000/metrics

# Пример вывода:
# HELP http_request_duration_seconds Длительность HTTP запросов в секундах
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",route="/api/tasks",status_code="200",le="0.1"} 45
http_request_duration_seconds_sum{method="GET",route="/api/tasks",status_code="200"} 2.3
http_request_duration_seconds_count{method="GET",route="/api/tasks",status_code="200"} 50

# HELP tasks_total Общее количество задач
# TYPE tasks_total gauge
tasks_total{status="todo"} 15
tasks_total{status="in_progress"} 8
tasks_total{status="done"} 23
```

**Конфигурация Prometheus:**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'task-management-api'
    static_configs:
      - targets: ['localhost:8000']
    scrape_interval: 15s
```

**Запросы для Grafana дашборда:**

```promql
# Средняя длительность запроса
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# Количество запросов в минуту
rate(http_requests_total[1m]) * 60

# Задачи по статусам
tasks_total

# Процент ошибок
rate(http_requests_total{status_code=~"5.."}[5m])
```
