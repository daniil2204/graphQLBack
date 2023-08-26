const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,GraphQLInt,Grap } = graphql;

const BucketItem = new GraphQLObjectType({
    name:'BucketItem',
    fields: () => ({
        price: { type:GraphQLInt },
        itemId: { type: GraphQLID },
        count: { type:GraphQLInt },
        imageUrl: { type:GraphQLString },
        title: { type:GraphQLString },
    })
})

const DesireItem = new GraphQLObjectType({
    name:'DesireItem',
    fields: () => ({
        price: { type:GraphQLInt },
        itemId: { type: GraphQLID },
        imageUrl: { type:GraphQLString },
        title: { type:GraphQLString },
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
        desireItems: { type: new GraphQLList(DesireItem)},
        phone: {type: GraphQLString},
    })
})

