// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        savedbooks: [Book]
        bookCount: Int
    }

    type Book{
        _id: ID
        bookId: String
        title: String
        author: String
        description: String
        image: String
        link: String
    }

    input BookInput{
        bookId: String
        title: String
        author: String
        description: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
      }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
    }

    type Mutation {
        login( email: String!, password: String! ): Auth
        addUser( username: String!, email: String!, password: String! ): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: String!): User
    }
`;
// export the typeDefs
module.exports = typeDefs;