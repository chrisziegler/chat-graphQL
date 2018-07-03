const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const crypto = require('crypto');

const db = {
  users: [
    {
      id: '1',
      email: 'chrisrziegler@gmail.com',
      name: 'Chris',
      avatarUrl: 'https://gravatar.com/...'
    },
    {
      id: '2',
      email: 'jim@example.com',
      name: 'Jim',
      avatarUrl: 'https://gravatar.com/...'
    }
  ],
  messages: [
    { id: '1', userId: '1', body: 'Hello', createdAt: Date.now() },
    { id: '2', userId: '2', body: 'Hi', createdAt: Date.now() },
    {
      id: '3',
      userId: '1',
      body: "What's up?",
      createdAt: Date.now()
    }
  ]
};

const schema = buildSchema(`
  type Query {
    users: [User!]!
    user(id: ID!) : User
    messages: [Message!]!
  }

  type Mutation {
    addUser(email: String!, name: String): User
  }

  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
    messages: [Message!]!
  }
  type Message {
    id: ID!
    body: String!
    createdAt: String
  }
`);

class User {
  constructor(user) {
    Object.assign(this, user);
  }
  messages() {
    return db.messages.filter(message => message.userId === this.id);
  }
}

const rootValue = {
  // wrap each user in a User class, passing in the user
  users: () => db.users.map(user => new User(user)),
  user: args => db.users.find(user => user.id === args.id),
  messages: () => db.messages,
  // email and name destructured from the the 1st args argument
  addUser: ({ email, name }) => {
    const user = {
      id: crypto.randomBytes(10).toString('hex'),
      email,
      name
    };
    db.users.push(user);
    return user;
  }
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
);

app.listen(3000, () => console.log('Listening on 3000'));
