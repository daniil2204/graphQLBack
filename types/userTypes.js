const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,GraphQLInt,Grap } = graphql;

const BucketItem = new GraphQLObjectType({
    name:'BucketItem',
    fields: () => ({
        userId: { type: GraphQLID },
        price: { type:GraphQLInt },
        itemId: { type: GraphQLID },
        count: { type:GraphQLInt },
    })
})

module.exports = new GraphQLObjectType({
    name:'User',
    fields: () => ({
        id: { type:GraphQLID },
        username: { type:GraphQLString },
        email: { type:GraphQLString },
        password: { type:GraphQLString },
        token: { type:GraphQLString },
        role: { type:GraphQLString },
        bucket: { type: new GraphQLList(BucketItem)},
        phone: {type: GraphQLString},
    })
})

