import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db } from '../../db/lowdb';

export interface AuthUser {
  id: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser;
  }
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

const authPluginImpl: FastifyPluginAsync = async (app) => {
  // Login
  app.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as any;

    await db.read();
    const user = db.data?.users.find(u => u.email === email);
    if (!user) return reply.status(401).send({ message: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return reply.status(401).send({ message: 'Invalid credentials' });

    user.token = generateToken();
    await db.write();

    return reply.send({ token: user.token });
  });

  // GLOBAL auth hook
  app.addHook('preHandler', async (request, reply) => {
    if (request.url === '/health' || request.url === '/auth/login') return;

    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Missing authorization token' });
    }

    const token = auth.replace('Bearer ', '').trim();
    await db.read();

    const user = db.data?.users.find(u => u.token === token);
    if (!user) {
      return reply.status(401).send({ message: 'Invalid token' });
    }

    request.user = { id: user.id, email: user.email };
  });
};

export const authPlugin = fp(authPluginImpl);
