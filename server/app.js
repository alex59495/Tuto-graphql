const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// allow CORS request
app.use(cors())

// Connect to mlab database
mongoose.connect(
  "mongodb+srv://alex:BC.jAXGvJ-H77Sm@cluster0.spx17.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", 
  {useNewUrlParser: true},
)
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('Now listening for request on port 4000');
});