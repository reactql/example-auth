// Login page

// ----------------------
// IMPORTS

/* NPM */
import React from 'react';

// Use the Semantic UI React framework (https://react.semantic-ui.com)
// to get some nicely styled components
import { Grid, Header } from 'semantic-ui-react';

// ----------------------

export default () => (
  <Grid.Row>
    <Grid.Column>
      <Header size="huge">Users, sessions and auth</Header>
      <p>
        This ReactQL app demonstrates how you might implement user authentication
        and sessions, with GraphQL and SQLite.
      </p>
    </Grid.Column>
  </Grid.Row>
);
