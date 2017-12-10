const graphql = require('graphql');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const Nightmare = require('nightmare');

const element = require('./element');

const site = new graphql.GraphQLObjectType({
  name: 'Site',
  fields: {
    select: {
      type: new graphql.GraphQLList(element.type),
      args: element.args,
      resolve: element.resolve,
    },
    count: {
      type: graphql.GraphQLInt,
      args: element.args,
      description: 'Get a count of provided elements',
      resolve: (root, args) => {
        const elems = root(args.elem);
        return elems.length;
      },
    },
  },
});

module.exports = {
  type: site,
  args: {
    url: {
      type: graphql.GraphQLString,
      description: 'URL to grab information from.',
    },
    html: {
      type: graphql.GraphQLString,
    },
    wait: {
      type: graphql.GraphQLInt,
      description: 'This will wait for JS to load onto the page before parsing, only works with passing URL.',
    },
    waitForSelector: {
      type: graphql.GraphQLString,
      description: `This will wait for a specific element to show on
      the page before starting to query, only works with passing URL.`,
    },
  },
  resolve: async (root, args) => {
    if (args.html && args.html.trim() !== '') {
      return cheerio.load(args.html);
    }

    if (args.url === undefined) {
      throw new Error('expected URL argument to be present');
    }

    if (args.waitForSelected !== undefined || args.wait !== undefined) {
      return Nightmare()
        .goto(args.url)
        .wait(args.waitForSelector || args.wait)
        .evaluate(() => {
          return document.body.innerHTML;
        })
        .end()
        .then((body) => {
          return cheerio.load(body);
        })
        .catch(function (error) {
          throw new Error('Nightmare parsing failed', error);
        });
    }

    return fetch(args.url)
      .then(res => res.text())
      .then(body => cheerio.load(body));
  },
};
