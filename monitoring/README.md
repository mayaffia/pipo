# Мониторинг с Prometheus и Grafana

Эта директория содержит конфигурацию для запуска Prometheus и Grafana для мониторинга Task Management API.

## Быстрый старт

### Шаг 1: Запустите основное приложение

```bash
# В корневой директории проекта
docker-compose up -d
```

Это запустит:

- Backend API на порту 8000
- Frontend на порту 3000
- PostgreSQL на порту 5432

### Шаг 2: Запустите мониторинг

```bash
# Перейдите в директорию monitoring
cd monitoring

# Запустите Prometheus и Grafana
docker-compose -f docker-compose-monitoring.yml up -d
```

Это запустит:

- **Prometheus** на порту 9090
- **Grafana** на порту 3001

### Шаг 3: Проверьте что все работает

**Проверка метрик backend:**

```bash
curl http://localhost:8000/metrics
```

**Проверка Prometheus:**

```bash
open http://localhost:9090
```

**Проверка Grafana:**

```bash
open http://localhost:3001
```

---

## Доступ к сервисам

| Сервис          | URL                           | Логин | Пароль |
| --------------- | ----------------------------- | ----- | ------ |
| Backend API     | http://localhost:8000         | -     | -      |
| Backend Metrics | http://localhost:8000/metrics | -     | -      |
| Prometheus      | http://localhost:9090         | -     | -      |
| Grafana         | http://localhost:3001         | admin | admin  |

---

## Настройка Grafana

### 1. Войдите в Grafana

```
URL: http://localhost:3001
Логин: admin
Пароль: admin
```

При первом входе Grafana попросит сменить пароль (можно пропустить).

### 2. Добавьте Prometheus как источник данных

1. Нажмите на ⚙️ (Configuration) → Data Sources
2. Нажмите "Add data source"
3. Выберите "Prometheus"
4. Заполните:
   - **Name**: Prometheus
   - **URL**: `http://prometheus:9090`
5. Нажмите "Save & Test"
6. Должно появиться "Data source is working"

### 3. Создайте дашборд

#### Панель 1: Количество HTTP запросов

1. Нажмите + → Create Dashboard → Add new panel
2. В Query введите:

```promql
sum(rate(http_requests_total[5m])) by (method, route)
```

3. Настройте:
   - **Title**: HTTP Requests Rate
   - **Visualization**: Time series
   - **Legend**: {{method}} {{route}}
4. Нажмите Apply

#### Панель 2: Средняя длительность запросов

1. Add panel
2. Query:

```promql
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

3. Настройте:
   - **Title**: Average Request Duration
   - **Unit**: seconds (s)
   - **Visualization**: Time series
4. Apply

#### Панель 3: Задачи по статусам

1. Add panel
2. Query:

```promql
tasks_total
```

3. Настройте:
   - **Title**: Tasks by Status
   - **Visualization**: Stat или Pie chart
   - **Legend**: {{status}}
4. Apply

#### Панель 4: Процент ошибок

1. Add panel
2. Query:

```promql
rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100
```

3. Настройте:
   - **Title**: Error Rate
   - **Unit**: percent (0-100)
   - **Thresholds**:
     - Green: 0-1%
     - Yellow: 1-5%
     - Red: >5%
4. Apply

#### Панель 5: Количество пользователей

1. Add panel
2. Query:

```promql
users_total
```

3. Настройте:
   - **Title**: Total Users
   - **Visualization**: Stat
4. Apply

### 4. Сохраните дашборд

1. Нажмите 💾 (Save dashboard)
2. Введите имя: "Task Management API"
3. Save

---

## Полезные Prometheus запросы

### HTTP метрики

```promql
# Количество запросов в секунду
rate(http_requests_total[1m])

# Количество запросов в минуту
rate(http_requests_total[1m]) * 60

# Запросы по методам
sum(rate(http_requests_total[5m])) by (method)

# Запросы по маршрутам
sum(rate(http_requests_total[5m])) by (route)

# Запросы по статус кодам
sum(rate(http_requests_total[5m])) by (status_code)
```

### Длительность запросов

```promql
# Средняя длительность
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# 95-й перцентиль
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# 99-й перцентиль
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

### Бизнес метрики

```promql
# Общее количество задач
sum(tasks_total)

# Задачи по статусам
tasks_total{status="todo"}
tasks_total{status="in_progress"}
tasks_total{status="done"}

# Процент выполненных задач
tasks_total{status="done"} / sum(tasks_total) * 100

# Количество пользователей
users_total
```

### Ошибки

```promql
# Процент ошибок 5xx
rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# Количество ошибок 5xx в минуту
rate(http_requests_total{status_code=~"5.."}[1m]) * 60

# Количество ошибок 4xx в минуту
rate(http_requests_total{status_code=~"4.."}[1m]) * 60
```

---

## Остановка и очистка

### Остановить мониторинг

```bash
cd monitoring
docker-compose -f docker-compose-monitoring.yml down
```

### Остановить с удалением данных

```bash
cd monitoring
docker-compose -f docker-compose-monitoring.yml down -v
```

### Остановить все (приложение + мониторинг)

```bash
# Остановить мониторинг
cd monitoring
docker-compose -f docker-compose-monitoring.yml down

# Остановить приложение
cd ..
docker-compose down
```

---

## Troubleshooting

### Prometheus не может подключиться к backend

**Проблема:** `connection refused` при попытке scrape метрик

**Решение:**

1. Убедитесь что backend запущен:

```bash
curl http://localhost:8000/health
```

2. Проверьте что метрики доступны:

```bash
curl http://localhost:8000/metrics
```

3. Если используете Docker Desktop на Mac/Windows, убедитесь что в `prometheus.yml` используется `host.docker.internal`:

```yaml
targets: ["host.docker.internal:8000"]
```

### Grafana не может подключиться к Prometheus

**Проблема:** `Bad Gateway` при добавлении data source

**Решение:**

1. Убедитесь что Prometheus запущен:

```bash
docker ps | grep prometheus
```

2. В Grafana используйте URL: `http://prometheus:9090` (имя контейнера, не localhost)

### Метрики не обновляются

**Проблема:** Старые данные в Grafana

**Решение:**

1. Проверьте что backend генерирует метрики:

```bash
# Сделайте несколько запросов
curl http://localhost:8000/api/tasks

# Проверьте метрики
curl http://localhost:8000/metrics | grep http_requests_total
```

2. Проверьте что Prometheus собирает метрики:
   - Откройте http://localhost:9090
   - Status → Targets
   - Убедитесь что target "UP"

3. В Grafana обновите временной диапазон (Last 5 minutes)

---

## Архитектура мониторинга

```
┌─────────────────────────────────────────────────────────┐
│                    Пользователь                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Grafana :3001       │  Визуализация
         │   (Дашборды)          │
         └───────────┬───────────┘
                     │ PromQL запросы
                     ▼
         ┌───────────────────────┐
         │   Prometheus :9090    │  Сбор метрик
         │   (Time Series DB)    │
         └───────────┬───────────┘
                     │ HTTP GET /metrics каждые 15s
                     ▼
         ┌───────────────────────┐
         │   Backend API :8000   │  Генерация метрик
         │   /metrics endpoint   │
         └───────────────────────┘
```

---

## Дополнительные ресурсы

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
