/* eslint-disable import/prefer-default-export */

// Session GraphQL

// ----------------------
// IMPORTS

/* NPM */

// GraphQL schema library, for building our schema layouts
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';

/* Local */

// DB
import { login } from 'src/db/session';

// GraphQL
import { FieldType } from './form';
import { UserType } from './user';

// ----------------------

// Session response object.  Use this whenever we're expecting a user, but there
// could also be an error
export const SessionType = new GraphQLObjectType({
  name: 'Session',
  description: 'User session',
  fields() {
    return {
      ok: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve(obj) {
          return obj.ok;
        },
      },
      errors: {
        type: new GraphQLList(FieldType),
        resolve(obj) {
          return obj.errors;
        },
      },
      jwt: {
        type: GraphQLString,
        resolve(obj) {
          return obj.session && obj.session.jwt();
        },
      },
      user: {
        type: UserType,
        resolve(obj) {
          return obj.session && obj.session.getUser();
        },
      },
    };
  },
});

// Login mutation
export const loginMutation = {
  type: SessionType,
  args: {
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  async resolve(_, args, ctx) {
    try {
      const session = await login(args);

      // If getting the JWT didn't throw, then we know we have a valid
      // JWT -- store it on a cookie so that we can re-use it for future
      // requests to the server
      ctx.cookies.set('reactQLJWT', session.jwt(), {
        expires: session.expiresAt,
      });

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
};
