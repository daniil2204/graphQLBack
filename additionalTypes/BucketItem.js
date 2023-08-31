const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID,GraphQLInt } = graphql;

module.exports = new GraphQLObjectType({
    name:'BucketItem',
    fields: () => ({
        price: { type:GraphQLInt },
        itemId: { type: GraphQLID },
        count: { type:GraphQLInt },
        imageUrl: { type:GraphQLString },
        title: { type:GraphQLString },
    })
})