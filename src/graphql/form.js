/* eslint-disable import/prefer-default-export */

// GraphQL types

// ----------------------
// IMPORTS

/* NPM */
// GraphQL schema library, for building our schema layouts
import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

// ----------------------

// Generic field type.  This is useful whenever we want to attach a string
// message to a field name -- for example, error handling
export const FieldType = new GraphQLObjectType({
  name: 'Field',
  description: 'Form field and message',
  fields() {
    return {
      field: {
        type: GraphQLString,
        resolve(obj) {
          return obj.field;
        },
      },
      message: {
        type: GraphQLString,
        resolve(obj) {
          return obj.message;
        },
      },
    };
  },
});
