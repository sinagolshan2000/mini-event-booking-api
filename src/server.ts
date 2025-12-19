import { buildApp } from './app';
import { initDB } from './db/lowdb';

async function start() {
  await initDB();

  const app = buildApp();

  await app.listen({ port: 3000, host: '0.0.0.0' });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
