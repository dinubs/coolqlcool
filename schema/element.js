const graphql = require('graphql');
const $ = require('cheerio');

const { GraphQLString } = graphql;
const recursiveArgs = {
  elem: {
    type: GraphQLString,
  },
};

const resolve = (root, args) => root(args.elem);

const element = new graphql.GraphQLObjectType({
  name: 'Element',
  fields: () => ({
    /**
     * Allows us to recursively grab
     * child elements.
     */
    select: {
      type: element,
      args: recursiveArgs,
      description: 'Get an element from inside of this element',
      resolve: (root, args) => {
        const html = $(root).html();
        return resolve($.load(html), args);
      },
    },
    /**
     * Returns the count of child elements.
     */
    count: {
      type: graphql.GraphQLInt,
      args: recursiveArgs,
      description: 'Get a count of provided elements',
      resolve: (root, args) => {
        const html = $(root).html();
        const elems = $.load(html)(args.elem);
        return elems.length;
      },
    },
    classList: {
      type: new graphql.GraphQLList(GraphQLString),
      description: 'Get a list of the classes on the given element',
      resolve: root => $(root).attr('class').split(' '),
    },
    class: {
      type: GraphQLString,
      description: 'Get the class attribute on the given element',
      resolve: root => $(root).attr('class'),
    },
    text: {
      type: GraphQLString,
      description: 'The inner text of the element',
      resolve: root => $(root).text(),
    },
    href: {
      type: GraphQLString,
      description: 'Get the href of the element',
      resolve: root => $(root).attr('href'),
    },
    src: {
      type: GraphQLString,
      description: 'Get the src of the element',
      resolve: root => $(root).attr('src'),
    },
    /**
     * Looks for data attribute on element,
     * if the `name` argument is provided
     * then grab the specific `data-${name}`
     * attribute.
     */
    data: {
      type: GraphQLString,
      args: {
        name: {
          type: GraphQLString,
        },
      },
      description: 'Get the data attribute for element, if name is provided will grab that specific data attribute',
      resolve: (root, args) => {
        if (args.name && args.name.trim() !== '') {
          return $(root).data(args.name);
        }
        return $(root).attr('data');
      },
    },
    attr: {
      type: GraphQLString,
      args: {
        name: {
          type: GraphQLString,
        },
      },
      description: 'Get an attribute off of the element',
      resolve: (root, args) => $(root).attr(args.name),
    },
  }),
});

module.exports = {
  type: element,
  args: recursiveArgs,
  resolve,
};
