/* eslint-disable no-unused-vars, no-use-before-define */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay';

import {
  User,
  Feature,
  Result,
  Search,
  getResult,
  getResults,
  getUser,
  getFeature,
  getSearch,
  getFeatures
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    console.log(type);
    console.log(id);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Result') {
      return getResult(id);
    } else if (type === 'Search') {
      console.log("yo node ID time: "+ id);
      return getSearch(id);
    } else if (type === 'Feature') {
      return getFeature(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Feature) {
      return featureType;
    } else if (obj instanceof Search) {
      return searchType;
    } else if (obj instanceof Result) {
      return resultType;
    }
    return null;
  }
);

/**
 * Define your own types here
 */

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    features: {
      type: featureConnection,
      description: 'Features that I have',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getFeatures(), args)
    },
    username: {
      type: GraphQLString,
      description: 'Users\'s username'
    },
    website: {
      type: GraphQLString,
      description: 'User\'s website'
    }
  }),
  interfaces: [nodeInterface]
});

const searchType = new GraphQLObjectType({
  name:'Search',
  description: 'A search for products in the app',
  fields: () => ({
    id: globalIdField('Search'),
    results: {
      type: resultConnection,
      description: 'Results that I have',
      args:{ before:{type:GraphQLString},after:{type:GraphQLString}, first:{type:GraphQLInt},last:{type:GraphQLInt},
	      searchStr:{type:GraphQLString}
      },
      resolve: (_, args) => connectionFromPromisedArray(getResults(args.searchStr), args)
    },
    searchTerm:{
      type: GraphQLString,
      description: 'A search string from the user'
    }   
  }),
  interfaces: [nodeInterface]
});

const featureType = new GraphQLObjectType({
  name: 'Feature',
  description: 'Feature integrated in our starter kit',
  fields: () => ({
    id: globalIdField('Feature'),
    name: {
      type: GraphQLString,
      description: 'Name of the feature'
    },
    description: {
      type: GraphQLString,
      description: 'Description of the feature'
    },
    url: {
      type: GraphQLString,
      description: 'Url of the feature'
    }
  }),
  interfaces: [nodeInterface]
});

const resultType = new GraphQLObjectType({
  name: 'Result',
  description: 'The result of a user search',
  fields: () => ({
    id: globalIdField('Result'),
    name: {
      type: GraphQLString,
      description: 'Name of the search'
    },
    price: {
      type: GraphQLString,
      description: 'The price of the item in the result'
    },
    url: {
      type: GraphQLString,
      description: 'The url of the item in the result'
    },
    image:{
      type: GraphQLString,
      description: 'Url for the image of the result'
    }
  }),
  interfaces: [nodeInterface]
})

/**
 * Define your own connection types here
 */
const { connectionType: featureConnection } = connectionDefinitions({ name: 'Feature', nodeType: featureType });
const { connectionType: resultConnection } = connectionDefinitions({ name: 'Result', nodeType: resultType });


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    results: {
      type: resultConnection,
      description: 'Results that I have',
      args:{ before:{type:GraphQLString},after:{type:GraphQLString}, first:{type:GraphQLInt},last:{type:GraphQLInt},
	      searchStr:{type:GraphQLString}
      },
      resolve: (_, args) => connectionFromPromisedArray(getResults(args.searchStr), args)
    },
    search:{
      type: searchType,
      resolve: () => getUser('1')
    },
    viewer: {
      type: userType,
      resolve: () => getUser('1')
    }
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
