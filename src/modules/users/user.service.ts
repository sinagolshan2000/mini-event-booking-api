import { db } from '../../db/lowdb';
import { User } from '../../db/schema';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { Paginator } from '../../utilities/paginators';


export class UserService {
    static async create(userData: Pick<User, 'email' | 'password'>): Promise<User> {
        await db.read();
        userData.password = await bcrypt.hash(userData.password, 10);
        const user: User = { id: nanoid(), is_admin: false, token: '', description: '', ...userData };
        db.data!.users.push(user);
        await db.write();
        return user;
    }


    static async list({ page = 1, limit = 10}: { page?: number; limit?: number;}) {
        await db.read();
        const users = db.data!.users.map(
            ({ id, email, description }) => ({
                id,
                email,
                description,
            })
        );

        const paginator = new Paginator(users, page, limit);
        return paginator.toJSON();
    }


    static async getById(id: string) {
        console.log("\n\n\n\n")
        console.log(id)
        console.log("\n\n\n\n")
        await db.read();
        const user = db.data!.users.find(u => u.id === id);
        if (!user) return null;
        return {
            id: user!.id,
            email: user!.email,
            description: user!.description,
        }
    }

    static async getByEmail(email: string) {
        await db.read();
        return db.data!.users.find(u => u.email === email);
    }

    static async update(id: string, updates: Pick<User, 'description'>) {
        await db.read();
        const user = db.data!.users.find(u => u.id === id);
        if (!user) return null;
        Object.assign(user, updates);
        await db.write();
        return user;
    }


    static async delete(id: string) {
        await db.read();
        const idx = db.data!.users.findIndex(u => u.id === id);
        if (idx === -1) return false;
        db.data!.users.splice(idx, 1);
        await db.write();
        return true;
    }
}