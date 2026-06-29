# Центр IT Карьеры — платформа обучения

Next.js 16 + Prisma + PostgreSQL.

## Локальный запуск

1. Создайте базу в [Neon](https://neon.tech) (бесплатный тариф подходит).
2. Скопируйте `.env.example` в `.env` и вставьте строки подключения из Neon:
   - **DATABASE_URL** — pooled connection (`-pooler` в хосте)
   - **DIRECT_URL** — direct connection (без pooler)
3. Установите зависимости и примените схему:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Демо-доступ после seed

- Админ: `admin@career-center.ru` / `admin12345`
- Ученик: `student@career-center.ru` / `client12345`

## Деплой на Vercel + Neon

### 1. База Neon

1. [neon.tech](https://neon.tech) → New Project → регион ближе к пользователям.
2. В **Connection details** скопируйте:
   - **Pooled** → `DATABASE_URL`
   - **Direct** → `DIRECT_URL`

### 2. Репозиторий на Vercel

1. [vercel.com](https://vercel.com) → Import Git Repository → `ITschool`.
2. **Environment Variables** (Production, Preview, Development):

| Переменная    | Значение              |
|---------------|------------------------|
| `DATABASE_URL` | pooled строка Neon    |
| `DIRECT_URL`   | direct строка Neon    |

3. Deploy.

При сборке Vercel выполнит `prisma migrate deploy` (создаст таблицы) и `next build`.

### 3. Первичное наполнение (один раз)

После успешного деплоя выполните seed **с вашего компьютера**, подставив production `DATABASE_URL` и `DIRECT_URL`:

```bash
npm run db:seed
```

Либо временно пропишите production URL в локальный `.env`, выполните seed, верните dev-URL.

### 4. Обновления схемы

После изменений в `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name описание_изменения
git add prisma/migrations
git commit -m "Add migration ..."
git push
```

Vercel при следующем деплое применит миграции автоматически.

## Важно

- Файл SQLite `prisma/dev.db` больше не используется — только PostgreSQL.
- `.env` в git не попадает; на Vercel переменные задаются в панели.
- Юридические документы лежат в `public/legal/` и раздаются как статика.
