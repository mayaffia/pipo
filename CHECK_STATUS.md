# ✅ Как проверить, что backend запущен

## Способ 1: Проверка через curl (в терминале)

```bash
curl http://localhost:8000/health
```

**Если backend работает**, вы увидите:

```json
{ "status": "ok", "timestamp": "2024-01-01T12:00:00.000Z" }
```

**Если backend НЕ работает**, вы увидите:

```
curl: (7) Failed to connect to localhost port 8000: Connection refused
```

## Способ 2: Проверка в браузере

Откройте в браузере: **http://localhost:8000/health**

**Если работает** - увидите JSON:

```json
{ "status": "ok", "timestamp": "..." }
```

**Если НЕ работает** - увидите ошибку "Не удается получить доступ к сайту"

## Способ 3: Проверка Swagger документации

Откройте: **http://localhost:8000/api-docs**

**Если работает** - увидите интерактивную документацию API

## Способ 4: Проверка метрик

```bash
curl http://localhost:8000/metrics
```

Должны увидеть метрики Prometheus (много текста)

## Способ 5: Проверка процесса

```bash
# Проверьте, что процесс слушает порт 8000
lsof -i :8000
```

**Если работает**, увидите что-то вроде:

```
COMMAND   PID    USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345  mayaffia   23u  IPv6  0x...      0t0  TCP *:8000 (LISTEN)
```

## Способ 6: Проверка логов в терминале

Посмотрите в терминал, где запускали `npm run dev`. Должны видеть:

```
[timestamp] [info]: Server is running on port 8000
[timestamp] [info]: Environment: development
[timestamp] [info]: Swagger docs available at http://localhost:8000/api-docs
```

## Что делать, если backend НЕ запущен?

### 1. Проверьте, что вы в правильной директории:

```bash
pwd
# Должно быть: /Users/mayaffia/Desktop/pipo_project/backend
```

### 2. Проверьте, что зависимости установлены:

```bash
ls node_modules
# Должна быть папка с множеством пакетов
```

Если нет:

```bash
npm install
```

### 3. Проверьте, что PostgreSQL запущен:

```bash
# Если через Docker:
docker ps | grep postgres

# Если локально:
brew services list | grep postgresql
```

### 4. Проверьте .env файл:

```bash
cat .env
# Должны быть настройки БД
```

### 5. Попробуйте запустить заново:

```bash
npm run dev
```

## Полная проверка всех компонентов

```bash
# 1. Backend
curl http://localhost:8000/health

# 2. Frontend (откройте в браузере)
open http://localhost:3000

# 3. PostgreSQL
docker ps | grep postgres
# или
psql -U taskuser -d taskdb -c "SELECT 1"

# 4. Проверка портов
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # PostgreSQL
```

## Быстрая диагностика

Выполните эту команду для полной проверки:

```bash
echo "=== Backend ===" && \
curl -s http://localhost:8000/health && \
echo "\n=== Ports ===" && \
lsof -i :8000 && \
echo "\n=== PostgreSQL ===" && \
docker ps | grep postgres
```

## Ожидаемый результат при успешном запуске

```
=== Backend ===
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}

=== Ports ===
COMMAND   PID    USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345  mayaffia   23u  IPv6  0x...      0t0  TCP *:8000 (LISTEN)

=== PostgreSQL ===
abc123def456   postgres:15-alpine   "docker-entrypoint.s…"   5 minutes ago   Up 5 minutes   0.0.0.0:5432->5432/tcp   task-postgres
```

Если видите такой результат - **всё работает!** ✅
