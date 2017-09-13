# Users, sessions and auth

This ReactQL project demonstrates one possible way you might implement user/password authorisation.

It also adds [Passport.js](http://passportjs.org/) with a sample Facebook login.

## Features

* User sign-up form, with field validation (email validation via [isemail](https://www.npmjs.com/package/isemail))
* [Passport.js](http://passportjs.org/) integration
* User/password and Facebook login
* In-memory SQLite DB with `users` and `sessions` tables, running via [Sequelize v4](http://docs.sequelizejs.com/)
* Server-side sessions. Deleting the DB entry remotely kills the session
* Password hashing via [bcrypt](https://www.npmjs.com/package/bcrypt)
* GraphQL types representing users, sessions, [JWT tokens](https://www.npmjs.com/package/jsonwebtoken), field errors
* [Semantic UI React](https://react.semantic-ui.com) components and styling
* JWT tokens -- stored in both `localStorage` and via cookies, for subsequent SSR requests to render authenticated content on the server side, and for stateless environments such as mobile
* No modifications to the kit -- pure userland code

## Video walk-through

I've uploaded a 28 minute video on YouTube, which explains the concepts used in this project entitled *User authentication with GraphQL + DB + JWT*

Find it here:
https://youtu.be/s1p4R4rzWUs

## Kit version

Based on ReactQL kit [v2.8.5](https://github.com/reactql/kit/releases/tag/2.8.5)
