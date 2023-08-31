const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID,GraphQLInt } = graphql;

module.exports = new GraphQLObjectType({
    name:'DesireItem',
    fields: () => ({
        price: { type:GraphQLInt },
        itemId: { type: GraphQLID },
        imageUrl: { type:GraphQLString },
        title: { type:GraphQLString },
    })
})