export interface Event {
id: string;
name: string;
date: string; // ISO string
location: string;
capacity: number;
}


export interface Booking {
id: string;
eventId: string;
userId: string;
createdAt: string;
}


export interface User {
  id: string;
  email: string;
  password: string;  // hashed password
  token: string;     // current active token
}


export interface DatabaseSchema {
events: Event[];
bookings: Booking[];
users: User[];
}