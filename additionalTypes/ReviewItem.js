const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString } = graphql;

module.exports = new GraphQLObjectType({
    name:'Review',
    fields: () => ({
        username: { type: GraphQLString },
        text: { type: GraphQLString },
        createdAt: { type: GraphQLString },
    })
})