// DB fixtures.  In this demo app, we'll add a new user to

// ----------------------
// IMPORTS

/* App */

// Grab the users we want to add to the DB by default
import { users } from 'src/common';

// DB configuration.  Importing this file for the first time will initialise
// the DB.  Then anywhere else we're pulling in this file, will receive a
// singleton instance of our DB connection object
import db from './index';

// Our models have convenience features like `createUser` for adding a new
// user -- grab what we need here so that we can add some fixtures below
import { createUser } from './user';

// ----------------------

// Sync the DB tables.  Since we're using SQLite, the DB will disappear every
// time the app restarts -- so we'll need to re-create the tables.  (This can
// be removed when we move to PostgreSQL/MySQL)
db.sync().then(async () => (
  // Create the new users.  `createUser` returns a Promise, so we'll return
  // a Promise that resolves once the array of `createUsers` Promises have all
  // resolved (that way, we know that all users have been added)
  Promise.all(users.map(user => createUser(user)))
));
