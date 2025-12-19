import { Static, Type } from '@sinclair/typebox';


export const BookingInput = Type.Object({
    eventId: Type.String()
});
export type BookingInputType = Static<typeof BookingInput>;


export const BookingQuery = Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1 }))
});
export type BookingQueryType = Static<typeof BookingQuery>;