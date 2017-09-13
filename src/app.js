// Entry point to our "Users, sessions and auth" app

// ----------------------
// IMPORTS

/* ReactQL */

// Config API, for adding reducers and configuring our ReactQL app
import config from 'kit/config';

/* App */

// Main component -- i.e. the 'root' React component in our app
import Main from 'src/components/main';

// Init global styles.  We'll import the Semantic UI framework here
// (https://semantic-ui.com) for the heck of it
import './styles.global.css';

// ----------------------

// Enable a built-in GraphQL server.  We'll define the schema for it in
// the `SERVER` block below, to avoid bloating our client-side browser bundle
config.enableGraphQLServer();

// Set our server config, by checking `SERVER` -- this code path will be
// eliminated by Webpack in the browser, so we can safely add this.

if (SERVER) {
  /* DATABASE */

  // In this demo app, we're using a SQLite database to build two tables --
  //
  // 1. `users` = to hold an e-mail, password and name of our sample website users
  // 2. `sessions` = to store session data server-side, so that we can check
  // whether a user is logged in, and expire sessions remotely
  //
  // By importing `src/db/fixtures`, this will init the DB on the server and
  // insert a couple of sample users
  require('src/db/fixtures');

  // Connect relationships between tables
  require('src/db/relationships');

  /* GRAPHQL */

  // Set the GraphQL schema.  Only our server needs to know what this is --
  // the client can request type information if it needs it, but otherwise will
  // be able to make queries to the GraphQL server without knowing the schema
  //
  // This contains all the types we need to represent a user,
  // session, JWT token, etc -- and the mutations we need to login
  config.setGraphQLSchema(require('src/graphql').default);

  // Set-up CORS to allow credentials to be passed to origins outside of the
  // server.  We'll need this in order to test this out in development on :8080
  config.setCORSOptions({
    credentials: true,
  });

  /* MIDDLEWARE */

  // Add an `Authorization` parser that will store any passed JWT tokens in
  // Koa's request context, so that we can subsequently pass it along to any
  // GraphQL requests that require it (like the { session } shaped query)
  config.addMiddleware(async (ctx, next) => {
    // Check the Authorization:` header or cookie for the JWT
    const authHeader = ctx.get('authorization') || ctx.cookies.get('reactQLJWT');

    if (authHeader) {
      // Strip out the `Bearer` prefix, so we're left with just the JWT and
      // store it on Koa's `ctx.state``.  At this point, it's unverified, but
      // we'll leave it to the relevant GraphQL query to do the validation
      // at the time of the data request, rather than taking up extra CPU cycles
      ctx.state.jwt = authHeader.replace(/^bearer\s*/i, '');
    }
    return next();
  });

  /* PASSPORT.JS */

  // Get the server host/port, to register callbacks
  const { getServerURL } = require('kit/lib/env');

  // Social logins.  In this example app, we'll use Facebook and
  // pull in the required Passport.js packages to set it up
  const passport = require('koa-passport');
  const FacebookStrategy = require('passport-facebook').Strategy;

  // DB functions we'll need to handle login
  const { createUserFromSocial } = require('src/db/user');
  const { createSession } = require('src/db/session');

  // Set-up Facebook login strategy using the sample credentials that are
  // provided by Lee Benson's FB developer app account -- CHANGE THIS before
  // using in production, or you'll hit rate limits!
  passport.use(new FacebookStrategy(
    {
      clientID: '1822349178077971',
      clientSecret: '1080c5f86936fe83da8d18a18b1c341a',
      callbackURL: `${getServerURL()}/auth/facebook/callback/`,
      // We only need certain fields from Facebook, so specify which here
      profileFields: [
        'id',
        'email',
        'first_name',
        'last_name',
      ],
    },
    // Callback function.  Use this to create the user if they don't already
    // exist
    async (token, tokenSecret, profile, done) => {
      // Attempt to create a new user. If the user already exists, this will
      // fail, so wrap this in a catch block (we can just log any failure)
      let user = {};
      try {
        user = await createUserFromSocial({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
      } catch (e) {
        // eslint-disable-next-line
        console.log('User error:', e);
      }
      done(null, user);
    },
  ));

  // Add the Passport.js middleware
  config.addMiddleware(passport.initialize());

  // Add the authorisation routes, for Facebook
  config.addGetRoute('/auth/facebook', passport.authenticate('facebook', {
    // Since we're not using sessions, turn `session` off
    session: false,

    // Get access to the fields we need
    scope: [
      'public_profile',
      'email',
    ],
  }));

  config.addGetRoute('/auth/facebook/callback', async (ctx, next) => (
    // Since we need to attach a session to the user object here, we won't
    // use Passport's default handling.  Instead, we'll set our own 'inner
    // handler' and use that to attach a JWT to a new session we'll create
    passport.authenticate('facebook', {
      // In this simple example, we'll redirect all events back to the main
      // page so that we can render the example
      session: false,
    }, async (e, user) => {
      // Check that we have a valid user
      if (user) {
        // Create a new session related to our `user` object
        const session = await createSession(user);

        // Create a JWT token, and store it on our common cookie
        ctx.cookies.set('reactQLJWT', session.jwt(), {
          expires: session.expiresAt,
        });
      }

      // Now redirect back to home, regardless -- if login was successful,
      // the JWT will have been attached to the session
      ctx.redirect('/');
    })(ctx, next)
  ));
} else {
  /* BROWSER ONLY */

  // We don't bother running this stuff on the server, before it's simply
  // not relevant in that environment and/or could cause clashes (for example,
  // with Apollo middleware)

  // Set the Apollo CORS config, so that we can interpret `Set-Cookie`
  // headers for subsequent requests back to the SSR version
  config.setApolloNetworkOptions({
    credentials: 'include',
  });

  // Add Apollo request middleware to use the latest JWT token on every
  // request, so that our previously logged in state can be 'remembered'
  config.addApolloMiddleware((req, next) => {
    const jwt = localStorage.getItem('reactQLJWT');
    req.options.headers = {
      ...req.options.headers,
      authorization: jwt || null,
    };
    next();
  });
}

// In app.js, we need to export the root component we want to mount as the
// starting point to our app.  We'll just export the `<Main>` component.
export default Main;
