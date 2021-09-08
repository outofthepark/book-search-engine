const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3500;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

async function startApolloServer(typeDefs, resolvers, middleware){ 

  const server = new ApolloServer({ typeDefs, resolvers, context: middleware });
  await server.start();
  server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
          console.log(`API server running on port ${PORT}!`);
          // log where we can go to test our GQL API
          console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
}

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

startApolloServer(typeDefs, resolvers, authMiddleware);