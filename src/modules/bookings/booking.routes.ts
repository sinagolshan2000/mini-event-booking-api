import { FastifyPluginAsync } from 'fastify';
import { BookingService } from './booking.service';
import { BookingInput, BookingQuery } from './booking.schema';


export const bookingRoutes: FastifyPluginAsync = async (app) => {
    app.post('/bookings', { schema: { body: BookingInput } }, async (request, reply) => {
        try {
            const { eventId } = request.body as any;
            const booking = await BookingService.create(request.user.id, eventId);
            return reply.status(201).send(booking);
        } catch (err: any) {
            request.log.error(err)
            if (err.message === 'Event not found') return reply.status(404).send({ message: err.message });
            if (err.message === 'User already booked this event') return reply.status(409).send({ message: err.message });
            if (err.message === 'Event is fully booked') return reply.status(400).send({ message: err.message });
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });


    app.get('/bookings', { schema: { querystring: BookingQuery } }, async (request) => {
        let { page, limit } = request.query as any;
        if (!page){
            page = 1;
        }
        if (!limit){
            limit = 10;
        }
        return BookingService.list({ page: Number(page), limit: Number(limit) });
    });


    app.delete('/bookings/:id', async (request, reply) => {
        const success = await BookingService.delete((request.params as any).id);
        if (!success) return reply.status(404).send({ message: 'Booking not found' });
        return reply.status(204).send();
    });
};