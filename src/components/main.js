// Main page

// ----------------------
// IMPORTS

/* NPM */
import React from 'react';

// Use the Semantic UI React framework (https://react.semantic-ui.com)
// to get some nicely styled components
import { Grid } from 'semantic-ui-react';

/* App */

// Components
import Header from './header';
import Login from './login';
import Social from './social';
import User from './user';

// Styles
import css from './main.css';

// ----------------------

export default () => (
  <Grid className={css.main} padded>
    <Header />
    <Login />
    <Social />
    <User />
  </Grid>
);
