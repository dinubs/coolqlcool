const express = require('express');
const graphql = require('graphql').graphql;
const graphqlHTTP = require('express-graphql');

const schema = require('./schema');
const introspectionQuery = require('./introspection.graph.js');

const app = express();
const PORT = 3001;

app.use('/graphiql', graphqlHTTP({
  schema,
  pretty: true,
  graphiql: true,
}));

app.get('/graphql', (req, res) => {
  const graphqlQuery = req.query.query;
  if (!graphqlQuery) {
    return res.status(500).send('You must provide a query');
  }

  return graphql(schema, graphqlQuery)
    .then(response => response.data)
    .then(data => res.json(data))
    .catch(err => console.error(err)); // eslint-disable-line no-console
});

app.get('/schema', (req, res) => {
  return graphql(schema, introspectionQuery)
    .then(response => response.data)
    .then(data => res.json(data))
    .catch(err => console.error(err)); // eslint-disable-line no-console
});

app.use(express.static('public'))

app.listen(PORT, () => {
  console.log('Server running on port', PORT); // eslint-disable-line no-console
});
