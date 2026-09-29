# Docker2: React + PostgreSQL в двух контейнерах

## Описание проекта
Приложение для сбора данных пользователей (ФИО, телефон, email) через React-форму с сохранением в временную БД (JSON-файл) и PostgreSQL базу данных.

## Архитектура
Проект состоит из **двух Docker-контейнеров**:

1. **app_server** (порт 8080) — React-приложение + Node.js сервер
   - Отдаёт React-форму пользователю
   - Принимает данные через POST-запрос
   - Записывает данные в JSON-файл `latest_data.json` (перезаписывается при каждом вводе)
   - Отправляет данные в PostgreSQL

2. **db_server** (порт 5432) — PostgreSQL база данных
   - Хранит все записи в таблице `users`
   - Доступна для подключения через DBeaver

## Технологии
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16
- **Containerization**: Docker + Docker Compose

## Быстрый старт

### 1. Сборка и запуск
```bash
docker compose up -d --build