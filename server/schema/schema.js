const graphql = require('graphql');
const Book = require ('../models/book');
const Author = require('../models/author');


const { 
  GraphQLObjectType, 
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull 
} = graphql

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID},
    name: { type: GraphQLString},
    genre: { type: GraphQLString},
    author: { 
      type: AuthorType,
      resolve: (parent, args) => {
        return Author.findById(parent.author_id)
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID},
    name: { type: GraphQLString},
    age: { type: GraphQLInt},
    books: { 
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        return Book.find({author_id: parent.id})
      }
     }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: { type: GraphQLID}},
      resolve(parent, args) {
        // code to get data from db / other source
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve: (parent, args) => {
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parents, args) => {
        return Book.find()
      } 
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (parents, args) => {
        return Author.find()
      } 
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: { 
        name: { type: new GraphQLNonNull(GraphQLString) }, 
        age: { type: new GraphQLNonNull(GraphQLInt) } 
      },
      resolve: (parent, args) => { 
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: { 
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author_id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, args) => { 
        let book = new Book({
          name: args.name,
          genre: args.genre,
          author_id: args.author_id
        });
        return book.save();
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})