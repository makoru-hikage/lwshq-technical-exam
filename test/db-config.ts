import dotenv from 'dotenv';

dotenv.config();

export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'test_todo_local',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || ''
  }
}