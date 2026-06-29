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

| Переменная     | Значение           |
|----------------|--------------------|
| `DATABASE_URL` | pooled строка Neon |

Используйте **Pooled connection** из Neon (хост с `-pooler`). В конце строки достаточно `?sslmode=require` — без `channel_binding`.

3. Deploy (или **Redeploy** после изменения переменных).

При сборке Vercel выполнит `prisma generate` и `next build`. Миграции на Neon применяются локально (`npx prisma migrate deploy`), не на Vercel.

### 3. Первичное наполнение (один раз)

После успешного деплоя выполните seed **с вашего компьютера**, если база ещё пустая (у вас seed уже применён к Neon):

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

Затем на своём компьютере: `npx prisma migrate deploy` с production `DATABASE_URL` в `.env`, затем push — Vercel пересоберёт приложение.

## Важно

- Файл SQLite `prisma/dev.db` больше не используется — только PostgreSQL.
- `.env` в git не попадает; на Vercel переменные задаются в панели.
- Юридические документы лежат в `public/legal/` и раздаются как статика.
