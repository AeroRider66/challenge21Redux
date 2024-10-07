const typeDefs = `
  type Book {
    id: Int!
    title: String!
    releaseDate: String!
    platforms: [String!]!
    genres: [String!]!
    image: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    books: [Book]!
    bookCount: Int!
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    savedBooks: [Book]
  }

  input BookInput {
    id: Int!
    title: String!
    releaseDate: String!
    platforms: [String!]!
    genres: [String!]!
    image: String!
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
