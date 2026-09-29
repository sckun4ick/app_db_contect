-- Создаём таблицу users в базе app_db
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fio VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Устанавливаем пароль для пользователя postgres
ALTER USER postgres WITH PASSWORD 'postgres';