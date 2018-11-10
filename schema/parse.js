const graphql = require('graphql');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const Nightmare = require('nightmare');

const element = require('./element');

const site = new graphql.GraphQLObjectType({
  name: 'Site',
  fields: {
    select: {
      args: element.args,
      description: 'Grab a specific child element',
      resolve: element.resolve,
      type: element.type,
    },
    selectAll: {
      args: element.args,
      description: 'Grab all child elements of a tag',
      resolve: element.resolve,
      type: new graphql.GraphQLList(element.type),
    },
    count: {
      args: element.args,
      description: 'Get a count of provided elements',
      resolve: (root, args) => {
        const elems = root(args.elem);
        return elems.length;
      },
      type: graphql.GraphQLInt,
    },
  },
});

module.exports = {
  type: site,
  args: {
    url: {
      description: 'URL to grab information from.',
      type: graphql.GraphQLString,
    },
    html: {
      description: 'Passed in HTML to query off of, can use this when you already have the HTMl and just want to query off of it.',
      type: graphql.GraphQLString,
    },
    wait: {
      description: 'This will wait for a certain amount of time in milliseconds, only works with passing URL.',
      type: graphql.GraphQLInt,
    },
    waitForSelector: {
      description: `This will wait for a specific element to show on
      the page before starting to query, only works with passing URL.`,
      type: graphql.GraphQLString,
    },
  },
  resolve: async (root, args) => {
    if (args.html && args.html.trim() !== '') {
      return cheerio.load(args.html, {
        xmlMode: true
      });
    }

    if (args.url === undefined) {
      throw new Error('expected URL argument to be present');
    }

    // Use Nightmare to render the page and grab the document body when
    //  `waitForSelector` or `wait` exist
    if (args.waitForSelector !== undefined || args.wait !== undefined) {
      return Nightmare()
        .goto(args.url)
        .wait(args.waitForSelector || args.wait)
        .evaluate(() => {
          return document.body.innerHTML;
        })
        .end()
        .then((body) => {
          return cheerio.load(body, {
            xmlMode: true
          });
        })
        .catch(function (error) {
          throw new Error('Nightmare parsing failed', error);
        });
    }

    return fetch(args.url)
      .then(res => res.text())
      .then(body => cheerio.load(body, {
        xmlMode: true
      }));
  },
};
