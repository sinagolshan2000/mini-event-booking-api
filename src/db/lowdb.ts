import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { DatabaseSchema } from './schema';


const file = path.join(process.cwd(), 'db.json');
const adapter = new JSONFile<DatabaseSchema>(file);


export const db = new Low<DatabaseSchema>(adapter, {
    events: [],
    bookings: [],
    users: []
});


export async function initDB() {
    await db.read();
    db.data ||= { events: [], bookings: [], users: [] };

    // Seed default user if none exists
    if (db.data.users.length === 0) {
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash('password123', 10);
        db.data.users.push({
            id: 'user-0',
            email: 'admin@example.com',
            password: hash,
            token: '',
            is_admin: true,
            description: 'Admin user'
        });
        db.data.users.push({
            id: 'user-1',
            email: 'user@example.com',
            password: hash,
            token: '',
            is_admin: false,
            description: 'some user description'
        });
        db.data.users.push({
            id: 'user-2',
            email: 'user2@example.com',
            password: hash,
            token: '',
            is_admin: false,
            description: 'some user description'
        });
    }

    await db.write();
}