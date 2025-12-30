import { db } from '../../db/lowdb';
import { nanoid } from 'nanoid';
import { Paginator } from '../../utilities/paginators';


export class BookingService {
    static async create(userId: string, eventId: string) {
        await db.read();


        const event = db.data!.events.find(e => e.id === eventId);
        if (!event) throw new Error('Event not found');


        const existingBooking = db.data!.bookings.find(b => b.userId === userId && b.eventId === eventId);
        if (existingBooking) throw new Error('User already booked this event');


        const bookedCount = db.data!.bookings.filter(b => b.eventId === eventId).length;
        if (bookedCount >= event.capacity) throw new Error('Event is fully booked');


        const booking = { id: nanoid(), userId, eventId, createdAt: new Date().toISOString() };
        db.data!.bookings.push(booking);
        await db.write();
        return booking;
    }


    static async list({ page = 1, limit = 10 }) {
        await db.read();
        const bookings = db.data!.bookings;
        const paginator = new Paginator(bookings, page, limit);
        return paginator.toJSON();
    }


    static async delete(id: string) {
        await db.read();
        const idx = db.data!.bookings.findIndex(b => b.id === id);
        if (idx === -1) return false;
        db.data!.bookings.splice(idx, 1);
        await db.write();
        return true;
    }
}