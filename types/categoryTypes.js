const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;


module.exports = new GraphQLObjectType({
    name:'Categories',
    fields: () => ({
        category: { type: GraphQLString },
        categories: { type: new GraphQLList(GraphQLString) },
    })
})

