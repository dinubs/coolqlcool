const graphql = require('graphql');

const parse = require('./parse');

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      site: parse,
    },
  }),
});

module.exports = schema;
