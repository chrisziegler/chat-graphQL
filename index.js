const { graphql, buildSchema } = require('graphql');

const db = {
  users: [
    { id: '1', email: 'chrisrziegler@gmail.com', name: 'Chris' },
    { id: '2', email: 'jim@example.com', name: 'Jim' },
    { id: '3', email: 'sharon@gmail.com', name: 'Sharon' }
  ]
};
const schema = buildSchema(`
  type Query {
    user: User
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
  users: () => 'GraphQL works!'
};

// call the graphql function expects at least these 3 params
// this function allows us to 1st of all, have a schema (2)
graphql(
  schema,
  // query, placeholder, actual query below (4)
  `
    {
      message
    }
  `,
  rootValue
)
  .then(
    // only 1 argument so don't need console.log in arrow function
    // .then(res => console.log(res))
    console.log
  )
  .catch(console.error);
