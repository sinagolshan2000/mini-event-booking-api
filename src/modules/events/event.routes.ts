import { FastifyPluginAsync } from 'fastify';
import { EventService } from './event.service';
import { EventInput, EventQuery } from './event.schema';


export const eventRoutes: FastifyPluginAsync = async (app) => {
    app.post('/events', { schema: { body: EventInput } }, async (request, reply) => {
        const event = await EventService.create(request.body as any);
        return reply.status(201).send(event);
    });


    app.get('/events', { schema: { querystring: EventQuery } }, async (request, reply) => {
        let { page, limit, startDate, endDate, location } = request.query as any;
        if (!page){
            page = 1;
        }
        if (!limit){
            limit = 10;
        }
        const data = await EventService.list({ page: Number(page), limit: Number(limit), startDate, endDate, location });
        return data;
    });


    app.get('/events/:id', async (request, reply) => {
        const event = await EventService.getById((request.params as any).id);
        if (!event) return reply.status(404).send({ message: 'Event not found' });
        return event;
    });


    app.put('/events/:id', { schema: { body: EventInput } }, async (request, reply) => {
        const updated = await EventService.update((request.params as any).id, request.body as any);
        if (!updated) return reply.status(404).send({ message: 'Event not found' });
        return updated;
    });


    app.delete('/events/:id', async (request, reply) => {
        const success = await EventService.delete((request.params as any).id);
        if (!success) return reply.status(404).send({ message: 'Event not found' });
        return reply.status(204).send();
    });
};