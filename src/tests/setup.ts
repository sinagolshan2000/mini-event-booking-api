import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(__dirname, '../../db.json');
const SEED_FILE = path.join(__dirname, './db.seed.json');

export function resetDB() {
  const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
  fs.writeFileSync(DB_FILE, seedData);
}
