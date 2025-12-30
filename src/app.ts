import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';

import { authPlugin } from './modules/auth/auth.plugin';
import { eventRoutes } from './modules/events/event.routes';
import { bookingRoutes } from './modules/bookings/booking.routes';
import { userRoutes } from './modules/users/user.routes';

export function buildApp() {
    // Create Fastify app    
    const app = Fastify({ logger: true });

    // Global IP-based rate limiting (ALL endpoints)
    app.register(rateLimit, {
        global: true,
        max: 100,              // requests
        timeWindow: '1 minute' // per IP
    });

    // Auth (login + token verification hook)
    app.register(authPlugin);

    // Domain routes
    app.register(userRoutes);
    app.register(eventRoutes);
    app.register(bookingRoutes);

    // Health check (no auth logic should block this)
    app.get('/health', async () => ({ status: 'ok' }));

    return app;
}