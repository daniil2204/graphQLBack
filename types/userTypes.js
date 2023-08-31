const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,GraphQLInt } = graphql;

const BucketItem = require('../additionalTypes/BucketItem');
const DesireItem = require('../additionalTypes/DesireItem');

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

