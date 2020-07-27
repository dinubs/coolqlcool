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
    headers: {
      description: 'Headers to be passed along the fetch request to the website',
      type: graphql.GraphQLString
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
    waitForFn: {
      description: `This will wait for an evaluated function to return true
      before starting to query, only works with passing URL.`,
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
    //  `waitForSelector`, `waitForFn, or `wait` exist
    if (args.waitForSelector !== undefined || args.wait !== undefined || args.waitForFn !== undefined) {
      const wait = args.waitForSelector || args.wait || Function(`try { return ${args.waitForFn} } catch(e) {}`);
      return Nightmare()
        .goto(args.url)
        .wait(wait)
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

    let options = {};
    if (args.headers !== undefined) {
      options.headers = JSON.parse(args.headers);
    }

    return fetch(args.url, options)
      .then(res => res.text())
      .then(body => cheerio.load(body, {
        xmlMode: true
      }));
  },
};
