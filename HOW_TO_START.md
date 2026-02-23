# 🚀 ПОШАГОВАЯ ИНСТРУКЦИЯ ДЛЯ ЗАПУСКА

Backend не запущен. Следуйте этим шагам **ТОЧНО В ТАКОМ ПОРЯДКЕ**:

## Шаг 1: Проверьте Node.js

```bash
node --version
```

Должно показать версию 18+ или 20+. Если нет - установите Node.js:
https://nodejs.org/

## Шаг 2: Запустите PostgreSQL

### Вариант A: Через Docker (если есть команда docker)

```bash
docker run -d \
  --name task-postgres \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=taskpass \
  -e POSTGRES_DB=taskdb \
  -p 5432:5432 \
  postgres:15-alpine
```

Проверьте:

```bash
docker ps | grep task-postgres
```

### Вариант B: Через Homebrew (если нет Docker)

```bash
# Установите PostgreSQL
brew install postgresql@15

# Запустите
brew services start postgresql@15

# Создайте пользователя и базу
psql postgres << EOF
CREATE USER taskuser WITH PASSWORD 'taskpass';
CREATE DATABASE taskdb OWNER taskuser;
GRANT ALL PRIVILEGES ON DATABASE taskdb TO taskuser;
EOF
```

## Шаг 3: Перейдите в директорию backend

```bash
cd /Users/mayaffia/Desktop/pipo_project/backend
```

Проверьте, что вы в правильном месте:

```bash
pwd
# Должно показать: /Users/mayaffia/Desktop/pipo_project/backend

ls package.json
# Должно показать: package.json
```

## Шаг 4: Установите зависимости

```bash
npm install
```

Это займет 1-2 минуты. Дождитесь завершения!

## Шаг 5: Создайте .env файл

```bash
cp .env.example .env
```

Проверьте, что файл создан:

```bash
cat .env
```

Должны увидеть настройки базы данных.

## Шаг 6: Запустите миграции базы данных

```bash
npm run migration:run
```

Если увидите ошибку "Cannot find module", выполните:

```bash
npm install
npm run migration:run
```

## Шаг 7: Запустите backend

```bash
npm run dev
```

**НЕ ЗАКРЫВАЙТЕ ЭТОТ ТЕРМИНАЛ!**

Вы должны увидеть:

```
[timestamp] [info]: Database connection established
[timestamp] [info]: Server is running on port 8000
[timestamp] [info]: Environment: development
[timestamp] [info]: Swagger docs available at http://localhost:8000/api-docs
```

## Шаг 8: Проверьте, что backend работает

**Откройте НОВЫЙ терминал** (не закрывая предыдущий!) и выполните:

```bash
curl http://localhost:8000/health
```

Должны увидеть:

```json
{ "status": "ok", "timestamp": "..." }
```

## Шаг 9: Откройте Swagger в браузере

Откройте: **http://localhost:8000/api-docs**

Должны увидеть интерактивную документацию API.

## ✅ Backend запущен!

Теперь можно запустить Frontend (в новом терминале):

```bash
cd /Users/mayaffia/Desktop/pipo_project/frontend
npm install
cp .env.example .env
npm run dev
```

Frontend будет на: **http://localhost:3000**

---

## 🔴 Если что-то пошло не так

### Ошибка: "Cannot find module"

```bash
cd /Users/mayaffia/Desktop/pipo_project/backend
rm -rf node_modules package-lock.json
npm install
```

### Ошибка: "Port 8000 already in use"

```bash
# Найдите процесс
lsof -i :8000

# Остановите его (замените PID на номер из предыдущей команды)
kill -9 <PID>
```

### Ошибка: "Connection refused" к PostgreSQL

PostgreSQL не запущен. Вернитесь к Шагу 2.

Проверьте:

```bash
# Если через Docker:
docker ps | grep postgres

# Если через Homebrew:
brew services list | grep postgresql
```

### Ошибка: "ENOENT: no such file or directory"

Вы не в директории backend. Выполните:

```bash
cd /Users/mayaffia/Desktop/pipo_project/backend
pwd  # Проверьте путь
```

### Backend запускается, но сразу падает

Посмотрите логи в терминале. Обычно проблема в PostgreSQL.

Проверьте настройки в .env:

```bash
cat .env
```

Должно быть:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=taskuser
DB_PASSWORD=taskpass
DB_DATABASE=taskdb
```

---

## 📋 Краткая шпаргалка (после первого запуска)

```bash
# Терминал 1 - PostgreSQL (если через Docker)
docker start task-postgres

# Терминал 2 - Backend
cd /Users/mayaffia/Desktop/pipo_project/backend
npm run dev

# Терминал 3 - Frontend
cd /Users/mayaffia/Desktop/pipo_project/frontend
npm run dev
```

---

## 🆘 Нужна помощь?

1. Проверьте, что Node.js установлен: `node --version`
2. Проверьте, что PostgreSQL запущен: `docker ps` или `brew services list`
3. Проверьте, что вы в правильной директории: `pwd`
4. Проверьте логи в терминале, где запускали `npm run dev`

Если ничего не помогает, начните заново с Шага 1.
