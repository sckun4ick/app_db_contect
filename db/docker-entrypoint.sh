#!/bin/bash
set -e

PG_DATA=/var/lib/postgresql/data
PG_BIN=/usr/lib/postgresql/16/bin

# 1. Создаём директорию и назначаем права
mkdir -p "$PG_DATA"
chown -R postgres:postgres "$PG_DATA"

# 2. Инициализация кластера
if [ ! -s "$PG_DATA/PG_VERSION" ]; then
    echo "Инициализация базы данных..."
    su postgres -c "$PG_BIN/initdb -D $PG_DATA"
    
    # Настраиваем PostgreSQL на приём внешних подключений
    echo "listen_addresses = '*'" >> "$PG_DATA/postgresql.conf"
    echo "host all all 0.0.0.0/0 md5" >> "$PG_DATA/pg_hba.conf"
    echo "Настройки для внешних подключений добавлены"
fi

# 3. Временный запуск для создания базы и выполнения init.sql
echo "Временный запуск PostgreSQL для инициализации..."
su postgres -c "$PG_BIN/pg_ctl -D $PG_DATA -w start"

# 4. Создаём базу данных app_db
echo "Создание базы данных app_db..."
su postgres -c "psql -c 'CREATE DATABASE app_db;'"

# 5. Выполнение init.sql в базе app_db
if [ -f /docker-entrypoint-initdb.d/init.sql ]; then
    echo "Выполняется init.sql..."
    su postgres -c "psql -d app_db -f /docker-entrypoint-initdb.d/init.sql"
fi

# 6. Остановка
su postgres -c "$PG_BIN/pg_ctl -D $PG_DATA -m fast -w stop"

# 7. Основной запуск
echo "Запуск PostgreSQL в основном режиме..."
exec su postgres -c "$PG_BIN/postgres -D $PG_DATA"