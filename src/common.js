/* eslint-disable import/prefer-default-export */

// Just some common stuff we use throughout the app

// Sample users for DB fixtures, and for logging in -- obviously in production,
// we would NOT be showing plain text passwords like this!
export const users = [{
  email: 'john@example.com',
  password: 'reactqlrocks',
  firstName: 'John',
  lastName: 'Doe',
}, {
  email: 'jane@example.com',
  password: '123456',
  firstName: 'Jane',
  lastName: 'Doe',
}];
