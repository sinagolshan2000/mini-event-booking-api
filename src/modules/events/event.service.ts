import { db } from '../../db/lowdb';
import { Event } from '../../db/schema';
import { nanoid } from 'nanoid';


export class EventService {
    static async create(eventData: Omit<Event, 'id'>): Promise<Event> {
        await db.read();
        const event: Event = { id: nanoid(), ...eventData };
        db.data!.events.push(event);
        await db.write();
        return event;
    }


    static async list({ page = 1, limit = 10, startDate, endDate, location }: { page?: number; limit?: number; startDate?: string; endDate?: string; location?: string }) {
        await db.read();
        let events = db.data!.events;

        if (startDate) {
            const start = new Date(startDate).getTime();
            events = events.filter(e => new Date(e.date).getTime() >= start);
        }

        if (endDate) {
            const end = new Date(endDate).getTime();
            events = events.filter(e => new Date(e.date).getTime() <= end);
        }

        if (location) events = events.filter(e => e.location === location);

        const startIdx = (page - 1) * limit;
        const endIdx = startIdx + limit;

        const list = events.slice(startIdx, endIdx).map(e => {
            const booked = db.data!.bookings.filter(b => b.eventId === e.id).length;
            return { ...e, remainingSeats: e.capacity - booked };
        });

        return { total: events.length, page, limit, data: list };
    }


    static async getById(id: string) {
        await db.read();
        return db.data!.events.find(e => e.id === id);
    }


    static async update(id: string, updates: Partial<Omit<Event, 'id'>>) {
        await db.read();
        const event = db.data!.events.find(e => e.id === id);
        if (!event) return null;
        Object.assign(event, updates);
        await db.write();
        return event;
    }


    static async delete(id: string) {
        await db.read();
        const idx = db.data!.events.findIndex(e => e.id === id);
        if (idx === -1) return false;
        db.data!.events.splice(idx, 1);
        await db.write();
        return true;
    }
}