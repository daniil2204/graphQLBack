const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;

const ReviewItem = new GraphQLObjectType({
    name:'Review',
    fields: () => ({
        username: { type: GraphQLString },
        text: { type: GraphQLString },
    })
})

module.exports = new GraphQLObjectType({
    name:'Item',
    fields: () => ({
        id: { type:GraphQLID },
        title: { type:GraphQLString },
        category: { type: new GraphQLList(GraphQLString) },
        price: { type:GraphQLInt },
        imageUrl: { type:GraphQLString },
        reviews: { type: new GraphQLList(ReviewItem) },

    })
})

