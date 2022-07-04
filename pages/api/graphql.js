import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

require('dotenv').config();
const postgres = require('postgres');
const sql = postgres();

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String, id: ID): User
    todos(completed: Boolean): [Todo!]!
    todo(id: ID): Todo
  }

  type Users {
    id: ID
    username: String
    passwordHash: String
  }

  type User {
    id: ID
    name: String
    username: String
    passwordHash: String
  }

  type Todo {
    id: ID
    title: String
    checked: Boolean
  }

  type Mutation {
    createTodo(title: String!, checked: Boolean!): Todo
    createUser(username: String!, passwordHash: String!): User
  }
`;

const getTodos = async (checked) => {
  if (checked === true) {
    return await sql`
    SELECT *
    FROM todos
    WHERE checked = true
    `;
  } else if (checked === false) {
    return await sql`
    SELECT *
    FROM todos
    WHERE checked = false
    `;
  }
  return await sql`
    SELECT *
    FROM todos
  `;
};

const getTodo = async (id) => {
  const result = await sql`
    SELECT *
    FROM todos
    WHERE id = ${id};
  `;
  return result[0];
};

const createTodo = async (title, checked) => {
  const res = await sql`
  INSERT INTO todos (title, checked)
  VALUES (${title}, ${checked})
  RETURNING *;
  `;
  return res[0];
};

const getUsers = async () => {
  return await sql`
    SELECT *
    FROM users
  `;
};

export const createUser = async (username, passwordHash) => {
  const res = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username;
  `;
  return res[0];
};

const users = [
  { name: 'Leeroy Jenkins', username: 'leeroy' },
  { name: 'Foo Bar', username: 'foobar' },
];

const todos = [
  { id: '1', title: 'Learn GraphQL', checked: true },
  { id: '2', title: 'Learn Apollo', checked: false },
  { id: '3', title: 'Learn Micro', checked: false },
];

const resolvers = {
  Query: {
    users(parent, args) {
      return getUsers();
    },
    user(parent, { username }) {
      return users.find((user) => user.username === username);
    },
    todos(parent, args) {
      // if (args.checked === true) {
      //   return todos.filter((todo) => todo.checked === true);
      // } else if (args.checked === false) {
      //   return todos.filter((todo) => todo.checked === false);
      // }
      return getTodos(args.completed);
    },
    todo(parent, { id }) {
      // return todos.find((todo) => todo.id === id);
      return getTodo(id);
    },
  },
  Mutation: {
    createTodo(parent, { title, checked }) {
      return createTodo(title, checked);
    },
    createUser(parent, { username, passwordHash }) {
      return createUser(username, passwordHash);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
});
