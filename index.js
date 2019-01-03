const express = require('express');
const graphql = require('graphql').graphql;
const graphqlHTTP = require('express-graphql');
var bodyParser = require('body-parser');
const next = require('next')
const cors = require('cors');

const schema = require('./schema');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.use('/graphiql', graphqlHTTP({
      schema,
      pretty: true,
      graphiql: true,
    }));

    // Configure the server to use bodyParser()
    server.use(bodyParser.urlencoded({
      extended: true
    }));
    server.use(bodyParser.json());

    // Enable CORS
    server.use(cors());

    server.all('/graphql', (req, res) => {
      let graphqlQuery = req.query.query;
      if (req.body) {
        graphqlQuery = req.body.query;
      }

      if (!graphqlQuery) {
        return res.status(500).send('You must provide a query');
      }

      return graphql(schema, graphqlQuery)
      .then(({ data, errors }) => res.json({ data, errors }))
        .catch(err => console.error(err)); // eslint-disable-line no-console
    });

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(PORT, () => {
      console.log('Server running on port', PORT); // eslint-disable-line no-console
    });
  });
