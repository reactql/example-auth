// Social logins

// ----------------------
// IMPORTS

/* NPM */

// React
import React from 'react';
import { Segment, Grid, Header, Button } from 'semantic-ui-react';

/* ReactQL */
import { getServerURL } from 'kit/lib/env';

// ----------------------

// Set the local Facebook authorisation URL
const fbAuthURL = `${getServerURL()}/auth/facebook`;

export default () => (
  <Grid.Row>
    <Grid.Column>
      <Segment color="red">
        <Header>Facebook login</Header>
        <p>
          Alternatively, click below to use Facebook login. This will retrieve your
          profile, create a new `user` instance locally in SQLite, attach it to a new session,
          and then store the session identifier as a `reactQLJWT` cookie for reuse.
        </p>
        <a href={fbAuthURL}><Button primary>Login with Facebook</Button></a>
      </Segment>
    </Grid.Column>
  </Grid.Row>
);
