// User GraphQL

// ----------------------
// IMPORTS

/* NPM */

// GraphQL schema library, for building our schema layouts
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';

/* Local */

// DB models
import { createUser } from 'src/db/user';

// GraphQL
import { FieldType } from './form';

// ----------------------

// User type.  Wraps a `User` DB row.
export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User',
  fields() {
    return {
      id: {
        type: GraphQLString,
        resolve(user) {
          return user.id;
        },
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        },
      },
      firstName: {
        type: GraphQLString,
        resolve(user) {
          return user.firstName;
        },
      },
      lastName: {
        type: GraphQLString,
        resolve(user) {
          return user.lastName;
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve(user) {
          return user.createdAt;
        },
      },
      updatedAt: {
        type: GraphQLString,
        resolve(user) {
          return user.updatedAt;
        },
      },
    };
  },
});

// User response object.  Use this whenever we're expecting a user, but there
// could also be an error
export const UserResponseType = new GraphQLObjectType({
  name: 'UserResponse',
  description: 'User response, or error',
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
      user: {
        type: UserType,
        resolve(obj) {
          return obj.user;
        },
      },
    };
  },
});

// Create a user via GraphQL mutations
export const createUserMutation = {
  type: UserResponseType,
  args: {
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  },
  async resolve(_, args) {
    try {
      const user = await createUser(args);
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        errors: e,
      };
    }
  },
};
