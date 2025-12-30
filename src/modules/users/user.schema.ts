import { Static, Type } from '@sinclair/typebox';

export const UserRegisterInput = Type.Object({
    email: Type.String(),
    password: Type.String()
});
export type UserRegisterInputType = Static<typeof UserRegisterInput>;


export const UserUpdateInput = Type.Object({
    description: Type.String()
});
export type UserUpdateInputType = Static<typeof UserRegisterInput>;

export const UserQuery = Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1 }))
});
export type UserQueryType = Static<typeof UserQuery>;
