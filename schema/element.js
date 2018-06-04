const graphql = require('graphql');
const $ = require('cheerio');

const {
  GraphQLString
} = graphql;
const recursiveArgs = {
  elem: {
    type: GraphQLString,
  },
};

const resolve = (root, args) => root(args.elem);

const element = new graphql.GraphQLObjectType({
  name: 'Element',
  fields: () => ({
    select: {
      args: recursiveArgs,
      description: 'Get an element from inside of this element',
      resolve: (root, args) => {
        const html = $(root).html();
        return resolve($.load(html), args);
      },
      type: element,
    },
    count: {
      args: recursiveArgs,
      description: 'Get a count of provided elements',
      resolve: (root, args) => {
        const html = $(root).html();
        const elems = $.load(html)(args.elem);
        return elems.length;
      },
      type: graphql.GraphQLInt,
    },
    classList: {
      description: 'Get a list of the classes on the given element',
      resolve: root => $(root).attr('class').split(' '),
      type: new graphql.GraphQLList(GraphQLString),
    },
    class: {
      description: 'Get the class attribute on the given element',
        resolve: root => $(root).attr('class'),
        type: GraphQLString,
    },
    html: {
      description: 'The inner html of the element',
      resolve: root => $(root).html(),
      type: GraphQLString
    },
    text: {
      description: 'The inner text of the element',
      resolve: root => $(root).text(),
      type: GraphQLString,
    },
    href: {
      description: 'Get the href of the element',
      resolve: root => $(root).attr('href'),
      type: GraphQLString,
    },
    src: {
      description: 'Get the src of the element',
      resolve: root => $(root).attr('src'),
      type: GraphQLString,
    },
    /**
     * Looks for data attribute on element,
     * if the `name` argument is provided
     * then grab the specific `data-${name}`
     * attribute.
     */
    data: {
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
      type: GraphQLString,
    },
    attr: {
      args: {
        name: {
          type: GraphQLString,
        },
      },
      description: 'Get an attribute off of the element',
      resolve: (root, args) => $(root).attr(args.name),
      type: GraphQLString,
    },
  }),
});

module.exports = {
  args: recursiveArgs,
  resolve,
  type: element,
};
