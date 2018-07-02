const { graphql, buildSchema } = require('graphql');

const db = {
  users: [
    { id: '1', email: 'chrisrziegler@gmail.com', name: 'Chris' },
    { id: '2', email: 'jim@example.com', name: 'Jim' },
    { id: '3', email: 'sharon@gmail.com', name: 'Sharon' }
  ]
};
// users list itself cant be null
// atleast an array with no objects [falsy]
// & User object itself can't be null
const schema = buildSchema(`
  type Query {
    users: [User!]!
  }
  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
  }
`);
// (3) Resolver function
const rootValue = {
  // when we return db users we expect an array
  // with individual users inside it [line 12]
  users: () => db.users
};

graphql(
  schema,
  `
    {
      users {
        id
        email
      }
    }
  `,
  rootValue
)
  .then(res => console.dir(res, { depth: null }))
  .catch(console.error);
