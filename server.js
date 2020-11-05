const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
     GraphQLSchema,
     GraphQLObjectType,
     GraphQLString,
     GraphQLList,
     GraphQLInt,
     GraphQLNonNull,
     GraphQLScalarType,
} = require('graphql');
const app = express();

const authors = [
     { id: 1, name: 'Akshat' },
     { id: 2, name: 'Mark' },
     { id: 3, name: 'Ali' }
]

const books = [
     { id: 1, name: 'Book 1', authorId: 1 },
     { id: 2, name: 'Book 2', authorId: 2 },
     { id: 3, name: 'Book 3', authorId: 3 },
     { id: 4, name: 'Book 4', authorId: 1 },
     { id: 5, name: 'Book 5', authorId: 2 },
     { id: 6, name: 'Book 6', authorId: 3 },
     { id: 7, name: 'Book 7', authorId: 1 },
     { id: 8, name: 'Book 8', authorId: 2 }
]

const BookType = new GraphQLObjectType({
     name: 'Book',
     description: 'This represents a book written by an author.',
     fields: () => ({
          id: { type: GraphQLNonNull(GraphQLInt) },
          name: { type: GraphQLNonNull(GraphQLString) },
          authorId: { type: GraphQLNonNull(GraphQLInt) },
          author: { 
               type: AuthorType,
               resolve: (book) => {
                    return authors.find(author => author.id === book.authorId)
               }
          }
     })
})

const AuthorType = new GraphQLObjectType({
     name: 'Auther',
     description: 'This represents a author of a book.',
     fields: () => ({
          id: { type: GraphQLNonNull(GraphQLInt) },
          name: { type: GraphQLNonNull(GraphQLString) },
          books: {
               type: new GraphQLList(BookType),
               resolve: (author) => {
                    return books.filter(book => book.authorId === author.id)
               }
          }
     })
})

const RootQueryType = new GraphQLObjectType({
     name: 'Query',
     description: 'Root Query',
     fields: () => ({
          book : {
               type: BookType,
               description: 'A single book.',
               args: {
                    id: { type: GraphQLInt }
               },
               resolve: (parent, args) => books.find(book => book.id === args.id)
          },
          books: {
               type: new GraphQLList(BookType),
               description: 'List of all Books.',
               resolve: () => books
          },
          authors: {
               type: new GraphQLList(AuthorType),
               description: 'List of all Authors',
               resolve: () => authors
          },
          author: {
               type: AuthorType,
               description: 'A single author',
               args: {
                    id: { type: GraphQLInt }
               },
               resolve: (parent, args) => authors.find(author => author.id === args.id)
          }
     })
})

const RootMutationType = new GraphQLObjectType({
     name: 'Mutation',
     description: 'Root Mutation',
     fields: () => ({
          addBook: {
               type: BookType,
               description: 'Add a book',
               args: {
                    name: { type: GraphQLNonNull(GraphQLString) },
                    authorId: { type: GraphQLNonNull(GraphQLInt) }
               },
               resolve: (parent, args) => {
                    const book = { 
                         id: books.length + 1,
                         name: args.name,
                         authorId: args.authorId
                    }
                    books.push(book)
                    return(book)
               }
          },
          addAuthor: {
               type: AuthorType,
               description: 'Add an author',
               args: {
                    name: { type: GraphQLNonNull(GraphQLString) },
               },
               resolve: (parent, args) => {
                    const author = { 
                         id: authors.length + 1,
                         name: args.name
                    }
                    authors.push(author)
                    return(author)
               }
          }
     })
})

const schema =  new GraphQLSchema({
     query: RootQueryType,
     mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
     schema: schema,
     graphiql: true
}))
app.listen(5000., () => console.log('Server is now Running!'));