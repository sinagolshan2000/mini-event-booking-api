import { FastifyPluginAsync } from 'fastify';
import { UserService } from './user.service';
import { UserUpdateInput, UserQuery } from './user.schema';


export const userRoutes: FastifyPluginAsync = async (app) => {
    app.get('/users', { schema: { querystring: UserQuery } }, async (request, reply) => {
        let { page, limit} = request.query as any;
        if (!page){
            page = 1;
        }
        if (!limit){
            limit = 10;
        }
        const data = await UserService.list({ page: Number(page), limit: Number(limit)});
        return data;
    });


    app.get('/users/:id', async (request, reply) => {
        const user = await UserService.getById((request.params as any).id);
        if (!user) return reply.status(404).send({ message: 'User not found' });
        return user;
    });


    app.put('/users/', { schema: { body: UserUpdateInput } }, async (request, reply) => {
        const updated = await UserService.update(request.user.id, request.body as any);
        if (!updated) return reply.status(404).send({ message: 'User not found' });
        return updated;
    });


    app.delete('/users/:id', async (request, reply) => {
        const user = await UserService.getByEmail(request.user.email);
        if (!user) return reply.status(401).send({ message: 'Unauthorized' });

        if (!user.is_admin) return reply.status(403).send({ message: 'Forbidden' });

        const success = await UserService.delete((request.params as any).id);
        if (!success) return reply.status(404).send({ message: 'User not found' });

        return reply.status(204).send();
    });


    app.delete('/users/delete-account/', async (request, reply) => {
        const success = await UserService.delete(request.user.id);
        if (!success) return reply.status(401).send({ message: 'Unauthorized' });

        return reply.status(204).send();
    });

};