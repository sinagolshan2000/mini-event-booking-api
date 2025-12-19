import { Static, Type } from '@sinclair/typebox';


export const EventInput = Type.Object({
    name: Type.String(),
    date: Type.String({ format: 'date-time' }),
    location: Type.String(),
    capacity: Type.Number({ minimum: 1 })
});
export type EventInputType = Static<typeof EventInput>;


export const EventQuery = Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1 })),
    startDate: Type.Optional(Type.String({ format: 'date-time' })),
    endDate: Type.Optional(Type.String({ format: 'date-time' })),
    location: Type.Optional(Type.String())
});
export type EventQueryType = Static<typeof EventQuery>;