// ----------------------
// IMPORTS

/* App */
import { User } from './user';
import { Session } from './session';

// ----------------------

// User has many sessions
User.hasMany(Session);

// And a session belongs to a user
Session.belongsTo(User);
