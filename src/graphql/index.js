// Schema for sample GraphQL server.

// ----------------------
// IMPORTS

/* NPM */

// GraphQL schema library, for building our schema layouts
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
} from 'graphql';

/* Local */

// DB models
import { getSessionOnJWT } from 'src/db/session';
import { User } from 'src/db/user';

// GraphQL
import {
  UserType,
  createUserMutation,
} from './user';

import {
  SessionType,
  loginMutation,
} from './session';

// ----------------------

// Root query.  This is our 'public API'.
const Query = new GraphQLObjectType({
  name: 'Queries',
  description: 'Root query object',
  fields() {
    return {
      session: {
        type: SessionType,
        async resolve(root, args, ctx) {
          try {
            // Attempt to retrieve the JWT based on the token that *may* be
            // available on the request context's `state`
            const session = await getSessionOnJWT(ctx.state.jwt);

            // Return the session record from the DB
            return {
              ok: true,
              session,
            };
          } catch (e) {
            return {
              ok: false,
              errors: e,
            };
          }
        },
      },
      // In this sample app, we can query `{ users { id, firstName, email }}`
      // and get back a list of ALL users.  Of course, in a production app, you'd
      // never make this kind of data visible publicly.  But for the sake of
      // debugging and knowing what's going on under the hood in this app, we'll
      // keep this open
      users: {
        type: new GraphQLList(UserType),
        resolve() {
          return User.findAll();
        },
      },
    };
  },
});

// Mutations.  These are our 'HTTP POST'-style API functions, that modify
// data in some way
const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to create or modify stuff',
  fields() {
    return {
      createUser: createUserMutation,
      login: loginMutation,
    };
  },
});

// The resulting schema.  We insert our 'root' `Query` object, to tell our
// GraphQL server what to respond to.  We could also add a root `mutation`
// if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
