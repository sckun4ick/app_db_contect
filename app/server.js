import express from 'express';
import { Pool } from 'pg';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// Отдаем статические файлы React
app.use(express.static(path.join(__dirname, 'dist')));

// Настройка подключения к БД (имя хоста 'db' берется из docker-compose)
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'app_db',
});

const JSON_FILE_PATH = path.join(__dirname, 'latest_data.json');

app.post('/api/submit', async (req, res) => {
  const { fio, phone, email } = req.body;
  const data = { fio, phone, email, timestamp: new Date().toISOString() };

  try {
    // 1. Перезаписываем JSON-файл (хранение на одну итерацию с заменой)
    writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2));
    console.log('Данные записаны в latest_data.json');

    // 2. Отправляем данные в PostgreSQL
    await pool.query(
      'INSERT INTO users (fio, phone, email) VALUES ($1, $2, $3)',
      [fio, phone, email]
    );
    console.log('Данные отправлены в БД');

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fallback для React Router (если понадобится)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(8080, () => {
  console.log('App server running on http://localhost:8080');
});