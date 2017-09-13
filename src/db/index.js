// Database connection.  In this demo app, we'll be connecting to an
// in-memory SQLite DB using the Sequelize v4 library.  In your own app, you'd
// probably use PostgreSQL / MySQL or similar

// ----------------------
// IMPORTS

/* NPM */

// Sequelize library -- http://docs.sequelizejs.com/
import Sequelize from 'sequelize';

// ----------------------

// Create a connection object to SQLite.  Since this will be held in memory,
// this DB will refresh upon restart
export default new Sequelize('sqlite://:memory:');
