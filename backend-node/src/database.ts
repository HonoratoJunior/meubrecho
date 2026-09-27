import { Pool } from 'pg';

export const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brecho_db',
  password: 'postgres',
  port: 5432,
});

db.on('connect', () => {
  console.log('⚡ Conectado ao banco de dados PostgreSQL (brecho_db)!');
});