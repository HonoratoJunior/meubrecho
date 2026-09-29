import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool(
  process.env.DATABASE_URL
    ? { 
        connectionString: process.env.DATABASE_URL, 
        ssl: { rejectUnauthorized: false } 
      }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'brecho_db',
        password: 'postgres',
        port: 5432,
      }
);

db.on('connect', () => {
  console.log('⚡ Banco de dados conectado com sucesso!');
});