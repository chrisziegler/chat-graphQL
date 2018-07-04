const { ApolloServer, gql } = require('apollo-server');
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

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
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
`;

const resolvers = {
  Query: {
    users: () => db.users,
    user: args => db.users.find(user => user.id === args.id),
    messages: () => db.messages
  },
  Mutation: {
    addUser: ({ email, name }) => {
      const user = {
        id: crypto.randomBytes(10).toString(),
        email,
        name
      };
      db.users.push(user);

      return user;
    }
  },
  User: {
    // available arguments are (parent, args, context, info) in this case
    // we need parent to extract (destructure) the user id off the parent
    // object - The User object that the messages belong to
    messages: ({ id }) =>
      db.messages.filter(message => message.userId === id)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(serverInfo => {
  console.log(`Apollo Server listening at ${serverInfo.url}`);
});
